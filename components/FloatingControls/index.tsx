'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore, useCurrentTopic } from '@/store/appStore';
import { EDGE_VOICES } from '@/types';
import type { SpeechRate, EdgeVoiceId } from '@/types';

const SPEED_OPTIONS: { label: string; value: SpeechRate }[] = [
  { label: '0.5×',  value: 0.5  },
  { label: '0.75×', value: 0.75 },
  { label: '0.8×',  value: 0.8  },
  { label: '0.9×',  value: 0.9  },
  { label: '1×',    value: 1.0  },
  { label: '1.25×', value: 1.25 },
];

// ─── Floating pill button ─────────────────────────────────────────────────────

function FabPill({
  children,
  onClick,
  active,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center',
        'bg-brand-surface border border-brand-border shadow-lg',
        'text-sm font-extrabold text-brand-text transition-all duration-150',
        'hover:border-primary/50 hover:text-primary hover:shadow-xl hover:scale-105',
        active && 'border-primary/40 bg-primary/5 text-primary'
      )}
    >
      {children}
    </button>
  );
}

// ─── Speed FAB ────────────────────────────────────────────────────────────────

function SpeedFab() {
  const { settings, setSpeechRate } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = SPEED_OPTIONS.find((o) => o.value === settings.speechRate)?.label ?? '1×';

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <AnimatePresence>
        {open && (
          <motion.div
            key="speed-panel"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 right-0 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-2 min-w-[110px]"
          >
            <p className="text-[9px] font-extrabold text-brand-muted uppercase tracking-wider px-2 pb-1.5">
              Tốc độ
            </p>
            <div className="flex flex-col gap-0.5">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSpeechRate(opt.value); setOpen(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-xl text-sm font-bold transition-all',
                    settings.speechRate === opt.value
                      ? 'bg-primary text-white'
                      : 'text-brand-text hover:bg-brand-bg hover:text-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FabPill onClick={() => setOpen((v) => !v)} active={open} title="Tốc độ đọc">
        {label}
      </FabPill>
    </div>
  );
}

// ─── Voice FAB ────────────────────────────────────────────────────────────────

function VoiceFab() {
  const { settings, setVoiceName } = useAppStore();
  const topic = useCurrentTopic();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const femaleVoices = EDGE_VOICES.filter((v) => v.gender === 'female');
  const maleVoices   = EDGE_VOICES.filter((v) => v.gender === 'male');
  const characters   = topic?.participants ?? [];

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <AnimatePresence>
        {open && (
          <motion.div
            key="voice-panel"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 right-0 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-3 w-64"
          >
            <p className="text-[9px] font-extrabold text-brand-muted uppercase tracking-wider pb-2">
              Giọng đọc
            </p>

            {characters.length === 0 && (
              <p className="text-xs text-brand-muted italic px-1">Chọn một đoạn hội thoại trước.</p>
            )}

            {characters.map((char) => {
              const currentVoice = (settings.voiceName ?? {})[char] ?? 'nova';
              return (
                <div key={char} className="mb-3 last:mb-0">
                  <p className="text-xs font-bold text-brand-text mb-1.5">{char}</p>

                  {/* Female voices */}
                  <p className="text-[9px] font-semibold text-brand-muted uppercase mb-1">♀ Nữ</p>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {femaleVoices.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVoiceName(char, v.id as EdgeVoiceId)}
                        title={v.description}
                        className={cn(
                          'px-2 py-0.5 rounded-lg text-[11px] font-bold border transition-all',
                          currentVoice === v.id
                            ? 'bg-primary text-white border-primary'
                            : 'bg-brand-input text-brand-muted border-transparent hover:border-primary/40 hover:text-primary'
                        )}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  {/* Male voices */}
                  <p className="text-[9px] font-semibold text-brand-muted uppercase mb-1">♂ Nam</p>
                  <div className="flex flex-wrap gap-1">
                    {maleVoices.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setVoiceName(char, v.id as EdgeVoiceId)}
                        title={v.description}
                        className={cn(
                          'px-2 py-0.5 rounded-lg text-[11px] font-bold border transition-all',
                          currentVoice === v.id
                            ? 'bg-secondary text-white border-secondary'
                            : 'bg-brand-input text-brand-muted border-transparent hover:border-secondary/40 hover:text-secondary'
                        )}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <FabPill onClick={() => setOpen((v) => !v)} active={open} title="Chọn giọng">
        <Volume2 size={16} />
      </FabPill>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FloatingControls() {
  return (
    <div className="fixed bottom-[4.5rem] md:bottom-24 right-3 md:right-4 z-40 flex flex-col gap-2 md:gap-2.5 items-center">
      <VoiceFab />
      <SpeedFab />
    </div>
  );
}
