'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn, scoreColor, scoreBg } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { PronunciationResult } from '@/types';

interface Props {
  result: PronunciationResult;
}

// Animated circular score ring
function ScoreRing({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#23C552' : score >= 50 ? '#FFC800' : '#FF4B4B';

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" className="-rotate-90">
        {/* Background track */}
        <circle cx={48} cy={48} r={radius} fill="none" stroke="#E5E5E5" strokeWidth={8} />
        {/* Score arc */}
        <motion.circle
          cx={48}
          cy={48}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      {/* Score number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          className={cn('text-2xl font-extrabold', scoreColor(score))}
        >
          {score}
        </motion.span>
        <span className="text-[9px] font-bold text-brand-muted uppercase tracking-wider">score</span>
      </div>
    </div>
  );
}

// Single word chip
function WordChip({ word, correct, score }: { word: string; correct: boolean; score: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      title={`${score}%`}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold border',
        correct
          ? 'bg-success/10 text-success border-success/25'
          : 'bg-danger/10 text-danger border-danger/25'
      )}
    >
      {word}
      {correct ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
    </motion.span>
  );
}

export default function ScoreDisplay({ result }: Props) {
  const { overallScore, words, recognizedText, targetText } = result;

  const correctCount = words.filter((w) => w.correct).length;
  const pct = Math.round((correctCount / (words.length || 1)) * 100);

  const label =
    overallScore >= 90
      ? 'Excellent!'
      : overallScore >= 75
      ? 'Great job!'
      : overallScore >= 55
      ? 'Keep practicing!'
      : 'Try again!';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <div className={cn('flex items-center gap-4 p-4 rounded-2xl border', scoreBg(overallScore))}>
        <ScoreRing score={overallScore} />
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={cn('text-xl font-extrabold', scoreColor(overallScore))}
          >
            {label}
          </motion.p>
          <p className="text-xs text-brand-muted mt-0.5">
            {correctCount} / {words.length} words correct
          </p>
          <Progress
            value={pct}
            className="mt-2 h-2"
            indicatorClassName={
              overallScore >= 80
                ? 'bg-success'
                : overallScore >= 50
                ? 'bg-accent'
                : 'bg-danger'
            }
          />
        </div>
      </div>

      {/* ── Word-by-word breakdown ───────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-2">
          Word analysis
        </p>
        <div className="flex flex-wrap gap-1.5">
          {words.map((w, i) => (
            <WordChip key={i} word={w.word} correct={w.correct} score={w.score} />
          ))}
        </div>
      </div>

      {/* ── What was heard ───────────────────────────────────────────────────── */}
      {recognizedText && (
        <div className="p-3 bg-brand-bg rounded-xl border border-brand-border">
          <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted mb-1">
            You said
          </p>
          <p className="text-sm text-brand-text font-medium italic">"{recognizedText}"</p>
        </div>
      )}
    </motion.div>
  );
}
