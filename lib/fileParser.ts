/**
 * Utilities for importing DialogueTopic data from .json or .xlsx files.
 */

import { DialogueTopic, ImportResult } from '@/types';

// ─── JSON Import ──────────────────────────────────────────────────────────────

function parseJSON(text: string): ImportResult {
  try {
    const data = JSON.parse(text);

    // Support both a single topic object and an array of topics
    const raw: unknown[] = Array.isArray(data) ? data : [data];

    // Basic shape validation
    const topics = raw.filter((item): item is DialogueTopic => {
      const t = item as Record<string, unknown>;
      return (
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        Array.isArray(t.lines)
      );
    });

    if (topics.length === 0) {
      return { success: false, topics: [], error: 'No valid DialogueTopic objects found in the file.' };
    }
    return { success: true, topics };
  } catch {
    return { success: false, topics: [], error: 'Invalid JSON format.' };
  }
}

// ─── XLSX Import ──────────────────────────────────────────────────────────────

/**
 * Parse an Excel file where each sheet is a dialogue topic.
 * Expected columns (first row = headers):
 *   id | characterId | englishText | vietnameseText | emotionTone
 *
 * Sheet name → topic title.
 * We derive a description from the first line's englishText if not provided.
 */
async function parseXLSX(file: File): Promise<ImportResult> {
  try {
    const { read, utils } = await import('xlsx');
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: 'array' });

    const topics: DialogueTopic[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });

      if (rows.length === 0) continue;

      const lines = rows
        .filter((r) => r.id && r.characterId && r.englishText)
        .map((r) => ({
          id: r.id,
          characterId: r.characterId,
          englishText: r.englishText,
          vietnameseText: r.vietnameseText ?? '',
          emotionTone: r.emotionTone ?? 'neutral',
        }));

      // Derive unique participants from lines
      const participants = [...new Set(lines.map((l) => l.characterId))];

      if (lines.length > 0) {
        topics.push({
          id: `imported-${Date.now()}-${sheetName}`,
          title: sheetName,
          description: rows[0].description ?? `Dialogue: ${sheetName}`,
          participants,
          lines,
        });
      }
    }

    if (topics.length === 0) {
      return { success: false, topics: [], error: 'No valid data found in the Excel file.' };
    }

    return { success: true, topics };
  } catch (err) {
    return {
      success: false,
      topics: [],
      error: `Failed to parse Excel file: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ─── Public Entry Point ───────────────────────────────────────────────────────

export async function parseDialogueFile(file: File): Promise<ImportResult> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.json')) {
    const text = await file.text();
    return parseJSON(text);
  }

  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return parseXLSX(file);
  }

  return {
    success: false,
    topics: [],
    error: 'Unsupported file type. Please upload a .json or .xlsx file.',
  };
}

// ─── Mock AI Generation ───────────────────────────────────────────────────────

/**
 * Simulate an AI-powered dialogue generation.
 * In production, replace this body with a POST to your AI backend/LLM endpoint.
 *
 * @param topic  The user-supplied prompt, e.g. "shopping at a supermarket"
 */
export async function generateDialogueFromPrompt(topic: string): Promise<DialogueTopic> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1800));

  const id = `gen-${Date.now()}`;
  const characters = ['Alex', 'Sam'];

  return {
    id,
    title: `Generated: ${topic}`,
    description: `An AI-generated dialogue about "${topic}". Edit or replace with your own content.`,
    participants: characters,
    category: 'AI Generated',
    difficulty: 'intermediate',
    lines: [
      {
        id: `${id}-1`,
        characterId: 'Alex',
        englishText: `Excuse me, could you help me with something related to ${topic}?`,
        vietnameseText: `Xin lỗi, bạn có thể giúp tôi với điều gì đó liên quan đến ${topic} không?`,
        emotionTone: 'polite',
      },
      {
        id: `${id}-2`,
        characterId: 'Sam',
        englishText: `Of course! What would you like to know about ${topic}?`,
        vietnameseText: `Tất nhiên! Bạn muốn biết gì về ${topic}?`,
        emotionTone: 'helpful',
      },
      {
        id: `${id}-3`,
        characterId: 'Alex',
        englishText: `I am completely new to this. Where should I begin?`,
        vietnameseText: `Tôi hoàn toàn mới với điều này. Tôi nên bắt đầu từ đâu?`,
        emotionTone: 'curious',
      },
      {
        id: `${id}-4`,
        characterId: 'Sam',
        englishText: `I suggest starting with the basics and gradually building your confidence.`,
        vietnameseText: `Tôi đề nghị bắt đầu với những điều cơ bản và dần dần xây dựng sự tự tin.`,
        emotionTone: 'encouraging',
      },
      {
        id: `${id}-5`,
        characterId: 'Alex',
        englishText: `That sounds like great advice. Thank you so much!`,
        vietnameseText: `Đó nghe có vẻ là lời khuyên tuyệt vời. Cảm ơn bạn rất nhiều!`,
        emotionTone: 'grateful',
      },
      {
        id: `${id}-6`,
        characterId: 'Sam',
        englishText: `You are very welcome. Good luck with your journey!`,
        vietnameseText: `Không có gì. Chúc bạn may mắn trên hành trình của mình!`,
        emotionTone: 'cheerful',
      },
    ],
  };
}
