/**
 * Mock Pronunciation Assessment API Endpoint
 *
 * POST /api/pronunciation
 *
 * Request body:
 *   { targetText: string; recognizedText: string }
 *
 * Response:
 *   { overallScore: number; words: WordScore[]; recognizedText: string; targetText: string }
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * PRODUCTION REPLACEMENT:
 * Replace the mock logic below with a call to Azure Speech Pronunciation
 * Assessment or any other service.  The request / response shapes stay the
 * same, so the front-end requires no changes.
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server';

interface WordScore {
  word: string;
  score: number;
  correct: boolean;
}

interface AssessmentRequest {
  targetText: string;
  recognizedText: string;
}

interface AssessmentResponse {
  overallScore: number;
  words: WordScore[];
  recognizedText: string;
  targetText: string;
}

// Normalize: lowercase, strip punctuation, split on whitespace
function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Simple word-level edit-distance comparison.
 * Returns a score 0–100 for how well `heard` matches `expected`.
 */
function wordSimilarity(expected: string, heard: string): number {
  if (expected === heard) return 100;
  if (!heard) return 0;

  // Levenshtein distance
  const m = expected.length;
  const n = heard.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        expected[i - 1] === heard[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  const dist = dp[m][n];
  const maxLen = Math.max(m, n);
  return Math.round((1 - dist / maxLen) * 100);
}

export async function POST(req: NextRequest): Promise<NextResponse<AssessmentResponse>> {
  const body = (await req.json()) as AssessmentRequest;
  const { targetText, recognizedText } = body;

  const targetWords = normalizeWords(targetText);
  const heardWords = normalizeWords(recognizedText);

  // Map each target word to the closest heard word (simple greedy alignment)
  const words: WordScore[] = targetWords.map((expected, i) => {
    const heard = heardWords[i] ?? '';
    const score = wordSimilarity(expected, heard);
    return {
      word: expected,
      score,
      correct: score >= 70,
    };
  });

  const overallScore =
    words.length > 0
      ? Math.round(words.reduce((sum, w) => sum + w.score, 0) / words.length)
      : 0;

  // Add a small artificial delay to simulate a real API call
  await new Promise((r) => setTimeout(r, 400));

  return NextResponse.json({ overallScore, words, recognizedText, targetText });
}
