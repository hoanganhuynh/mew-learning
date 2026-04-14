/**
 * POST /api/translate
 * Body:    { text: string }
 * Returns: { vietnamese, phonetic, partOfSpeech, englishDef }
 *
 * Translation pipeline:
 *  1. @vitalets/google-translate-api  — Google quality, free, no key
 *  2. MyMemory API                    — fallback, also free, no key
 *
 * Dictionary (single words only):
 *  dictionaryapi.dev — phonetics, part of speech, short definition
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Vietnamese translation ────────────────────────────────────────────────────

async function translateViaGoogle(text: string): Promise<string> {
  // Dynamic import avoids ESM/CJS issues with Next.js bundler.
  // The package is also listed in serverExternalPackages so webpack won't touch it.
  const { translate } = await import('@vitalets/google-translate-api');
  const result = await translate(text, { from: 'en', to: 'vi' });
  return result.text ?? '';
}

async function translateViaMyMemory(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;
  const res  = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return '';
  const data = await res.json() as { responseData?: { translatedText?: string } };
  const raw  = data.responseData?.translatedText ?? '';
  // MyMemory sometimes returns the source text unchanged on failure
  return raw.toLowerCase() === text.toLowerCase() ? '' : raw;
}

async function getVietnamese(text: string): Promise<string> {
  try {
    const result = await translateViaGoogle(text);
    if (result) return result;
  } catch { /* fall through */ }

  try {
    return await translateViaMyMemory(text);
  } catch { /* give up */ }

  return '';
}

// ─── English dictionary (single words only) ───────────────────────────────────

interface DictEntry {
  phonetic?:  string;
  phonetics?: { text?: string }[];
  meanings?:  {
    partOfSpeech?: string;
    definitions?:  { definition?: string; example?: string }[];
  }[];
}

async function getDictData(word: string): Promise<{ phonetic: string; partOfSpeech: string; englishDef: string }> {
  const empty = { phonetic: '', partOfSpeech: '', englishDef: '' };
  if (word.includes(' ')) return empty; // skip for phrases

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return empty;

    const data   = await res.json() as DictEntry[];
    const entry  = data[0];
    if (!entry) return empty;

    const phonetic    = entry.phonetic
      ?? entry.phonetics?.find((p) => p.text)?.text
      ?? '';
    const meaning     = entry.meanings?.[0];
    const partOfSpeech = meaning?.partOfSpeech ?? '';
    const englishDef  = meaning?.definitions?.[0]?.definition ?? '';

    return { phonetic, partOfSpeech, englishDef };
  } catch {
    return empty;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { text } = (await req.json()) as { text?: string };
  const trimmed  = (text ?? '').trim().slice(0, 300);

  if (!trimmed) {
    return NextResponse.json({ vietnamese: '', phonetic: '', partOfSpeech: '', englishDef: '' });
  }

  // Run translation and dictionary lookup in parallel
  const [vietnamese, dict] = await Promise.all([
    getVietnamese(trimmed),
    getDictData(trimmed),
  ]);

  return NextResponse.json({
    vietnamese,
    phonetic:    dict.phonetic,
    partOfSpeech: dict.partOfSpeech,
    englishDef:  dict.englishDef,
  });
}
