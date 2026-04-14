// ─── Core Data Models ────────────────────────────────────────────────────────

export interface DialogueLine {
  id: string;
  characterId: string;        // matches a name in participants[]
  englishText: string;
  vietnameseText: string;
  emotionTone: string;        // e.g. "cheerful", "angry", "neutral" — guides TTS pitch/rate
}

export interface DialogueTopic {
  id: string;
  title: string;
  description: string;        // Brief scene context shown to the learner
  participants: string[];     // e.g. ["Alice", "Bob"]
  lines: DialogueLine[];
  category?: string;          // e.g. "Travel", "Shopping", "Work"
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type SpeechRate = 0.5 | 0.75 | 0.8 | 0.9 | 1.0 | 1.25;
export type VoiceGender = 'male' | 'female';

/** Matches the keys in VOICE_MAP in app/api/tts/route.ts */
export type EdgeVoiceId = 'nova' | 'shimmer' | 'alloy' | 'onyx' | 'echo' | 'fable';

export interface EdgeVoiceOption {
  id:          EdgeVoiceId;
  label:       string;
  gender:      VoiceGender;
  description: string;
}

export const EDGE_VOICES: EdgeVoiceOption[] = [
  { id: 'nova',    label: 'Aria',    gender: 'female', description: 'Clear & bright'   },
  { id: 'shimmer', label: 'Jenny',   gender: 'female', description: 'Warm & friendly'  },
  { id: 'alloy',   label: 'Ava',     gender: 'female', description: 'Expressive'       },
  { id: 'onyx',    label: 'Guy',     gender: 'male',   description: 'Professional'     },
  { id: 'echo',    label: 'Andrew',  gender: 'male',   description: 'Natural & calm'   },
  { id: 'fable',   label: 'Brian',   gender: 'male',   description: 'Deep & clear'     },
];

export interface AppSettings {
  showTranslation: boolean;
  speechRate: SpeechRate;
  voiceName: Record<string, EdgeVoiceId>;  // per-characterId → specific voice
  autoPlay: boolean;
  highlightActiveLines: boolean;
}

// ─── Pronunciation Assessment ─────────────────────────────────────────────────

export interface WordScore {
  word: string;
  score: number;              // 0–100
  correct: boolean;           // true if score >= threshold
}

export interface PronunciationResult {
  overallScore: number;       // 0–100, weighted average
  words: WordScore[];
  recognizedText: string;     // what the browser actually heard
  targetText: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type PracticeMode = 'idle' | 'recording' | 'processing' | 'result';

export interface PracticeState {
  mode: PracticeMode;
  targetLineId: string | null;
  result: PronunciationResult | null;
}

// ─── File Import ──────────────────────────────────────────────────────────────

export interface ImportResult {
  success: boolean;
  topics: DialogueTopic[];
  error?: string;
}
