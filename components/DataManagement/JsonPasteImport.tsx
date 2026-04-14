'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
import type { DialogueTopic, ImportResult } from '@/types';

type PasteState = 'idle' | 'success' | 'error';

function parseJSONText(text: string): ImportResult {
  try {
    const data = JSON.parse(text);
    const raw: unknown[] = Array.isArray(data) ? data : [data];

    const topics = raw.filter((item): item is DialogueTopic => {
      const t = item as Record<string, unknown>;
      return (
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        Array.isArray(t.lines)
      );
    });

    if (topics.length === 0) {
      return { success: false, topics: [], error: 'No valid DialogueTopic objects found. Make sure the JSON has id, title, and lines fields.' };
    }
    return { success: true, topics };
  } catch {
    return { success: false, topics: [], error: 'Invalid JSON — could not parse. Check for syntax errors.' };
  }
}

export default function JsonPasteImport({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [state, setState] = useState<PasteState>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const addTopics = useAppStore((s) => s.addTopics);
  const setCurrentTopic = useAppStore((s) => s.setCurrentTopic);

  const handleImport = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const res = parseJSONText(trimmed);
    setResult(res);

    if (res.success && res.topics.length > 0) {
      addTopics(res.topics);
      setCurrentTopic(res.topics[0].id);
      setState('success');
    } else {
      setState('error');
    }
  };

  const reset = () => {
    setText('');
    setState('idle');
    setResult(null);
  };

  const isEmpty = text.trim().length === 0;

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {state === 'idle' || state === 'error' ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3"
          >
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (state === 'error') setState('idle');
                }}
                placeholder={`Paste your JSON here…\n\n[{\n  "id": "topic-1",\n  "title": "At the Coffee Shop",\n  "participants": ["Alice", "Bob"],\n  "lines": [{ "id": "l1", "characterId": "Alice", "englishText": "Hello!" }]\n}]`}
                className={cn(
                  'w-full h-52 resize-none rounded-xl border bg-brand-bg px-3.5 py-3 font-mono text-[12px] text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 transition-all',
                  state === 'error'
                    ? 'border-danger/60 focus:ring-danger/30'
                    : 'border-brand-border focus:ring-primary/30 focus:border-primary/50'
                )}
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
              />
              {/* Paste icon hint when empty */}
              {isEmpty && (
                <ClipboardPaste
                  size={18}
                  className="absolute right-3 top-3 text-brand-muted/30 pointer-events-none"
                />
              )}
            </div>

            {/* Error message */}
            {state === 'error' && result?.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start gap-2 p-3 bg-danger/10 rounded-xl"
              >
                <AlertCircle size={15} className="text-danger flex-shrink-0 mt-0.5" />
                <p className="text-xs text-danger font-medium">{result.error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-success" />
            </div>
            <div>
              <p className="font-bold text-success text-base">Import successful!</p>
              <p className="text-sm text-brand-muted mt-1">
                Added {result?.topics.length} topic{result?.topics.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1">
        {state === 'success' ? (
          <>
            <Button variant="outline" size="sm" onClick={reset}>
              Import more
            </Button>
            <Button size="sm" onClick={onClose}>Done</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleImport}
              disabled={isEmpty}
              className="gap-1.5"
            >
              <ClipboardPaste size={14} /> Import JSON
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
