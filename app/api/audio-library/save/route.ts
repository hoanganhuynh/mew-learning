/**
 * POST /api/audio-library/save
 *
 * Generates TTS audio for one dialogue line via Microsoft Edge TTS (free)
 * and saves it as an MP3 file to:
 *   public/audio-topic-library/{topicSlug}/{lineIndex}.mp3
 *
 * Body: { topicId: string; lineIndex: number; text: string; openaiVoice: string }
 *
 * No API key required — Edge TTS is completely free.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// ─── Vercel guard ─────────────────────────────────────────────────────────────
// Vercel's filesystem is read-only — saving audio files to public/ is only
// possible when running the app locally (Next.js dev or production build).

const IS_SERVERLESS = !!(process.env.VERCEL || process.env.VERCEL_ENV);

// ─── Types ────────────────────────────────────────────────────────────────────

interface SaveRequest {
  topicId:     string;
  lineIndex:   number;
  text:        string;
  openaiVoice: string; // 'nova' | 'onyx' | … mapped to Edge voice names
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function topicSlug(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

const VOICE_MAP: Record<string, string> = {
  nova:    'en-US-AriaNeural',
  shimmer: 'en-US-JennyNeural',
  alloy:   'en-US-AvaNeural',
  onyx:    'en-US-GuyNeural',
  echo:    'en-US-AndrewNeural',
  fable:   'en-US-BrianNeural',
};

function edgeVoice(v: string): string {
  return VOICE_MAP[v] ?? 'en-US-AriaNeural';
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (IS_SERVERLESS) {
    return NextResponse.json(
      { error: 'filesystem-unavailable', message: 'This feature requires a local server. Audio files cannot be saved on Vercel.' },
      { status: 501 }
    );
  }

  const body = (await req.json()) as SaveRequest;
  const { topicId, lineIndex, text, openaiVoice = 'nova' } = body;

  if (!topicId || lineIndex == null || !text?.trim()) {
    return NextResponse.json(
      { error: 'topicId, lineIndex, and text are required' },
      { status: 400 }
    );
  }

  const voiceName = edgeVoice(openaiVoice);
  const tts       = new MsEdgeTTS();

  let audioBuffer: Buffer;

  try {
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(xmlEscape(text.slice(0, 4096)));

    audioBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      audioStream.on('data',  (chunk: Buffer) => chunks.push(chunk));
      audioStream.on('close', ()              => resolve(Buffer.concat(chunks)));
      audioStream.on('error', reject);
    });

    tts.close();
  } catch (err) {
    tts.close();
    console.error('[AudioLib/Edge]', err);
    return NextResponse.json(
      { error: 'Edge TTS generation failed', detail: String(err) },
      { status: 502 }
    );
  }

  // ── Save to public/ ─────────────────────────────────────────────────────────
  const slug     = topicSlug(topicId);
  const dir      = path.join(process.cwd(), 'public', 'audio-topic-library', slug);
  const filePath = path.join(dir, `${lineIndex}.mp3`);

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, audioBuffer);
  } catch (err) {
    console.error('[AudioLib] Write error:', err);
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 });
  }

  return NextResponse.json({
    ok:    true,
    path:  `/audio-topic-library/${slug}/${lineIndex}.mp3`,
    voice: voiceName,
    bytes: audioBuffer.length,
  });
}
