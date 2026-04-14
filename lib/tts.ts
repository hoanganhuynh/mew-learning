/**
 * Text-to-Speech service — two-tier delivery + persistent audio cache.
 *
 * ── Delivery tiers ────────────────────────────────────────────────────────────
 *  Tier 1 (preferred) — OpenAI TTS via /api/tts
 *    High-quality, natural voices. Requires OPENAI_API_KEY in .env.local.
 *    Voices:  female → "nova"   male → "onyx"
 *
 *  Tier 2 (fallback) — Web Speech API (SpeechSynthesis)
 *    Zero-config, works in all modern browsers.
 *    Activated automatically when API key is absent or the request fails.
 *
 * ── Caching (Tier 1 only) ─────────────────────────────────────────────────────
 *  Generated MP3 blobs are stored in:
 *    L1 — in-memory Map   (instant, same session)
 *    L2 — IndexedDB       (persists across page reloads / F5)
 *
 *  First click  → fetch from OpenAI → save to L1 + L2 → play
 *  Next clicks  → read from L1/L2   → play instantly   (no API call)
 *
 * ── Swapping providers ────────────────────────────────────────────────────────
 *  Change /api/tts/route.ts only. This file stays the same.
 */

import type { AppSettings, VoiceGender } from '@/types';
import {
  buildCacheKey,
  getAudio,
  putAudio,
  isCachedInMemory,
} from './audioCache';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TTSOptions {
  rate?:      number;
  pitch?:     number;         // Web Speech fallback only
  gender?:    VoiceGender;
  voice?:     string;         // specific Edge voice ID (e.g. 'nova', 'shimmer') — takes priority over gender
  lang?:      string;
  /**
   * If set, the audio is served from this local file path (e.g.
   * '/audio-topic-library/topic-1/0.wav') instead of calling the TTS API.
   * The library does a HEAD check first; if the file does not exist it
   * falls through to the normal Gemini → OpenAI → Web Speech chain.
   */
  localFile?: string;
  onEnd?:     () => void;
  onError?:   (e: unknown) => void;
}

/** Status of an audio asset for a given (text + voice + speed) combination. */
export type AudioCacheStatus = 'uncached' | 'cached';

// ─── Module-level playback state ─────────────────────────────────────────────

let _audio: HTMLAudioElement | null = null;
let _utterance: SpeechSynthesisUtterance | null = null;

// ─── Voice helpers ────────────────────────────────────────────────────────────

export function openAIVoice(gender: VoiceGender): string {
  return gender === 'male' ? 'onyx' : 'nova';
}

function pickWebSpeechVoice(lang: string, gender: VoiceGender): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === 'undefined') return null;
  const voices  = speechSynthesis.getVoices();
  const prefix  = lang.toLowerCase().slice(0, 2);
  const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  const femKw   = ['female','woman','nova','samantha','victoria','karen','moira','tessa','zira','fiona'];
  const malKw   = ['male','man','daniel','alex','mark','david','reed','onyx','echo'];
  const kw      = gender === 'female' ? femKw : malKw;
  return matching.find((v) => kw.some((k) => v.name.toLowerCase().includes(k))) ?? matching[0] ?? null;
}

// ─── Cache key helper (re-exported for use in UI components) ─────────────────

export { buildCacheKey, isCachedInMemory };

// ─── Tier 2: Web Speech API ───────────────────────────────────────────────────

function speakWebSpeech(text: string, options: TTSOptions): boolean {
  if (typeof speechSynthesis === 'undefined') return false;
  speechSynthesis.cancel();

  const { rate = 1.0, pitch = 1.0, gender = 'female', lang = 'en-US', onEnd, onError } = options;
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = lang;
  utt.rate   = rate;
  utt.pitch  = pitch;

  const assign = () => {
    const v = pickWebSpeechVoice(lang, gender);
    if (v) utt.voice = v;
  };
  if (speechSynthesis.getVoices().length > 0) assign();
  else { speechSynthesis.onvoiceschanged = () => { assign(); speechSynthesis.onvoiceschanged = null; }; }

  if (onEnd)   utt.onend   = onEnd;
  if (onError) utt.onerror = onError as () => void;
  _utterance = utt;
  speechSynthesis.speak(utt);
  return true;
}

// ─── Tier 1: OpenAI TTS + cache ──────────────────────────────────────────────

/**
 * Internal: play a Blob as audio and wire up lifecycle callbacks.
 * `rate` is applied via HTMLAudioElement.playbackRate so Gemini audio
 * (which is always generated at 1×) still respects the user's speed setting.
 */
function playBlob(blob: Blob, onEnd?: () => void, onError?: (e: unknown) => void, rate = 1.0): void {
  const url   = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.playbackRate = Math.min(4.0, Math.max(0.25, rate));
  _audio = audio;

  audio.onended = () => {
    URL.revokeObjectURL(url);
    _audio = null;
    onEnd?.();
  };
  audio.onerror = (e) => {
    URL.revokeObjectURL(url);
    _audio = null;
    onError?.(e);
  };

  audio.play().catch((e) => {
    URL.revokeObjectURL(url);
    _audio = null;
    onError?.(e);
  });
}

/**
 * Speak via OpenAI TTS.
 *  1. Check L1/L2 cache → play immediately if found.
 *  2. Fetch from API    → save to cache → play.
 *
 * Returns `true` on success (cached or fetched), `false` if unavailable.
 */
async function speakOpenAI(text: string, options: TTSOptions): Promise<boolean> {
  const { rate = 1.0, gender = 'female', onEnd, onError } = options;
  const voice = options.voice ?? openAIVoice(gender);
  const key   = buildCacheKey(text, voice, rate);

  // ── Cache hit ──
  const cached = await getAudio(key);
  if (cached) {
    playBlob(cached, onEnd, onError, rate);
    return true;
  }

  // ── Cache miss → fetch ──
  try {
    const res = await fetch('/api/tts', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      // Speed is sent for OpenAI; Gemini ignores it and we apply playbackRate instead
      body:    JSON.stringify({ text, voice, speed: rate }),
    });

    if (res.status === 503) return false; // no API key → fallback
    if (!res.ok)            return false;

    const blob = await res.blob();

    // Save to both cache layers (non-blocking write)
    putAudio(key, blob).catch(() => {/* ignore write errors */});

    playBlob(blob, onEnd, onError, rate);
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Speak `text`.
 *
 * Priority:
 *  1. Local file (options.localFile) — served from public/audio-topic-library/
 *  2. OpenAI / Gemini TTS via /api/tts (with IndexedDB caching)
 *  3. Web Speech API fallback
 */
export function speak(text: string, options: TTSOptions = {}): void {
  stop();

  const { localFile, rate = 1.0 } = options;

  if (localFile) {
    // ── Try local file first ────────────────────────────────────────────────
    fetch(localFile, { method: 'HEAD', cache: 'no-store' })
      .then((r) => {
        if (r.ok) {
          // File exists — fetch blob and play (bypasses TTS API entirely)
          return fetch(localFile)
            .then((r2) => r2.blob())
            .then((blob) => playBlob(blob, options.onEnd, options.onError, rate))
            .catch(() => {
              // Fetch failed — fall through to TTS
              speakOpenAI(text, options).then((ok) => { if (!ok) speakWebSpeech(text, options); });
            });
        } else {
          // File not found — fall through to TTS
          speakOpenAI(text, options).then((ok) => { if (!ok) speakWebSpeech(text, options); });
        }
      })
      .catch(() => {
        speakOpenAI(text, options).then((ok) => { if (!ok) speakWebSpeech(text, options); });
      });
  } else {
    speakOpenAI(text, options).then((ok) => {
      if (!ok) speakWebSpeech(text, options);
    });
  }
}

/** Stop any in-progress playback. */
export function stop(): void {
  if (_audio) { _audio.pause(); _audio = null; }
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  _utterance = null;
}

/** True if audio is currently playing. */
export function isSpeaking(): boolean {
  if (_audio && !_audio.paused) return true;
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking) return true;
  return false;
}

/**
 * Synchronous check: is this (text + voice + rate) already in the L1 memory cache?
 * `voiceId` is an Edge voice id like 'nova', 'onyx', etc.
 */
export function isMemoryCached(text: string, voiceId: string, rate: number): boolean {
  return isCachedInMemory(buildCacheKey(text, voiceId, rate));
}

/**
 * Async check: is this (text + voice + rate) cached in L1 or L2 (IndexedDB)?
 */
export async function checkCacheStatus(
  text: string,
  voiceId: string,
  rate: number
): Promise<AudioCacheStatus> {
  const key    = buildCacheKey(text, voiceId, rate);
  const cached = await getAudio(key);
  return cached ? 'cached' : 'uncached';
}

// ─── Settings helper ──────────────────────────────────────────────────────────

export function buildTTSOptions(
  characterId: string,
  settings: AppSettings,
  emotionTone: string,
  onEnd?: () => void
): TTSOptions {
  const voice  = settings.voiceName[characterId] ?? 'nova';

  let pitch = 1.0;
  switch (emotionTone) {
    case 'cheerful': case 'excited': case 'enthusiastic': pitch = 1.15; break;
    case 'angry':    case 'frustrated':                   pitch = 0.85; break;
    case 'tired':    case 'sad': case 'uncomfortable':    pitch = 0.9;  break;
    case 'nervous':  case 'curious':                      pitch = 1.1;  break;
  }

  return { rate: settings.speechRate, pitch, voice, lang: 'en-US', onEnd };
}
