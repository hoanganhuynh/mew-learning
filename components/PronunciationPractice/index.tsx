'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, RotateCcw, ChevronRight, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speak, checkCacheStatus, isMemoryCached } from '@/lib/tts';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import RecordButton from './RecordButton';
import ScoreDisplay from './ScoreDisplay';
import type { DialogueLine, PronunciationResult } from '@/types';

interface Props {
  line: DialogueLine;
  onClose: () => void;
}

type Mode = 'idle' | 'recording' | 'processing' | 'result';

export default function PronunciationPractice({ line, onClose }: Props) {
  const { settings } = useAppStore();
  const [mode, setMode]       = useState<Mode>('idle');
  const [result, setResult]   = useState<PronunciationResult | null>(null);
  const [errorMsg, setError]  = useState('');

  const voiceId = (settings.voiceName ?? {})[line.characterId] ?? 'nova';
  const rate    = settings.speechRate;

  // Track whether the example audio is cached so we can show ⚡ or spinner
  const [listenCached, setListenCached] = useState<boolean>(() =>
    isMemoryCached(line.englishText, voiceId, rate)
  );
  const [listenLoading, setListenLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    checkCacheStatus(line.englishText, voiceId, rate).then((s) => {
      if (!cancelled) setListenCached(s === 'cached');
    });
    return () => { cancelled = true; };
  }, [line.englishText, voiceId, rate]);

  const handleListen = () => {
    if (listenLoading) return;
    if (!listenCached) setListenLoading(true);
    speak(line.englishText, {
      rate,
      voice:  voiceId,
      onEnd:  () => { setListenLoading(false); setListenCached(true); },
      onError:() => { setListenLoading(false); },
    });
    requestAnimationFrame(() => setListenLoading(false));
  };

  const handleTranscript = useCallback(async (transcript: string) => {
    setMode('processing');
    setError('');
    try {
      const res = await fetch('/api/pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetText: line.englishText, recognizedText: transcript }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      setResult(await res.json());
      setMode('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assessment failed');
      setMode('idle');
    }
  }, [line.englishText]);

  const retry = () => { setResult(null); setError(''); setMode('idle'); };

  return (
    <div className="max-h-[55vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border sticky top-0 bg-brand-surface z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Volume2 size={14} className="text-secondary" />
          </div>
          <div>
            <p className="font-extrabold text-sm text-brand-strong">Pronunciation Practice</p>
            <p className="text-[10px] text-brand-muted">{line.characterId} · {line.emotionTone}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-input text-brand-muted hover:text-brand-text transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Target sentence */}
        <div className="bg-gradient-to-r from-secondary/8 to-primary/8 rounded-2xl border border-secondary/15 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">Say this out loud:</p>
          <p className="text-base font-bold text-brand-strong leading-relaxed">{line.englishText}</p>
          {settings.showTranslation && (
            <p className="text-xs text-brand-muted italic mt-2 pt-2 border-t border-brand-border/50">
              {line.vietnameseText}
            </p>
          )}
          <button
            onClick={handleListen}
            disabled={listenLoading}
            className={cn(
              'mt-3 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors',
              listenLoading
                ? 'bg-secondary/10 text-secondary border-secondary/20 cursor-wait opacity-80'
                : listenCached
                ? 'bg-success/10 text-success border-success/20 hover:bg-success/20'
                : 'bg-brand-surface border-brand-border hover:border-secondary hover:text-secondary'
            )}
          >
            {listenLoading
              ? <><Loader2 size={12} className="animate-spin" /> Generating…</>
              : listenCached
              ? <><Zap size={12} /> Play example</>
              : <><Volume2 size={12} /> Listen to example</>
            }
          </button>
        </div>

        {/* Dynamic area */}
        <AnimatePresence mode="wait">
          {mode === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4">
              <RecordButton onResult={handleTranscript} onError={(m) => { setError(m); setMode('idle'); }} />
              {errorMsg && (
                <p className="text-xs font-semibold text-danger bg-danger/5 rounded-lg px-3 py-2 border border-danger/20">
                  {errorMsg}
                </p>
              )}
            </motion.div>
          )}

          {mode === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8">
              <Loader2 size={32} className="text-secondary animate-spin" />
              <p className="font-semibold text-brand-muted text-sm">Analysing your pronunciation…</p>
            </motion.div>
          )}

          {mode === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ScoreDisplay result={result} />
              <div className="flex gap-2 mt-4 pt-3 border-t border-brand-border">
                <Button variant="outline" size="sm" onClick={retry} className="gap-1.5">
                  <RotateCcw size={13} /> Try Again
                </Button>
                <Button size="sm" onClick={onClose} className="gap-1.5 ml-auto">
                  Continue <ChevronRight size={13} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
