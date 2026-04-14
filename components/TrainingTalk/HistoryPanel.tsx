'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronDown, ChevronUp, Clock, MessageSquare, Star, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, scoreColor, scoreBg } from '@/lib/utils';
import { useTrainingStore } from '@/store/trainingStore';
import { CHARACTER_OPTIONS } from '@/types/training';
import TrainingBubble from './TrainingBubble';
import type { TrainingSession } from '@/types/training';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(start: number, end?: number) {
  const ms  = (end ?? Date.now()) - start;
  const min = Math.floor(ms / 60_000);
  const sec = Math.floor((ms % 60_000) / 1000);
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

// ─── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: TrainingSession }) {
  const [expanded, setExpanded] = useState(false);
  const { deleteSession }       = useTrainingStore();

  const character = CHARACTER_OPTIONS.find((c) => c.name === session.characterName) ?? CHARACTER_OPTIONS[0];

  const score       = session.overallScore;
  const isCompleted = !!session.endedAt;
  const userTurns   = session.messages.filter((m) => m.role === 'user' && !m.timedOut);
  const timedOut    = session.messages.filter((m) => m.timedOut).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-2xl border border-brand-border bg-brand-surface shadow-card overflow-hidden"
    >
      {/* ── Card header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 p-4">
        {/* Character avatar (mini) */}
        <div className={cn(
          'w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center text-xl flex-shrink-0 shadow-sm',
          character.color
        )}>
          {character.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm text-brand-strong truncate">{session.topic}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
            <span className="text-[11px] text-brand-muted font-semibold">{character.label}</span>
            <span className="flex items-center gap-1 text-[11px] text-brand-muted">
              <Calendar size={10} />
              {formatDate(session.startedAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-brand-muted">
              <Clock size={10} />
              {formatDuration(session.startedAt, session.endedAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-brand-muted">
              <MessageSquare size={10} />
              {session.turnCount} turn{session.turnCount !== 1 ? 's' : ''}
            </span>
            {timedOut > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-accent font-bold">
                <AlertCircle size={10} />
                {timedOut} timeout{timedOut !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Score badge */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {score !== undefined ? (
            <div className={cn('flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-extrabold', scoreBg(score))}>
              <Star size={11} className={scoreColor(score)} fill="currentColor" />
              <span className={scoreColor(score)}>{score}%</span>
            </div>
          ) : (
            <span className="text-[11px] text-brand-muted bg-brand-input px-2 py-0.5 rounded-full font-bold">
              {isCompleted ? 'No score' : 'In progress'}
            </span>
          )}
        </div>
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────────── */}
      {userTurns.length > 0 && (
        <div className="grid grid-cols-3 border-t border-brand-border divide-x divide-brand-border">
          {[
            {
              label: 'Grammar',
              value: Math.round(
                userTurns.reduce((a, m) => a + (m.evaluation?.grammarScore ?? 0), 0) / userTurns.length
              ),
            },
            {
              label: 'Vocabulary',
              value: Math.round(
                userTurns.reduce((a, m) => a + (m.evaluation?.vocabularyScore ?? 0), 0) / userTurns.length
              ),
            },
            {
              label: 'Overall',
              value: Math.round(
                userTurns.reduce((a, m) => a + (m.evaluation?.overallScore ?? 0), 0) / userTurns.length
              ),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-2">
              <span className={cn('text-sm font-extrabold', scoreColor(value))}>{value}</span>
              <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Expand/collapse + actions ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-brand-border bg-brand-bg/30">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-brand-muted hover:text-primary transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Hide transcript' : `View transcript (${session.messages.length} messages)`}
        </button>

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-danger hover:bg-danger/5"
          onClick={() => deleteSession(session.id)}
        >
          <Trash2 size={13} />
        </Button>
      </div>

      {/* ── Transcript ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-border"
          >
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {session.messages.map((msg, i) => (
                <TrainingBubble
                  key={msg.id}
                  message={msg}
                  character={character}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main History Panel ───────────────────────────────────────────────────────

export default function HistoryPanel() {
  const { sessions, clearAllSessions } = useTrainingStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const sorted = [...sessions].sort((a, b) => b.startedAt - a.startedAt);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16">
        <div className="w-16 h-16 rounded-3xl bg-brand-input flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-brand-muted" />
        </div>
        <h2 className="font-extrabold text-lg text-brand-strong mb-1">No sessions yet</h2>
        <p className="text-brand-muted text-sm max-w-xs">
          Complete a Training Talk session and it will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full h-full flex flex-col">

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between py-4 px-1 flex-shrink-0">
        <div>
          <h2 className="font-extrabold text-lg text-brand-strong">Session History</h2>
          <p className="text-xs text-brand-muted mt-0.5">
            {sorted.length} session{sorted.length !== 1 ? 's' : ''} recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!confirmClear ? (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs text-danger border-danger/30 hover:bg-danger/5"
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 size={12} />
              Clear all
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-brand-muted font-semibold">Are you sure?</span>
              <Button size="sm" variant="danger" className="text-xs h-7 px-2"
                onClick={() => { clearAllSessions(); setConfirmClear(false); }}>
                Yes, delete
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2"
                onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Session list ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 px-1">
        <AnimatePresence initial={false}>
          {sorted.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
