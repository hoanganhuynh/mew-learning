/**
 * POST /api/training/start
 *
 * Generates the character's opening line for a Training Talk session.
 *
 * Request:  { topic: string; characterName: string; characterPersona: string }
 * Response: { openingMessage: string; suggestedUserOpener: string }
 *
 * Uses OpenAI gpt-4o-mini when OPENAI_API_KEY is set; falls back to a
 * rich topic-aware mock otherwise.
 */

import { NextRequest, NextResponse } from 'next/server';

interface StartRequest {
  topic:            string;
  characterName:    string;
  characterPersona: string;
}

interface StartResponse {
  openingMessage:      string;
  suggestedUserOpener: string;   // hint so user knows what to say
}

// ─── OpenAI helper ────────────────────────────────────────────────────────────

async function openAIOpening(
  topic: string,
  characterName: string,
  characterPersona: string
): Promise<{ opening: string; hint: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.85,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: [
              `You are ${characterName}, a ${characterPersona}.`,
              `Start a friendly English conversation with a language learner about: "${topic}".`,
              `Rules: 1-2 sentences max. End with a question to engage the learner.`,
              `Also provide a short example of what the learner could say in response (for their reference).`,
              `Return valid JSON only: { "opening": "...", "hint": "e.g. You could say: ..." }`,
            ].join(' '),
          },
          { role: 'user', content: 'Begin.' },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content ?? '';
    // Extract JSON from the response (it may be wrapped in markdown fences)
    const jsonStr = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

const MOCK_TEMPLATES: { test: RegExp; opening: string[]; hint: string[] }[] = [
  {
    test: /ui|ux|design|figma|prototype|wireframe|usability/i,
    opening: [
      "Great topic! I'm really passionate about UX design myself. What aspect of design are you most curious about — research, interaction design, or visual?",
      "Oh, design is such a fascinating field! Are you currently working on any design projects, or are you looking to get started?",
      "I love talking about UI/UX! One thing I always debate with colleagues is whether to start with wireframes or user research. What do you think?",
    ],
    hint: [
      "e.g. \"I'm most interested in user research and understanding what people need.\"",
      "e.g. \"I'm working on a mobile app redesign and learning about prototyping.\"",
      "e.g. \"I think user research should always come first before any wireframing.\"",
    ],
  },
  {
    test: /coffee|café|restaurant|food|cooking|eat/i,
    opening: [
      "Oh, I could talk about coffee all day! Do you have a favourite type of coffee, or are you more of a tea person?",
      "Food is such a great conversation topic! Are you someone who likes to cook, or do you prefer eating out?",
      "I just tried a new café last weekend — amazing! Do you have a go-to coffee order, or do you like to try new things?",
    ],
    hint: [
      "e.g. \"I love lattes, especially iced ones in summer.\"",
      "e.g. \"I enjoy cooking on weekends but eat out during the week.\"",
      "e.g. \"I usually order an Americano, but I like trying seasonal specials.\"",
    ],
  },
  {
    test: /work|job|career|office|interview|professional/i,
    opening: [
      "Career development is so important! What field are you working in, or hoping to work in?",
      "I find that talking about work in English can be really challenging at first. What work situation do you find most difficult to discuss?",
      "Let's talk shop! Are you preparing for a specific work scenario, like a job interview or a presentation?",
    ],
    hint: [
      "e.g. \"I work in technology and I'm preparing for English-speaking meetings.\"",
      "e.g. \"I find small talk at the beginning of meetings the hardest part.\"",
      "e.g. \"Yes, I have a job interview next week and I want to sound confident.\"",
    ],
  },
  {
    test: /travel|trip|holiday|vacation|hotel|flight|airport/i,
    opening: [
      "I love travel topics! Have you been anywhere interesting recently, or is there a dream destination you are planning to visit?",
      "Travelling is such a great way to practice English! Do you find it easy to communicate when you travel?",
      "Let's talk travel! If you could go anywhere in the world right now, where would you go and why?",
    ],
    hint: [
      "e.g. \"I went to Japan last year and it was amazing!\"",
      "e.g. \"I sometimes find it hard to ask for help or directions in English.\"",
      "e.g. \"I would love to visit Iceland because of the northern lights.\"",
    ],
  },
  {
    test: /health|doctor|medicine|exercise|fitness|sport/i,
    opening: [
      "Health is such an important topic! Do you have any regular exercise habits, or are you looking to start something new?",
      "It is so useful to know health vocabulary! Have you ever had to explain symptoms to a doctor in English?",
      "Let's talk about staying healthy! What do you find most challenging about maintaining good habits?",
    ],
    hint: [
      "e.g. \"I go running three times a week but I want to add yoga.\"",
      "e.g. \"Yes, I once had to describe a headache to a doctor — it was tricky!\"",
      "e.g. \"I find it hard to keep a regular sleep schedule.\"",
    ],
  },
  {
    test: /.*/,   // catch-all
    opening: [
      "That is a fascinating topic to explore! What got you interested in {topic}, and what would you most like to discuss about it?",
      "I am really looking forward to chatting about {topic}! Have you had much chance to discuss this in English before?",
      "Great choice! There is so much we can cover about {topic}. Where would you like to start — maybe share what you already know?",
    ],
    hint: [
      "e.g. \"I'm interested in {topic} because it's relevant to my work and I want to discuss it confidently.\"",
      "e.g. \"Not much, but I'm excited to practice — I often struggle to find the right words.\"",
      "e.g. \"I know the basics and I'd love to learn more specific vocabulary.\"",
    ],
  },
];

function mockOpening(
  topic: string,
  characterName: string
): { opening: string; hint: string } {
  const template = MOCK_TEMPLATES.find((t) => t.test.test(topic)) ?? MOCK_TEMPLATES.at(-1)!;
  const idx      = Math.floor(Math.random() * template.opening.length);
  return {
    opening: template.opening[idx].replace(/\{topic\}/g, topic),
    hint:    template.hint[idx % template.hint.length].replace(/\{topic\}/g, topic),
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<StartResponse>> {
  const { topic, characterName, characterPersona } = (await req.json()) as StartRequest;

  // Try OpenAI first
  const ai = await openAIOpening(topic, characterName, characterPersona);

  const opening = ai?.opening ?? mockOpening(topic, characterName).opening;
  const hint    = ai?.hint    ?? mockOpening(topic, characterName).hint;

  return NextResponse.json({ openingMessage: opening, suggestedUserOpener: hint });
}
