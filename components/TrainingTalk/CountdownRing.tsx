'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  totalSeconds: number;
  onComplete:   () => void;
  paused?:      boolean;     // pauses when user starts recording
  className?:   string;
}

export default function CountdownRing({ totalSeconds, onComplete, paused, className }: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (paused || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remaining, onComplete]);

  const radius     = 22;
  const circumference = 2 * Math.PI * radius;
  const progress   = remaining / totalSeconds;
  const dashOffset = circumference * (1 - progress);

  const color =
    remaining > totalSeconds * 0.5 ? '#58CC02'    // green
    : remaining > totalSeconds * 0.25 ? '#FFC800'  // yellow
    : '#FF4B4B';                                    // red

  return (
    <div className={cn('relative flex items-center justify-center w-16 h-16', className)}>
      <svg width={64} height={64} className="-rotate-90">
        {/* Track */}
        <circle cx={32} cy={32} r={radius} fill="none" stroke="currentColor"
          strokeWidth={4} className="text-brand-input" />
        {/* Progress */}
        <motion.circle
          cx={32} cy={32} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </svg>
      {/* Number */}
      <span
        className="absolute font-extrabold text-lg leading-none"
        style={{ color }}
      >
        {remaining}
      </span>
    </div>
  );
}
