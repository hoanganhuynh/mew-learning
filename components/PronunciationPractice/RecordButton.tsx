'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onResult: (transcript: string) => void;
  onError:  (msg: string) => void;
  disabled?: boolean;
}

type SpeechRecognitionInstance = {
  lang: string; interimResults: boolean; maxAlternatives: number;
  start: () => void; stop: () => void; abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror:  ((e: { error: string }) => void) | null;
  onend:    (() => void) | null;
};
type SpeechRecognitionEvent = {
  results: { [i: number]: { [i: number]: { transcript: string } }; length: number };
  resultIndex: number;
};
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export default function RecordButton({ onResult, onError, disabled }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [supported, setSupported]     = useState(true);
  const [seconds, setSeconds]         = useState(0);
  const recRef   = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!(window.SpeechRecognition ?? window.webkitSpeechRecognition)) setSupported(false);
  }, []);

  const stopRecording = useCallback(() => {
    recRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setSeconds(0);
  }, []);

  const startRecording = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { onError('Speech recognition is not supported. Please use Chrome or Edge.'); return; }

    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    recRef.current = rec;

    rec.onresult = (e) => onResult(e.results[0][0].transcript);
    rec.onerror  = (e) => { onError(`Error: ${e.error}`); stopRecording(); };
    rec.onend    = () => { setIsRecording(false); if (timerRef.current) clearInterval(timerRef.current); setSeconds(0); };

    try {
      rec.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch { onError('Could not start recording. Check microphone permissions.'); }
  }, [onResult, onError, stopRecording]);

  useEffect(() => () => stopRecording(), [stopRecording]);

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-brand-input flex items-center justify-center">
          <MicOff size={24} className="text-brand-muted" />
        </div>
        <p className="text-xs text-brand-muted text-center max-w-xs">
          Speech recognition is not supported. Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center',
          'shadow-xl border-4 transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/30',
          'disabled:opacity-40 disabled:pointer-events-none',
          isRecording
            ? 'bg-danger border-red-700 animate-pulse-record'
            : 'bg-brand-surface border-brand-border hover:border-secondary hover:bg-secondary/5'
        )}
      >
        {isRecording ? (
          <>
            <motion.span className="absolute inset-0 rounded-full bg-danger/20"
              animate={{ scale: [1,1.6,1], opacity: [0.6,0,0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }} />
            <motion.span className="absolute inset-0 rounded-full bg-danger/10"
              animate={{ scale: [1,2,1], opacity: [0.4,0,0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} />
            <Square size={24} className="text-white relative z-10" fill="white" />
          </>
        ) : (
          <Mic size={28} className="text-secondary" />
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {isRecording ? (
          <motion.div key="rec" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            className="flex items-center gap-2">
            <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
            <span className="text-sm font-bold text-danger">Recording… {seconds}s</span>
          </motion.div>
        ) : (
          <motion.p key="idle" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
            className="text-sm font-semibold text-brand-muted">
            Tap to record your voice
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
