'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Zap, Loader2, Clock, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, scoreColor, scoreBg } from '@/lib/utils';
import type { TrainingMessage, CharacterOption } from '@/types/training';
import { speak, checkCacheStatus, isMemoryCached, openAIVoice } from '@/lib/tts';
import { useAppStore } from '@/store/appStore';
import TurnEvaluationCard from './TurnEvaluationCard';

interface Props {
  message:   TrainingMessage;
  character: CharacterOption;
  index:     number;
}

type PlayState = 'idle-uncached' | 'idle-cached' | 'generating' | 'playing';

export default function TrainingBubble({ message, character, index }: Props) {
  const { settings } = useAppStore();
  const gender  = 'female'; // character always female voice (nova)
  const rate    = settings.speechRate;
  const isChar  = message.role === 'character';

  const [expanded,  setExpanded]  = useState(false);
  const [playState, setPlayState] = useState<PlayState>(() =>
    isChar && isMemoryCached(message.text, gender, rate) ? 'idle-cached' : 'idle-uncached'
  );

  const handlePlay = () => {
    if (!isChar) return;
    if (playState === 'playing') { return; }
    if (playState === 'idle-uncached') setPlayState('generating');
    speak(message.text, {
      rate, gender,
      onEnd:   () => setPlayState('idle-cached'),
      onError: () => setPlayState('idle-uncached'),
    });
    requestAnimationFrame(() => setPlayState('playing'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: isChar ? -16 : 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={cn('flex gap-3 w-full', !isChar && 'flex-row-reverse')}
    >
      {/* Avatar orb (small) */}
      {isChar ? (
        <div className={cn(
          'w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-base flex-shrink-0 shadow-sm mt-1',
          character.color
        )}>
          {character.emoji}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <span className="text-white text-sm font-bold">U</span>
        </div>
      )}

      {/* Bubble content */}
      <div className={cn('max-w-[78%] flex flex-col gap-1.5', !isChar && 'items-end')}>
        {/* Name */}
        <span className="text-[11px] font-bold text-brand-muted">
          {isChar ? character.name : 'You'}
          {message.timedOut && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent-dark font-bold">
              timed out
            </span>
          )}
        </span>

        {/* Main bubble */}
        <div className={cn(
          'rounded-2xl border px-4 py-3 shadow-bubble',
          isChar
            ? 'bg-brand-surface border-brand-border rounded-tl-sm'
            : message.timedOut
            ? 'bg-accent/8 border-accent/20 rounded-tr-sm'
            : message.evaluation
            ? cn(scoreBg(message.evaluation.overallScore), 'rounded-tr-sm')
            : 'bg-secondary/10 border-secondary/20 rounded-tr-sm'
        )}>
          <p className="text-sm font-semibold text-brand-text leading-relaxed">{message.text}</p>

          {/* Score badge (user bubbles) */}
          {!isChar && message.evaluation && (
            <div className="mt-2 flex items-center gap-2">
              <span className={cn('text-xs font-extrabold', scoreColor(message.evaluation.overallScore))}>
                {message.evaluation.overallScore}%
              </span>
              <div className="flex-1 h-1.5 bg-brand-input rounded-full overflow-hidden">
                <motion.div
                  className={cn('h-full rounded-full', message.evaluation.overallScore >= 80 ? 'bg-success' : message.evaluation.overallScore >= 50 ? 'bg-accent' : 'bg-danger')}
                  initial={{ width: 0 }}
                  animate={{ width: `${message.evaluation.overallScore}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-[10px] font-bold text-brand-muted hover:text-primary transition-colors"
              >
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {expanded ? 'Hide' : 'Details'}
              </button>
            </div>
          )}

          {/* Timed-out suggestion */}
          {message.timedOut && message.suggestedResponse && (
            <div className="mt-2 pt-2 border-t border-brand-border/50">
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb size={10} className="text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wide">Suggestion</span>
              </div>
              <p className="text-xs text-brand-muted italic">{message.suggestedResponse}</p>
            </div>
          )}

          {/* Character replay button */}
          {isChar && (
            <div className="mt-2 pt-2 border-t border-brand-border/50">
              <button
                onClick={handlePlay}
                disabled={playState === 'playing'}
                className={cn(
                  'flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all',
                  playState === 'playing'     ? 'bg-danger/10 text-danger border-danger/20 opacity-60' :
                  playState === 'generating'  ? 'bg-secondary/10 text-secondary border-secondary/20 cursor-wait opacity-70' :
                  playState === 'idle-cached' ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' :
                                                'bg-brand-input text-brand-muted border-transparent hover:bg-primary/10 hover:text-primary'
                )}
              >
                {playState === 'playing'     ? <><Volume2 size={11} className="animate-pulse" /> Playing…</> :
                 playState === 'generating'  ? <><Loader2 size={11} className="animate-spin" /> Loading…</> :
                 playState === 'idle-cached' ? <><Zap size={11} /> Replay</> :
                                               <><Volume2 size={11} /> Listen</>}
              </button>
            </div>
          )}
        </div>

        {/* Evaluation detail (expandable) */}
        <AnimatePresence>
          {expanded && message.evaluation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <TurnEvaluationCard evaluation={message.evaluation} userText={message.text} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
