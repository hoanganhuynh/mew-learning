'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TopicSelector from './TopicSelector';
import TrainingSession from './TrainingSession';
import HistoryPanel from './HistoryPanel';
import { useTrainingStore } from '@/store/trainingStore';
import type { CharacterOption } from '@/types/training';

// ─── View types ───────────────────────────────────────────────────────────────

type View = 'selector' | 'session' | 'history';

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrainingTalk() {
  const { createSession, endSession } = useTrainingStore();

  const [view,       setView]       = useState<View>('selector');
  const [sessionId,  setSessionId]  = useState<string | null>(null);
  const [sessionMeta, setSessionMeta] = useState<{
    topic:     string;
    character: CharacterOption;
  } | null>(null);

  // ── Start a new session ───────────────────────────────────────────────────────
  const handleStart = useCallback((topic: string, character: CharacterOption) => {
    const id = createSession({
      id:               '',   // filled by store
      topic,
      characterName:    character.name,
      characterPersona: character.persona,
    });
    setSessionId(id);
    setSessionMeta({ topic, character });
    setView('session');
  }, [createSession]);

  // ── End the session → go to history ──────────────────────────────────────────
  const handleEnd = useCallback(() => {
    setView('history');
    setSessionId(null);
    setSessionMeta(null);
  }, []);

  // ── New session → back to selector ───────────────────────────────────────────
  const handleNew = useCallback(() => {
    setView('selector');
    setSessionId(null);
    setSessionMeta(null);
  }, []);

  // ── Tab bar (shown outside of active session) ─────────────────────────────────
  const showTabs = view !== 'session';

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Tab navigation ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTabs && (
          <motion.div
            key="tabs"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-1 px-4 py-2 border-b border-brand-border bg-brand-surface flex-shrink-0"
          >
            <TabButton
              active={view === 'selector'}
              onClick={handleNew}
              icon={<Plus size={13} />}
              label="New Session"
            />
            <TabButton
              active={view === 'history'}
              onClick={() => setView('history')}
              icon={<History size={13} />}
              label="History"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── View content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        <AnimatePresence mode="wait">

          {/* Topic selector */}
          {view === 'selector' && (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="p-6"
            >
              <TopicSelector onStart={handleStart} />
            </motion.div>
          )}

          {/* Active session */}
          {view === 'session' && sessionId && sessionMeta && (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col absolute inset-0"
            >
              <TrainingSession
                sessionId={sessionId}
                topic={sessionMeta.topic}
                character={sessionMeta.character}
                onEnd={handleEnd}
              />
            </motion.div>
          )}

          {/* History panel */}
          {view === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="p-4 h-full flex flex-col"
            >
              <HistoryPanel />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Tab button sub-component ─────────────────────────────────────────────────

function TabButton({
  active, onClick, icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
        active
          ? 'bg-primary text-white shadow-sm'
          : 'text-brand-muted hover:text-brand-text hover:bg-brand-input'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
