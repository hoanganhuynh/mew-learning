'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CharacterOption } from '@/types/training';

interface Props {
  character: CharacterOption;
  /** 'idle' | 'speaking' | 'listening' | 'thinking' */
  state: 'idle' | 'speaking' | 'listening' | 'thinking';
  size?: 'sm' | 'md' | 'lg';
}

export default function CharacterAvatar({ character, state, size = 'md' }: Props) {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  };

  const emojiSize = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl' };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
      {/* ── Outer pulse rings (only when speaking) ─────────────────────────── */}
      {state === 'speaking' && (
        <>
          <motion.div
            className={cn('absolute inset-0 rounded-full bg-gradient-to-br opacity-25', character.color)}
            animate={{ scale: [1, 1.55, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={cn('absolute inset-0 rounded-full bg-gradient-to-br opacity-20', character.color)}
            animate={{ scale: [1, 1.9, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      {/* ── Listening ring ──────────────────────────────────────────────────── */}
      {state === 'listening' && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-secondary"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* ── Thinking dots ───────────────────────────────────────────────────── */}
      {state === 'thinking' && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <span className="text-[8px] font-black text-white">···</span>
        </motion.div>
      )}

      {/* ── Avatar orb ──────────────────────────────────────────────────────── */}
      <motion.div
        className={cn(
          'relative w-full h-full rounded-full bg-gradient-to-br flex items-center justify-center shadow-xl select-none',
          character.color,
        )}
        animate={
          state === 'speaking'
            ? { scale: [1, 1.04, 1] }
            : state === 'listening'
            ? { scale: [1, 0.97, 1] }
            : { scale: 1 }
        }
        transition={
          state === 'speaking' || state === 'listening'
            ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        <span className={emojiSize[size]} role="img" aria-label={character.name}>
          {character.emoji}
        </span>
      </motion.div>

      {/* ── Sound wave bars (speaking) ──────────────────────────────────────── */}
      {state === 'speaking' && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4">
          {[0.3, 0.7, 1, 0.6, 0.4, 0.8, 0.5].map((h, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-primary/70"
              animate={{ scaleY: [h, h * 0.3, h] }}
              transition={{ duration: 0.5 + i * 0.06, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
              style={{ height: `${h * 100}%`, transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
