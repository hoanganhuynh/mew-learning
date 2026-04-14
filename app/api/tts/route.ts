/**
 * Server-side TTS endpoint — Microsoft Edge TTS (free, no API key needed).
 *
 * POST /api/tts
 * Body: { text: string; voice?: string; rate?: number }
 *
 * Returns: audio/mpeg (MP3, 24 kHz 96 kbps)
 * Returns: 503 on failure → client falls back to Web Speech API
 *
 * ── Voice names ───────────────────────────────────────────────────────────────
 *  Client sends OpenAI-style gender hints ('nova' = female, 'onyx' = male).
 *  We map them to Edge TTS neural voice names here.
 *
 * ── Rate ─────────────────────────────────────────────────────────────────────
 *  Edge TTS supports rate natively (1.0 = normal, 0.5 = half, 2.0 = double).
 *  We also apply playbackRate client-side for cached blobs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// ─── Voice mapping ────────────────────────────────────────────────────────────

const VOICE_MAP: Record<string, string> = {
  // female voices
  nova:    'en-US-AriaNeural',    // bright, clear — default female
  shimmer: 'en-US-JennyNeural',  // warm, friendly
  alloy:   'en-US-AvaNeural',    // expressive, natural

  // male voices
  onyx:    'en-US-GuyNeural',    // professional — default male
  echo:    'en-US-AndrewNeural', // natural, calm
  fable:   'en-US-BrianNeural',  // deep, clear
};

function edgeVoice(openaiName: string): string {
  return VOICE_MAP[openaiName] ?? 'en-US-AriaNeural';
}

// ─── Simple XML escape (prevent SSML injection) ───────────────────────────────

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
  const body      = await req.json() as { text?: string; voice?: string; rate?: number };
  const text      = (body.text ?? '').trim().slice(0, 4096);
  const voiceName = edgeVoice(body.voice ?? 'nova');
  const rate      = Math.min(3.0, Math.max(0.25, body.rate ?? 1.0));

  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const tts = new MsEdgeTTS();

  try {
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(xmlEscape(text), { rate });

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      audioStream.on('data',  (chunk: Buffer) => chunks.push(chunk));
      audioStream.on('close', ()              => resolve(Buffer.concat(chunks)));
      audioStream.on('error', reject);
    });

    tts.close();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':  'audio/mpeg',
        'X-TTS-Voice':   voiceName,
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err) {
    tts.close();
    console.error('[TTS/Edge]', err);
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 503 });
  }
}
