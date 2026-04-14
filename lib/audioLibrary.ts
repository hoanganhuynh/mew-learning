/**
 * Client-side utilities for the local audio file library.
 *
 * Audio files are stored at:
 *   public/audio-topic-library/{topicSlug}/{lineIndex}.wav
 *
 * They are served as static assets by Next.js from the /public folder,
 * so the browser can access them at:
 *   /audio-topic-library/{topicSlug}/{lineIndex}.wav
 */

// ─── Path helpers ─────────────────────────────────────────────────────────────

/** Convert a topicId to a safe directory name. */
export function topicSlug(topicId: string): string {
  return topicId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Return the public URL for a specific line's local audio file. */
export function localAudioPath(topicId: string, lineIndex: number): string {
  return `/audio-topic-library/${topicSlug(topicId)}/${lineIndex}.mp3`;
}

// ─── Existence checks ─────────────────────────────────────────────────────────

/**
 * Check whether a single local audio file exists.
 * Uses a lightweight HEAD request — no audio data is downloaded.
 */
export async function checkLocalAudio(path: string): Promise<boolean> {
  try {
    const r = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Check whether ALL lines for a topic have been downloaded.
 * Returns { fullyDownloaded, downloadedCount }.
 */
export async function checkTopicDownloadStatus(
  topicId:   string,
  lineCount: number
): Promise<{ fullyDownloaded: boolean; downloadedCount: number }> {
  const checks = await Promise.all(
    Array.from({ length: lineCount }, (_, i) => checkLocalAudio(localAudioPath(topicId, i)))
  );
  const downloadedCount = checks.filter(Boolean).length;
  return { fullyDownloaded: downloadedCount === lineCount, downloadedCount };
}
