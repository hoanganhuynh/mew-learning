// ─── Training Talk — Type Definitions ────────────────────────────────────────

/** A single language correction on a user's utterance. */
export interface Correction {
  original:    string;
  corrected:   string;
  explanation: string;
  type:        'grammar' | 'vocabulary' | 'pronunciation' | 'fluency';
}

/** AI evaluation of one user turn. */
export interface TurnEvaluation {
  grammarScore:     number;      // 0-100
  vocabularyScore:  number;      // 0-100
  overallScore:     number;      // 0-100 weighted
  corrections:      Correction[];
  betterResponse:   string;      // model answer for what the user meant
  encouragement:    string;      // short positive message
  isAcceptable:     boolean;     // contextually appropriate response?
}

/** One exchange in the conversation (character or user side). */
export interface TrainingMessage {
  id:                string;
  role:              'character' | 'user';
  text:              string;               // spoken / transcribed text
  evaluation?:       TurnEvaluation;       // only on user turns
  timedOut?:         boolean;              // true if user ran out of time
  suggestedResponse?:string;              // shown when user timed out
  timestamp:         number;
}

/** A full practice session. */
export interface TrainingSession {
  id:               string;
  topic:            string;
  characterName:    string;
  characterPersona: string;
  messages:         TrainingMessage[];
  startedAt:        number;
  endedAt?:         number;
  overallScore?:    number;   // average of all user turn scores
  turnCount:        number;   // how many user turns were completed
}

/** Pre-built character options. */
export interface CharacterOption {
  name:        string;
  persona:     string;        // description used in the AI prompt
  label:       string;        // display label
  description: string;        // shown to the user
  color:       string;        // Tailwind gradient class
  emoji:       string;
}

export const CHARACTER_OPTIONS: CharacterOption[] = [
  {
    name:        'Alex',
    persona:     'friendly, casual colleague who loves having interesting conversations',
    label:       'Alex',
    description: 'Casual & encouraging — great for daily conversations',
    color:       'from-primary to-secondary',
    emoji:       '😊',
  },
  {
    name:        'Dr. Morgan',
    persona:     'precise and educational language tutor who gently corrects and teaches',
    label:       'Dr. Morgan',
    description: 'Educational tutor — focuses on accuracy and grammar',
    color:       'from-secondary to-purple-500',
    emoji:       '📚',
  },
  {
    name:        'Sam',
    persona:     'professional interview coach who asks challenging follow-up questions',
    label:       'Sam',
    description: 'Interview coach — challenging questions for advanced practice',
    color:       'from-accent to-danger',
    emoji:       '💼',
  },
];

/** Phase of the active training conversation. */
export type TrainingPhase =
  | 'character-speaking'   // TTS playing
  | 'user-turn'            // countdown active, waiting for user
  | 'user-recording'       // microphone open
  | 'processing'           // API call in progress
  | 'showing-evaluation'   // evaluation card visible (brief pause)
  | 'timed-out';           // user ran out of time
