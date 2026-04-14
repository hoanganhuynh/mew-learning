'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import CountdownRing from './CountdownRing';

// ─── Web Speech API types ─────────────────────────────────────────────────────
// We use `any` for the constructor lookup and cast to our own interface to avoid
// conflicts with the lib.dom.d.ts SpeechRecognition global declarations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = new () => any;

interface SpeechRecResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecResultEvent {
  results:     { length: number; [i: number]: SpeechRecResult };
  resultIndex: number;
}
interface SpeechRecInstance {
  lang:            string;
  interimResults:  boolean;
  maxAlternatives: number;
  continuous:      boolean;
  start:    () => void;
  stop:     () => void;
  abort:    () => void;
  onresult: ((e: SpeechRecResultEvent) => void) | null;
  onerror:  ((e: { error: string }) => void) | null;
  onend:    (() => void) | null;
}

function getSpeechRecognitionCtor(): AnyConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
}

interface Props {
  onSubmit:         (transcript: string) => void;   // user finished speaking
  onTimeout:        () => void;                      // 30s elapsed
  suggestedResponse?:string;                         // hint to show
  disabled?:         boolean;
}

export default function UserTurnControl({ onSubmit, onTimeout, suggestedResponse, disabled }: Props) {
  const [isRecording,  setIsRecording]  = useState(false);
  const [interimText,  setInterimText]  = useState('');
  const [finalText,    setFinalText]    = useState('');
  const [showHint,     setShowHint]     = useState(false);
  const [supported,    setSupported]    = useState(true);
  const [countdownKey, setCountdownKey] = useState(0);   // reset trick
  const recRef = useRef<SpeechRecInstance | null>(null);

  useEffect(() => {
    if (!getSpeechRecognitionCtor()) setSupported(false);
    // Reset countdown when a new turn starts
    setCountdownKey((k) => k + 1);
    setFinalText('');
    setInterimText('');
  }, [disabled]);

  const stopRecording = useCallback(() => {
    recRef.current?.stop();
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const SR = getSpeechRecognitionCtor();
    if (!SR) return;

    const rec = new SR() as SpeechRecInstance;
    rec.lang            = 'en-US';
    rec.interimResults  = true;
    rec.maxAlternatives = 1;
    rec.continuous      = false;
    recRef.current      = rec;

    rec.onresult = (e: SpeechRecResultEvent) => {
      let interim = '';
      let final   = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final   += r[0].transcript + ' ';
        else           interim += r[0].transcript;
      }
      setInterimText(interim);
      if (final) setFinalText((prev) => prev + final);
    };

    rec.onerror = () => { setIsRecording(false); };
    rec.onend   = () => {
      setIsRecording(false);
      setInterimText('');
      // Give 300ms for state to flush, then auto-submit
      setTimeout(() => {
        setFinalText((text) => {
          const trimmed = text.trim();
          if (trimmed) onSubmit(trimmed);
          return '';
        });
      }, 300);
    };

    try {
      rec.start();
      setIsRecording(true);
    } catch { /* ignore */ }
  }, [onSubmit]);

  const handleMicClick = () => {
    if (disabled) return;
    if (isRecording) stopRecording();
    else             startRecording();
  };

  const handleTimeout = useCallback(() => {
    if (isRecording) stopRecording();
    onTimeout();
  }, [isRecording, stopRecording, onTimeout]);

  const displayText = finalText + interimText;

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* ── Transcript preview ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-secondary/8 border border-secondary/20 rounded-2xl px-4 py-3 text-center"
          >
            <p className="text-sm font-semibold text-brand-text leading-relaxed">
              {finalText && <span>{finalText}</span>}
              {interimText && <span className="opacity-50 italic">{interimText}</span>}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main controls row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-6">

        {/* Hint button */}
        <button
          onClick={() => setShowHint((v) => !v)}
          className="flex flex-col items-center gap-1 text-brand-muted hover:text-accent transition-colors"
          title="Show a hint"
        >
          <div className={cn(
            'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
            showHint ? 'border-accent bg-accent/10 text-accent' : 'border-brand-border'
          )}>
            <Lightbulb size={16} />
          </div>
          <span className="text-[10px] font-bold">Hint</span>
        </button>

        {/* Countdown ring */}
        <CountdownRing
          key={countdownKey}
          totalSeconds={30}
          onComplete={handleTimeout}
          paused={isRecording || disabled}
        />

        {/* Mic button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleMicClick}
          disabled={disabled || !supported}
          className={cn(
            'relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl border-4',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/30',
            'disabled:opacity-40 disabled:pointer-events-none transition-colors',
            isRecording
              ? 'bg-danger border-red-700'
              : 'bg-brand-surface border-brand-border hover:border-secondary hover:bg-secondary/5'
          )}
          aria-label={isRecording ? 'Stop recording' : 'Start speaking'}
        >
          {isRecording && (
            <>
              <motion.span className="absolute inset-0 rounded-full bg-danger/20"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.4, repeat: Infinity }} />
              <motion.span className="absolute inset-0 rounded-full bg-danger/10"
                animate={{ scale: [1, 2.1, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} />
              <Square size={26} className="text-white relative z-10" fill="white" />
            </>
          )}
          {!isRecording && !supported && <MicOff size={28} className="text-brand-muted" />}
          {!isRecording && supported && <Mic size={28} className="text-secondary" />}
        </motion.button>

        {/* Skip / end turn */}
        <button
          onClick={handleTimeout}
          className="flex flex-col items-center gap-1 text-brand-muted hover:text-danger transition-colors"
          title="Skip this turn"
        >
          <div className="w-10 h-10 rounded-full border-2 border-brand-border flex items-center justify-center hover:border-danger transition-all">
            <span className="text-[11px] font-black">SKIP</span>
          </div>
          <span className="text-[10px] font-bold">Skip</span>
        </button>
      </div>

      {/* Status label */}
      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            <span className="text-sm font-bold text-danger">Recording… speak clearly</span>
          </motion.div>
        ) : (
          <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-sm font-semibold text-brand-muted text-center">
            {supported
              ? 'Tap the mic to respond · 30 seconds'
              : 'Speech recognition unavailable — use Chrome or Edge'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hint box */}
      <AnimatePresence>
        {showHint && suggestedResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md overflow-hidden"
          >
            <div className="bg-accent/8 border border-accent/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Lightbulb size={12} className="text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wide">Suggested response</span>
              </div>
              <p className="text-sm text-brand-text font-medium italic">{suggestedResponse}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
