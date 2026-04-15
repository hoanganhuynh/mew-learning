'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, Import } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateDialogueFromPrompt } from '@/lib/fileParser';
import { useAppStore } from '@/store/appStore';
import type { DialogueTopic } from '@/types';

const EXAMPLE_PROMPTS = [
  'Shopping at a supermarket',
  'Asking for directions',
  'Making a doctor appointment',
  'Discussing weekend plans with a friend',
  'Negotiating a salary raise',
];

type GenState = 'idle' | 'generating' | 'preview' | 'success' | 'error';

export default function AIGeneration({ onClose }: { onClose: () => void }) {
  const [prompt,   setPrompt]  = useState('');
  const [state,    setState]   = useState<GenState>('idle');
  const [errorMsg, setError]   = useState('');
  const [preview,  setPreview] = useState<DialogueTopic | null>(null);
  const { addTopics, setCurrentTopic } = useAppStore();

  const generate = async () => {
    if (!prompt.trim()) return;
    setState('generating'); setError(''); setPreview(null);
    try {
      const topic = await generateDialogueFromPrompt(prompt.trim());
      setPreview(topic);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setState('error');
    }
  };

  const handleImport = () => {
    if (!preview) return;
    addTopics([preview]);
    setCurrentTopic(preview.id);
    toast.success('Dialogue imported!');
    setState('success');
    onClose();
  };

  const handleRegenerate = () => {
    setPreview(null);
    setState('idle');
    generate();
  };

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-brand-strong text-sm">AI Dialogue Generator</p>
          <p className="text-xs text-brand-muted mt-0.5">
            Describe a scenario and we will create a realistic English conversation for you.
          </p>
        </div>
      </div>

      {/* Input — hidden during preview */}
      {state !== 'preview' && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-text">Your topic or scenario</label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="e.g. Ordering food at a restaurant..."
            disabled={state === 'generating'}
          />
        </div>
      )}

      {/* Examples — only in idle/error */}
      {(state === 'idle' || state === 'error') && (
        <div>
          <p className="text-xs font-bold text-brand-muted mb-2 uppercase tracking-wide">Try an example</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button key={ex} onClick={() => setPrompt(ex)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-border bg-brand-surface hover:border-primary hover:text-primary transition-colors">
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status / Preview */}
      <AnimatePresence mode="wait">
        {state === 'generating' && (
          <motion.div key="generating"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/20">
            <Loader2 size={18} className="text-secondary animate-spin flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-brand-text">Generating dialogue…</p>
              <p className="text-xs text-brand-muted">Crafting conversation about &ldquo;{prompt}&rdquo;</p>
            </div>
          </motion.div>
        )}

        {state === 'preview' && preview && (
          <motion.div key="preview"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Preview header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-strong text-sm">{preview.title}</p>
                <p className="text-xs text-brand-muted mt-0.5">{preview.lines.length} lines · {preview.participants.join(', ')}</p>
              </div>
              {preview.difficulty && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-dark capitalize">
                  {preview.difficulty}
                </span>
              )}
            </div>

            {/* Lines preview */}
            <div className="max-h-44 overflow-y-auto space-y-1.5 rounded-xl border border-brand-border p-2 bg-brand-bg">
              {preview.lines.slice(0, 8).map((line, i) => (
                <div key={line.id} className="flex gap-2 text-xs">
                  <span className="font-bold text-brand-muted flex-shrink-0 w-16 truncate">{line.characterId}:</span>
                  <span className="text-brand-text leading-relaxed">{line.englishText}</span>
                </div>
              ))}
              {preview.lines.length > 8 && (
                <p className="text-[10px] text-brand-muted text-center pt-1">
                  +{preview.lines.length - 8} more lines…
                </p>
              )}
            </div>
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div key="error"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-danger/5 rounded-xl border border-danger/20">
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <p className="text-sm font-semibold text-danger">{errorMsg || 'Something went wrong.'}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {state === 'preview' ? (
          <>
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="gap-1.5">
              <RefreshCw size={14} /> Regenerate
            </Button>
            <Button onClick={handleImport} className="gap-1.5">
              <Import size={14} /> Import
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button onClick={generate} disabled={!prompt.trim() || state === 'generating'} className="gap-2">
              {state === 'generating'
                ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
                : <><Sparkles size={15} /> Generate</>
              }
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
