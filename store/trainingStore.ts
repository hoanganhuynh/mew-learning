/**
 * Zustand store for Training Talk sessions.
 *
 * Persisted to localStorage under "training-sessions-v1" so all history
 * survives page reloads.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrainingSession, TrainingMessage, TurnEvaluation } from '@/types/training';

// ─── Interface ────────────────────────────────────────────────────────────────

interface TrainingStore {
  sessions:          TrainingSession[];
  activeSessionId:   string | null;

  // Session management
  createSession:     (s: Omit<TrainingSession, 'messages' | 'startedAt' | 'turnCount'>) => string;
  endSession:        (id: string) => void;
  deleteSession:     (id: string) => void;
  clearAllSessions:  () => void;

  // Message management
  addMessage:        (sessionId: string, msg: TrainingMessage) => void;
  updateLastUserMsg: (sessionId: string, patch: Partial<TrainingMessage>) => void;

  // Helpers
  getSession:        (id: string) => TrainingSession | undefined;
  getActiveSession:  () => TrainingSession | undefined;

  setActiveSession:  (id: string | null) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      sessions:        [],
      activeSessionId: null,

      // ── Session lifecycle ───────────────────────────────────────────────────

      createSession: (params) => {
        const id: string = `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const session: TrainingSession = {
          ...params,
          id,
          messages:  [],
          startedAt: Date.now(),
          turnCount: 0,
        };
        set((s) => ({ sessions: [session, ...s.sessions], activeSessionId: id }));
        return id;
      },

      endSession: (id) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== id) return sess;
            const userMsgs = sess.messages.filter(
              (m) => m.role === 'user' && m.evaluation && !m.timedOut
            );
            const overallScore =
              userMsgs.length > 0
                ? Math.round(
                    userMsgs.reduce((acc, m) => acc + (m.evaluation?.overallScore ?? 0), 0) /
                      userMsgs.length
                  )
                : undefined;
            return { ...sess, endedAt: Date.now(), overallScore };
          }),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        })),

      deleteSession: (id) =>
        set((s) => ({
          sessions:        s.sessions.filter((sess) => sess.id !== id),
          activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        })),

      clearAllSessions: () => set({ sessions: [], activeSessionId: null }),

      // ── Messages ────────────────────────────────────────────────────────────

      addMessage: (sessionId, msg) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const turnCount =
              msg.role === 'user' && !msg.timedOut
                ? sess.turnCount + 1
                : sess.turnCount;
            return { ...sess, messages: [...sess.messages, msg], turnCount };
          }),
        })),

      updateLastUserMsg: (sessionId, patch) =>
        set((s) => ({
          sessions: s.sessions.map((sess) => {
            if (sess.id !== sessionId) return sess;
            const msgs = [...sess.messages];
            // Find the last user message and patch it
            for (let i = msgs.length - 1; i >= 0; i--) {
              if (msgs[i].role === 'user') {
                msgs[i] = { ...msgs[i], ...patch };
                break;
              }
            }
            return { ...sess, messages: msgs };
          }),
        })),

      // ── Selectors ───────────────────────────────────────────────────────────

      getSession:       (id) => get().sessions.find((s) => s.id === id),
      getActiveSession: ()   => {
        const id = get().activeSessionId;
        return id ? get().sessions.find((s) => s.id === id) : undefined;
      },

      setActiveSession: (id) => set({ activeSessionId: id }),
    }),
    {
      name:        'training-sessions-v1',
      partialize:  (s) => ({ sessions: s.sessions }), // only persist sessions
    }
  )
);
