/**
 * Global application state — Zustand with `persist` middleware.
 *
 * What is persisted (survives F5 / page reload):
 *   - topics          (user-imported + AI-generated dialogues)
 *   - currentTopicId
 *   - settings        (translation toggle, speed, voice gender, …)
 *
 * What is NOT persisted (reset on each visit):
 *   - activeLineIndex (always start at line 0)
 *   - practice state
 *   - UI panel open/close states
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppSettings,
  DialogueTopic,
  EdgeVoiceId,
  PracticeState,
  SpeechRate,
  VoiceGender,
} from '@/types';
import { mockDialogues } from '@/data/mockData';

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultSettings: AppSettings = {
  showTranslation: true,
  speechRate: 1.0,
  voiceName: {},
  autoPlay: false,
  highlightActiveLines: true,
};

const defaultPractice: PracticeState = {
  mode: 'idle',
  targetLineId: null,
  result: null,
};

// ─── Store interface ──────────────────────────────────────────────────────────

interface AppStore {
  topics: DialogueTopic[];
  currentTopicId: string | null;
  activeLineIndex: number;
  settings: AppSettings;
  practice: PracticeState;
  settingsPanelOpen: boolean;
  dataPanelOpen: boolean;
  sidebarOpen: boolean;
  favoriteTopicIds: string[];

  setCurrentTopic:     (id: string | null) => void;
  addTopics:           (topics: DialogueTopic[]) => void;
  removeTopic:         (id: string) => void;
  setActiveLineIndex:  (index: number) => void;
  advanceLine:         () => void;

  setSetting:          <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  setSpeechRate:       (rate: SpeechRate) => void;
  setVoiceName:        (characterId: string, voiceId: EdgeVoiceId) => void;
  toggleTranslation:   () => void;

  setPractice:         (patch: Partial<PracticeState>) => void;
  resetPractice:       () => void;

  setSettingsPanelOpen:(open: boolean) => void;
  setDataPanelOpen:    (open: boolean) => void;
  setSidebarOpen:      (open: boolean) => void;
  toggleFavorite:      (id: string) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      topics:           mockDialogues,
      currentTopicId:   null,
      activeLineIndex:  0,
      settings:         defaultSettings,
      practice:         defaultPractice,
      settingsPanelOpen:false,
      dataPanelOpen:    false,
      sidebarOpen:      true,
      favoriteTopicIds: [],

      // ── Topics ─────────────────────────────────────────────────────────────
      setCurrentTopic: (id) =>
        set({ currentTopicId: id, activeLineIndex: 0, practice: defaultPractice }),

      addTopics: (newTopics) =>
        set((s) => ({
          topics: [
            ...s.topics,
            ...newTopics.filter((t) => !s.topics.some((e) => e.id === t.id)),
          ],
        })),

      removeTopic: (id) =>
        set((s) => ({
          topics: s.topics.filter((t) => t.id !== id),
          currentTopicId:
            s.currentTopicId === id
              ? (s.topics.find((t) => t.id !== id)?.id ?? null)
              : s.currentTopicId,
        })),

      setActiveLineIndex: (index) => set({ activeLineIndex: index }),

      advanceLine: () => {
        const { currentTopicId, topics, activeLineIndex } = get();
        const topic = topics.find((t) => t.id === currentTopicId);
        if (!topic) return;
        set({ activeLineIndex: Math.min(activeLineIndex + 1, topic.lines.length - 1) });
      },

      // ── Settings ───────────────────────────────────────────────────────────
      setSetting: (key, value) =>
        set((s) => ({ settings: { ...s.settings, [key]: value } })),

      setSpeechRate: (rate) =>
        set((s) => ({ settings: { ...s.settings, speechRate: rate } })),

      setVoiceName: (characterId, voiceId) =>
        set((s) => ({
          settings: {
            ...s.settings,
            voiceName: { ...s.settings.voiceName, [characterId]: voiceId },
          },
        })),

      toggleTranslation: () =>
        set((s) => ({ settings: { ...s.settings, showTranslation: !s.settings.showTranslation } })),

      // ── Practice ───────────────────────────────────────────────────────────
      setPractice:  (patch) => set((s) => ({ practice: { ...s.practice, ...patch } })),
      resetPractice:() => set({ practice: defaultPractice }),

      // ── Panels ─────────────────────────────────────────────────────────────
      setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
      setDataPanelOpen:     (open) => set({ dataPanelOpen: open }),
      setSidebarOpen:       (open) => set({ sidebarOpen: open }),

      // ── Favorites ──────────────────────────────────────────────────────────
      toggleFavorite: (id) =>
        set((s) => ({
          favoriteTopicIds: s.favoriteTopicIds.includes(id)
            ? s.favoriteTopicIds.filter((f) => f !== id)
            : [...s.favoriteTopicIds, id],
        })),
    }),
    {
      // Same key as before — user topics are preserved.
      name: 'english-app-v3',
      version: 4,   // bumping version triggers migrate() below
      partialize: (s) => ({
        topics:           s.topics,
        currentTopicId:   s.currentTopicId,
        settings:         s.settings,
        favoriteTopicIds: s.favoriteTopicIds,
      }),
      // Migrate old shape (voiceGender) → new shape (voiceName).
      // Also backfills favoriteTopicIds which didn't exist before v4.
      migrate: (stored: unknown, fromVersion: number) => {
        const s = (stored ?? {}) as Record<string, unknown>;
        if (fromVersion < 4) {
          const settings = (s.settings ?? {}) as Record<string, unknown>;
          if (!settings.voiceName) {
            settings.voiceName = (settings.voiceGender as Record<string, string>) ?? {};
          }
          delete (settings as Record<string, unknown>).voiceGender;
          s.settings = settings;
          if (!s.favoriteTopicIds) s.favoriteTopicIds = [];
        }
        return s;
      },
    }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const useCurrentTopic = () => {
  const topics = useAppStore((s) => s.topics);
  const id     = useAppStore((s) => s.currentTopicId);
  return topics.find((t) => t.id === id) ?? null;
};

export const useActiveLine = () => {
  const topic = useCurrentTopic();
  const index = useAppStore((s) => s.activeLineIndex);
  return topic?.lines[index] ?? null;
};
