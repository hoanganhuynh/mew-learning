'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, StopCircle, Loader2, Zap, HardDrive } from 'lucide-react';
import ReactNiceAvatar, { genConfig } from 'react-nice-avatar';
import { cn } from '@/lib/utils';
import type { DialogueLine } from '@/types';
import { speak, stop, checkCacheStatus, isMemoryCached } from '@/lib/tts';
import { useAppStore } from '@/store/appStore';
import { localAudioPath, checkLocalAudio } from '@/lib/audioLibrary';

// ─── Bubble palette (background/border only — avatar handles its own color) ──

const BUBBLE_PALETTE = [
  'bg-primary/8 border-primary/20',
  'bg-secondary/8 border-secondary/20',
  'bg-accent/8 border-accent/20',
  'bg-danger/8 border-danger/20',
  'bg-purple-500/8 border-purple-500/20',
];
const getBubbleStyle = (i: number) => BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];

// ─── Listen button states ─────────────────────────────────────────────────────
//
//  idle-uncached  → Volume2     "Listen"       grey    first click → API call
//  idle-cached    → Zap         "Play"         green   first click → instant (IndexedDB)
//  idle-local     → HardDrive   "Play (local)" teal    first click → local file
//  generating     → Loader2     "Loading…"     blue    disabled
//  playing        → StopCircle  "Stop"         red     click stops

type ListenState = 'idle-uncached' | 'idle-cached' | 'idle-local' | 'generating' | 'playing';

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  line:             DialogueLine;
  participantIndex: number;
  isActive:         boolean;
  isDimmed:         boolean;
  lineIndex:        number;
  topicId:          string;      // needed for local file path
  topicTitle:       string;      // needed for vocabulary save
  refreshKey:       number;      // increment to re-check local status
  onPractice:       (lineId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

// ─── Deterministic avatar config from character name ─────────────────────────
// genConfig() is deterministic — same seed always produces the same avatar.
const avatarCache = new Map<string, ReturnType<typeof genConfig>>();
function getAvatarConfig(seed: string) {
  if (!avatarCache.has(seed)) avatarCache.set(seed, genConfig(seed));
  return avatarCache.get(seed)!;
}

export default function DialogueBubble({
  line, participantIndex, isActive, isDimmed, lineIndex, topicId, topicTitle, refreshKey, onPractice,
}: Props) {
  const { settings } = useAppStore();
  const isRight     = participantIndex % 2 === 1;
  const bubbleStyle = getBubbleStyle(participantIndex);
  const avatarCfg   = getAvatarConfig(line.characterId);

  const voiceId = (settings.voiceName ?? {})[line.characterId] ?? 'nova';
  const rate    = settings.speechRate;

  // ── Listen state (sync L1 check first, then async L2 / local) ───────────────
  const [listenState, setListenState] = useState<ListenState>(() =>
    isMemoryCached(line.englishText, voiceId, rate) ? 'idle-cached' : 'idle-uncached'
  );

  // ── Check local file + IndexedDB on mount and when refreshKey changes ────────
  useEffect(() => {
    if (listenState === 'playing' || listenState === 'generating') return;
    let cancelled = false;

    const localPath = localAudioPath(topicId, lineIndex);

    checkLocalAudio(localPath).then((exists) => {
      if (cancelled) return;
      if (exists) {
        setListenState('idle-local');
        return;
      }
      checkCacheStatus(line.englishText, voiceId, rate).then((status) => {
        if (!cancelled) {
          setListenState(status === 'cached' ? 'idle-cached' : 'idle-uncached');
        }
      });
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line.englishText, voiceId, rate, topicId, lineIndex, refreshKey]);

  // ── Handle Listen / Stop click ───────────────────────────────────────────────
  const handleSpeak = useCallback(() => {
    if (listenState === 'playing') {
      stop();
      // Determine the "resting" state — prefer local if it was local
      setListenState((prev) => prev === 'playing' ? 'idle-local' : 'idle-cached');
      return;
    }
    if (listenState === 'generating') return;

    const localPath = localAudioPath(topicId, lineIndex);
    const isLocal   = listenState === 'idle-local';

    if (listenState === 'idle-uncached') setListenState('generating');

    speak(line.englishText, {
      rate,
      voice:     voiceId,
      localFile: isLocal ? localPath : undefined,
      onEnd: () => setListenState(isLocal ? 'idle-local' : 'idle-cached'),
      onError: () => setListenState('idle-uncached'),
    });

    requestAnimationFrame(() => setListenState('playing'));
  }, [listenState, line.englishText, rate, voiceId, topicId, lineIndex]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 30 : -30 }}
      animate={{ opacity: isDimmed ? 0.35 : 1, x: 0, scale: isActive ? 1.0 : 0.995 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: lineIndex * 0.04 }}
      className={cn('flex items-end gap-2.5 w-full', isRight && 'flex-row-reverse')}
    >
      {/* Avatar — deterministic from character name */}
      <div className="flex-shrink-0" title={line.characterId}>
        <ReactNiceAvatar
          style={{ width: 36, height: 36 }}
          className="rounded-full shadow-sm"
          {...avatarCfg}
        />
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[88%] md:max-w-[75%] flex flex-col', isRight && 'items-end')}>
        {/* Character name */}
        <span className={cn('text-[11px] font-bold text-brand-muted mb-1', isRight && 'text-right')}>
          {line.characterId}
        </span>

        <div
          className={cn(
            'relative rounded-2xl border px-3 py-2.5 md:px-4 md:py-3 shadow-bubble transition-all duration-300',
            isRight ? 'rounded-br-sm' : 'rounded-bl-sm',
            isActive ? `${bubbleStyle} shadow-card` : 'bg-brand-surface border-brand-border'
          )}
        >
          {/* Emotion tag */}
          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-brand-muted mb-1 opacity-70">
            {line.emotionTone}
          </span>

          {/* English text */}
          <p
            className="text-[13px] md:text-sm font-semibold text-brand-text leading-relaxed select-text"
            data-line-id={line.id}
            data-topic-id={topicId}
            data-topic-title={topicTitle}
            data-line-english={line.englishText}
          >
            {line.englishText}
          </p>

          {/* Vietnamese translation */}
          {settings.showTranslation && (
            <p className="text-[11px] md:text-xs text-brand-muted mt-1.5 italic leading-relaxed border-t border-brand-border/50 pt-1.5">
              {line.vietnameseText}
            </p>
          )}

          {/* Action buttons */}
          <div className={cn('flex items-center gap-2 mt-2.5', isRight && 'justify-end')}>

            {/* Listen button — 5 visual states */}
            <button
              onClick={handleSpeak}
              disabled={listenState === 'generating'}
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all border touch-manipulation',
                listenState === 'playing'
                  ? 'bg-danger/10 text-danger border-danger/20'
                  : listenState === 'generating'
                  ? 'bg-secondary/10 text-secondary border-secondary/20 opacity-80 cursor-wait'
                  : listenState === 'idle-local'
                  ? 'bg-teal-500/10 text-teal-600 border-teal-500/20 hover:bg-teal-500/20 dark:text-teal-400'
                  : listenState === 'idle-cached'
                  ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                  : 'bg-brand-input text-brand-muted border-transparent hover:bg-primary/10 hover:text-primary'
              )}
              title={
                listenState === 'playing'     ? 'Stop playback'                :
                listenState === 'generating'  ? 'Generating audio…'            :
                listenState === 'idle-local'  ? 'Play from local file (fast)'  :
                listenState === 'idle-cached' ? 'Play (instant — cached)'      :
                                               'Listen (generates audio)'
              }
            >
              <AnimatePresence mode="wait">
                {listenState === 'playing' && (
                  <motion.span key="stop" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <StopCircle size={12} /> Stop
                  </motion.span>
                )}
                {listenState === 'generating' && (
                  <motion.span key="gen" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" /> Generating…
                  </motion.span>
                )}
                {listenState === 'idle-local' && (
                  <motion.span key="local" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <HardDrive size={12} /> Play
                  </motion.span>
                )}
                {listenState === 'idle-cached' && (
                  <motion.span key="cached" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <Zap size={12} /> Play
                  </motion.span>
                )}
                {listenState === 'idle-uncached' && (
                  <motion.span key="listen" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <Volume2 size={12} /> Listen
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Practice pronunciation button */}
            <button
              onClick={() => onPractice(line.id)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-brand-input text-brand-muted hover:bg-secondary/10 hover:text-secondary border border-transparent transition-all"
            >
              <Mic size={12} /> Practice
            </button>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
