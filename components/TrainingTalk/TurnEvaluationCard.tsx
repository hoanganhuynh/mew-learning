'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, MessageSquareQuote } from 'lucide-react';
import { cn, scoreColor, scoreBg } from '@/lib/utils';
import type { TurnEvaluation } from '@/types/training';

interface Props {
  evaluation: TurnEvaluation;
  userText:   string;
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <div className={cn('flex flex-col items-center px-3 py-2 rounded-xl border', scoreBg(score))}>
      <span className={cn('text-lg font-extrabold', scoreColor(score))}>{score}</span>
      <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function TurnEvaluationCard({ evaluation, userText }: Props) {
  const { grammarScore, vocabularyScore, overallScore, corrections, betterResponse, encouragement } = evaluation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-brand-border bg-brand-surface shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className={cn('px-4 py-3 flex items-center justify-between border-b border-brand-border', scoreBg(overallScore))}>
        <div className="flex items-center gap-2">
          {overallScore >= 70
            ? <CheckCircle2 size={16} className="text-success" />
            : <XCircle     size={16} className="text-danger"  />
          }
          <span className={cn('font-extrabold text-sm', scoreColor(overallScore))}>
            {overallScore >= 90 ? 'Excellent!'
             : overallScore >= 75 ? 'Well done!'
             : overallScore >= 55 ? 'Keep practising!'
             : 'Try again!'}
          </span>
        </div>

        {/* Score pills */}
        <div className="flex gap-2">
          <ScorePill label="Grammar"    score={grammarScore}    />
          <ScorePill label="Vocabulary" score={vocabularyScore} />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Encouragement */}
        <p className="text-xs font-semibold text-brand-muted italic">💬 {encouragement}</p>

        {/* Corrections */}
        {corrections.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted">Corrections</p>
            {corrections.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2 text-xs"
              >
                <XCircle size={11} className="text-danger flex-shrink-0 mt-0.5" />
                <span className="text-danger line-through opacity-70">{c.original}</span>
                <span className="text-brand-muted">→</span>
                <CheckCircle2 size={11} className="text-success flex-shrink-0 mt-0.5" />
                <span className="text-success font-semibold">{c.corrected}</span>
                <span className="text-brand-muted">— {c.explanation}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Better response */}
        <div className="bg-primary/5 rounded-xl border border-primary/15 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquareQuote size={12} className="text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">Model response</span>
          </div>
          <p className="text-xs text-brand-text font-medium italic">{betterResponse}</p>
        </div>
      </div>
    </motion.div>
  );
}
