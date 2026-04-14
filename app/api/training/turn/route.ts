/**
 * POST /api/training/turn
 *
 * Processes one user turn in a Training Talk session.
 *
 * Request:
 *   {
 *     topic:               string
 *     characterName:       string
 *     characterPersona:    string
 *     conversationHistory: { role: 'character'|'user'; content: string }[]
 *     userTranscript:      string      // empty string = user timed out
 *     timedOut:            boolean
 *   }
 *
 * Response:
 *   {
 *     characterResponse:    string
 *     evaluation:           TurnEvaluation | null   (null when timedOut)
 *     suggestedUserResponse:string     // what the user could have said
 *   }
 *
 * Uses OpenAI gpt-4o-mini when available; falls back to a rich mock.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TurnEvaluation, Correction } from '@/types/training';

interface HistoryItem { role: 'character' | 'user'; content: string }

interface TurnRequest {
  topic:               string;
  characterName:       string;
  characterPersona:    string;
  conversationHistory: HistoryItem[];
  userTranscript:      string;
  timedOut:            boolean;
}

interface TurnResponse {
  characterResponse:    string;
  evaluation:           TurnEvaluation | null;
  suggestedUserResponse:string;
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function openAITurn(body: TurnRequest): Promise<TurnResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const { topic, characterName, characterPersona, conversationHistory, userTranscript, timedOut } = body;

  const historyText = conversationHistory
    .map((m) => `${m.role === 'character' ? characterName : 'Learner'}: ${m.content}`)
    .join('\n');

  const systemPrompt = [
    `You are ${characterName}, a ${characterPersona}.`,
    `You are having a training conversation about "${topic}" with an English language learner.`,
    `\nConversation so far:\n${historyText}`,
    timedOut
      ? `\nThe learner ran out of time and couldn't respond. Gently encourage them and suggest what they could have said, then continue the conversation.`
      : `\nThe learner just said: "${userTranscript}"`,
    `\nProvide a JSON response with EXACTLY this structure:`,
    `{`,
    `  "characterResponse": "Your next line (1-2 sentences, keep conversation flowing, end with question)",`,
    `  "suggestedUserResponse": "A natural example response the learner could have given",`,
    `  "evaluation": ${timedOut ? 'null' : JSON.stringify({
      grammarScore:    '0-100 integer',
      vocabularyScore: '0-100 integer',
      overallScore:    '0-100 integer',
      corrections: [{
        original:    'exact phrase from learner',
        corrected:   'corrected version',
        explanation: 'brief friendly explanation',
        type:        'grammar|vocabulary|fluency',
      }],
      betterResponse:  'a polished version of what the learner said',
      encouragement:   'one sentence of genuine positive feedback',
      isAcceptable:    true,
    })}`,
    `}`,
    `Return ONLY valid JSON. No markdown fences.`,
  ].join(' ');

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        temperature: 0.75,
        max_tokens:  400,
        messages:    [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Respond.' }],
      }),
    });

    if (!res.ok) return null;
    const data    = await res.json();
    const content = (data.choices?.[0]?.message?.content ?? '').replace(/```json|```/g, '').trim();
    return JSON.parse(content) as TurnResponse;
  } catch {
    return null;
  }
}

// ─── Mock Fallback ────────────────────────────────────────────────────────────

// Grammar-check patterns (original regex → correction)
const GRAMMAR_RULES: { re: RegExp; fix: (m: string) => string; msg: string; type: Correction['type'] }[] = [
  { re: /\bi am\b/,             fix: () => 'I am',                msg: '"I" is always capitalised in English.',          type: 'grammar' },
  { re: /\bI goes?\b/,          fix: () => 'I go',                msg: 'Use "go" (not "goes") with "I".',                type: 'grammar' },
  { re: /\bhe go\b/,            fix: () => 'he goes',             msg: 'Third-person singular needs "-s": he goes.',     type: 'grammar' },
  { re: /\byesterday .+ go\b/,  fix: (m) => m.replace('go','went'), msg: 'Use past tense "went" with "yesterday".',     type: 'grammar' },
  { re: /\bdont\b/,             fix: () => "don't",               msg: 'Remember the apostrophe: "don\'t".',             type: 'grammar' },
  { re: /\bcant\b/,             fix: () => "can't",               msg: 'Remember the apostrophe: "can\'t".',             type: 'grammar' },
  { re: /\bmore better\b/,      fix: () => 'better',              msg: '"More better" is redundant — just "better".',    type: 'vocabulary' },
  { re: /\bvery much interesting\b/, fix: () => 'very interesting', msg: '"Very interesting" is more natural.',          type: 'vocabulary' },
];

function mockEvaluate(transcript: string, lastCharLine: string): TurnEvaluation {
  const words     = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Base scores
  let grammar    = 72 + Math.floor(Math.random() * 16);
  let vocabulary = 70 + Math.floor(Math.random() * 18);

  if (wordCount < 3)  { grammar -= 18; vocabulary -= 12; }
  else if (wordCount < 6) { grammar -= 8; }

  // Run grammar rules
  const corrections: Correction[] = [];
  for (const rule of GRAMMAR_RULES) {
    const match = transcript.match(rule.re);
    if (match) {
      corrections.push({
        original:    match[0],
        corrected:   rule.fix(match[0]),
        explanation: rule.msg,
        type:        rule.type,
      });
      grammar -= 6;
    }
  }

  grammar    = Math.min(100, Math.max(30, grammar));
  vocabulary = Math.min(100, Math.max(30, vocabulary));
  const overall = Math.round((grammar * 0.5 + vocabulary * 0.5));

  const encouragements = [
    'Great effort — keep going!',
    'You expressed yourself clearly!',
    'Good response! Your vocabulary is growing.',
    'Nice work! A few small tweaks and it would be perfect.',
    'Well done — that sounded natural!',
    'You are making great progress!',
  ];

  const betterTemplates = [
    `A more fluent way: "${transcript.charAt(0).toUpperCase() + transcript.slice(1).trimEnd()}."`,
    `You could also say: "I think ${transcript.toLowerCase().replace(/^(i think |i believe )/i, '')}."`,
    `Try: "${transcript}" — just add a little more detail to sound more natural.`,
  ];

  return {
    grammarScore:    grammar,
    vocabularyScore: vocabulary,
    overallScore:    overall,
    corrections,
    betterResponse:  betterTemplates[Math.floor(Math.random() * betterTemplates.length)],
    encouragement:   encouragements[Math.floor(Math.random() * encouragements.length)],
    isAcceptable:    wordCount >= 3,
  };
}

// Context-aware follow-up responses
const FOLLOWUP_BANK = [
  "That is a really interesting perspective! What made you think about it that way?",
  "I like how you put that. Can you tell me a bit more about your experience with this?",
  "Fascinating! Have you always felt that way, or did something change your mind recently?",
  "Great point! Do you think most people in your situation feel the same?",
  "That makes a lot of sense. What would you say is the biggest challenge you face with this topic?",
  "I had not thought of it that way before! How long have you been interested in this?",
  "You raise a good point. What advice would you give to someone just starting out?",
  "Interesting! And what do you think the future looks like for this area?",
];

const TIMEOUT_RESPONSES = [
  "No worries — it happens! Here is an idea of what you could have said. Try repeating it now!",
  "Take your time! It can be hard to find the words quickly. Let me suggest something you could say.",
  "Don't worry — everyone needs a moment sometimes. Here is a phrase you can try!",
];

const SUGGESTED_RESPONSES = [
  "I think that's a really important point, and I'd like to learn more about it.",
  "In my experience, this topic comes up a lot, and I find it quite interesting.",
  "That's a good question. I believe the key thing to consider is the overall impact.",
  "I agree with that to some extent, although I think there are different perspectives.",
  "From what I've seen, it really depends on the specific situation and context.",
];

function mockTurn(body: TurnRequest): TurnResponse {
  const { userTranscript, timedOut, conversationHistory, topic } = body;

  const characterResponse = timedOut
    ? TIMEOUT_RESPONSES[Math.floor(Math.random() * TIMEOUT_RESPONSES.length)]
    : FOLLOWUP_BANK[conversationHistory.length % FOLLOWUP_BANK.length];

  const suggestedUserResponse =
    SUGGESTED_RESPONSES[Math.floor(Math.random() * SUGGESTED_RESPONSES.length)];

  const lastCharLine = conversationHistory.filter((m) => m.role === 'character').at(-1)?.content ?? '';

  const evaluation = timedOut || !userTranscript.trim()
    ? null
    : mockEvaluate(userTranscript, lastCharLine);

  return { characterResponse, evaluation, suggestedUserResponse };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<TurnResponse>> {
  const body = (await req.json()) as TurnRequest;

  // Simulate ~300ms processing time even for mock (feels more realistic)
  const ai = await openAITurn(body);
  if (ai) return NextResponse.json(ai);

  await new Promise((r) => setTimeout(r, 350));
  return NextResponse.json(mockTurn(body));
}
