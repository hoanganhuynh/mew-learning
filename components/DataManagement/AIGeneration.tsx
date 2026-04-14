'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateDialogueFromPrompt } from '@/lib/fileParser';
import { useAppStore } from '@/store/appStore';

const EXAMPLE_PROMPTS = [
  'Shopping at a supermarket',
  'Asking for directions',
  'Making a doctor appointment',
  'Discussing weekend plans with a friend',
  'Negotiating a salary raise',
];

type GenState = 'idle' | 'generating' | 'success' | 'error';

export default function AIGeneration({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [state, setState]   = useState<GenState>('idle');
  const [errorMsg, setError]= useState('');
  const { addTopics, setCurrentTopic } = useAppStore();

  const generate = async () => {
    if (!prompt.trim()) return;
    setState('generating'); setError('');
    try {
      const topic = await generateDialogueFromPrompt(prompt.trim());
      addTopics([topic]);
      setCurrentTopic(topic.id);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setState('error');
    }
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

      {/* Input */}
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

      {/* Examples */}
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

      {/* Status */}
      <AnimatePresence>
        {state === 'generating' && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="flex items-center gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/20">
            <Loader2 size={18} className="text-secondary animate-spin flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm text-brand-text">Generating dialogue…</p>
              <p className="text-xs text-brand-muted">Crafting conversation about "{prompt}"</p>
            </div>
          </motion.div>
        )}
        {state === 'success' && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="flex items-center gap-3 p-4 bg-success/5 rounded-xl border border-success/20">
            <CheckCircle2 size={18} className="text-success flex-shrink-0" />
            <p className="font-semibold text-sm text-success">Dialogue created!</p>
          </motion.div>
        )}
        {state === 'error' && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="flex items-center gap-3 p-4 bg-danger/5 rounded-xl border border-danger/20">
            <AlertCircle size={18} className="text-danger flex-shrink-0" />
            <p className="text-sm font-semibold text-danger">{errorMsg || 'Something went wrong.'}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {state === 'success' ? (
          <Button onClick={onClose}>Start Practicing</Button>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button onClick={generate} disabled={!prompt.trim() || state === 'generating'} className="gap-2">
              {state === 'generating' ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <><Sparkles size={15} /> Generate</>}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
