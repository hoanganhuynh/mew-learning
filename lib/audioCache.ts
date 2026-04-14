/**
 * Two-layer audio cache for OpenAI TTS blobs.
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │  L1 — In-memory Map<cacheKey, Blob>                                        │
 * │    • Instant (< 1 ms)                                                      │
 * │    • Lost on page reload                                                   │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │  L2 — IndexedDB (object store: "audio-blobs")                              │
 * │    • Persists across page reloads and browser restarts                     │
 * │    • Typically 50 MB – several GB depending on the browser                 │
 * │    • Read adds the blob to L1 so subsequent plays are instant              │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * Cache key = `${voice}|${speed}|${text}` (no hashing — keys stay readable
 * and collisions are impossible given the full text is the key).
 *
 * Public API
 * ──────────
 *   buildCacheKey(text, voice, speed)   → string
 *   isCachedInMemory(key)               → boolean   (synchronous)
 *   getAudio(key)                       → Promise<Blob | null>
 *   putAudio(key, blob)                 → Promise<void>
 *   clearAll()                          → Promise<void>
 *   getCacheStats()                     → Promise<{ count, totalBytes }>
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const DB_NAME    = 'english-learner-audio';
const DB_VERSION = 1;
const STORE_NAME = 'audio-blobs';

// ─── L1 — in-memory cache ─────────────────────────────────────────────────────

const memoryCache = new Map<string, Blob>();

// ─── L2 — IndexedDB helpers ───────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME); // key-value: cacheKey → Blob
      }
    };

    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror   = ()  => reject(new Error('Failed to open IndexedDB'));
  });
}

async function idbGet(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx      = db.transaction(STORE_NAME, 'readonly');
      const store   = tx.objectStore(STORE_NAME);
      const req     = store.get(key);
      req.onsuccess = () => resolve((req.result as Blob) ?? null);
      req.onerror   = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbPut(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx      = db.transaction(STORE_NAME, 'readwrite');
      const store   = tx.objectStore(STORE_NAME);
      const req     = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(new Error('IndexedDB write failed'));
    });
  } catch {
    // Non-fatal — cache miss on next load is acceptable
    console.warn('[AudioCache] IndexedDB write failed — audio will not persist.');
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build the cache key for a given TTS request.
 * Changing any parameter produces a different key → no stale audio.
 */
export function buildCacheKey(text: string, voice: string, speed: number): string {
  // Normalise speed to 2 decimal places to avoid floating-point key drift
  return `${voice}|${speed.toFixed(2)}|${text}`;
}

/** Synchronous L1 check — useful for rendering the ⚡ cached icon immediately. */
export function isCachedInMemory(key: string): boolean {
  return memoryCache.has(key);
}

/**
 * Look up a blob by key.
 * Checks L1 first; falls through to IndexedDB.
 * On an L2 hit, populates L1 so the next call is instant.
 */
export async function getAudio(key: string): Promise<Blob | null> {
  // L1 hit
  const mem = memoryCache.get(key);
  if (mem) return mem;

  // L2 hit
  const stored = await idbGet(key);
  if (stored) {
    memoryCache.set(key, stored); // warm L1
    return stored;
  }

  return null;
}

/**
 * Store a blob in both layers.
 * Called after a successful fetch from the TTS API.
 */
export async function putAudio(key: string, blob: Blob): Promise<void> {
  memoryCache.set(key, blob);    // L1 — immediate
  await idbPut(key, blob);       // L2 — persistent
}

/** Remove all cached audio (both layers). */
export async function clearAll(): Promise<void> {
  memoryCache.clear();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx      = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject();
    });
  } catch {
    // Ignore
  }
}

/** Diagnostic: return the number of cached entries and total bytes in IndexedDB. */
export async function getCacheStats(): Promise<{ count: number; totalBytes: number }> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx    = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      let count   = 0;
      let bytes   = 0;

      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          count++;
          bytes += (cursor.value as Blob).size ?? 0;
          cursor.continue();
        } else {
          resolve({ count, totalBytes: bytes });
        }
      };
      req.onerror = () => resolve({ count: 0, totalBytes: 0 });
    });
  } catch {
    return { count: 0, totalBytes: 0 };
  }
}
