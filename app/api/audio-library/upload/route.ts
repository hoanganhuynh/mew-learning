/**
 * POST /api/audio-library/upload
 *
 * Accepts a manually uploaded audio file (WAV, MP3, OGG, …) from the user
 * and saves it to:
 *   public/audio-topic-library/{topicSlug}/{lineIndex}.wav
 *
 * Body: multipart/form-data
 *   topicId   string
 *   lineIndex number (as string)
 *   file      File   (any audio format the browser can play)
 *
 * The file is saved with a .wav extension regardless of original format —
 * the browser plays it fine as long as the bytes are a valid audio container.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function topicSlug(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const topicId   = formData.get('topicId')   as string | null;
  const lineIdxRaw = formData.get('lineIndex') as string | null;
  const file       = formData.get('file')      as File | null;

  if (!topicId || lineIdxRaw == null || !file) {
    return NextResponse.json(
      { error: 'topicId, lineIndex, and file are required' },
      { status: 400 }
    );
  }

  const lineIndex = parseInt(lineIdxRaw, 10);
  if (isNaN(lineIndex) || lineIndex < 0) {
    return NextResponse.json({ error: 'lineIndex must be a non-negative integer' }, { status: 400 });
  }

  // Accept any audio MIME type
  if (!file.type.startsWith('audio/') && file.type !== 'application/octet-stream') {
    return NextResponse.json(
      { error: `File must be an audio file. Received: ${file.type}` },
      { status: 400 }
    );
  }

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const slug     = topicSlug(topicId);
  const dir      = path.join(process.cwd(), 'public', 'audio-topic-library', slug);
  const filePath = path.join(dir, `${lineIndex}.mp3`);

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(filePath, buffer);
  } catch (err) {
    console.error('[AudioUpload] Write error:', err);
    return NextResponse.json({ error: 'Failed to save uploaded file' }, { status: 500 });
  }

  return NextResponse.json({
    ok:       true,
    path:     `/audio-topic-library/${slug}/${lineIndex}.mp3`,
    fileName: file.name,
    bytes:    buffer.length,
  });
}
