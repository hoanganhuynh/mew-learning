'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileJson, FileSpreadsheet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseDialogueFile } from '@/lib/fileParser';
import { useAppStore } from '@/store/appStore';
import type { ImportResult } from '@/types';
import { cn } from '@/lib/utils';

type UploadState = 'idle' | 'dragging' | 'parsing' | 'success' | 'error';

export default function FileUpload({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const addTopics = useAppStore((s) => s.addTopics);
  const setCurrentTopic = useAppStore((s) => s.setCurrentTopic);

  const processFile = useCallback(async (file: File) => {
    setState('parsing');
    const res = await parseDialogueFile(file);
    setResult(res);
    if (res.success && res.topics.length > 0) {
      setState('success');
      addTopics(res.topics);
      setCurrentTopic(res.topics[0].id);
    } else {
      setState('error');
    }
  }, [addTopics, setCurrentTopic]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
    setState('idle');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setState('dragging');
  };

  const handleDragLeave = () => setState('idle');

  const reset = () => {
    setState('idle');
    setResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
          state === 'dragging'
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-brand-border hover:border-primary/50 hover:bg-primary/2',
          state === 'parsing' && 'pointer-events-none opacity-70'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {state === 'idle' || state === 'dragging' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileJson size={22} className="text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <FileSpreadsheet size={22} className="text-secondary" />
                </div>
              </div>
              <p className="font-bold text-brand-text mb-1">
                {state === 'dragging' ? 'Drop your file here!' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-sm text-brand-muted">Supports .json and .xlsx files</p>
            </motion.div>
          ) : state === 'parsing' ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
              <p className="font-semibold text-brand-muted">Parsing file…</p>
            </motion.div>
          ) : state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <CheckCircle2 size={36} className="text-success" />
              <p className="font-bold text-success">Import successful!</p>
              <p className="text-sm text-brand-muted">
                Added {result?.topics.length} topic{result?.topics.length !== 1 ? 's' : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <AlertCircle size={36} className="text-danger" />
              <p className="font-bold text-danger">Import failed</p>
              <p className="text-sm text-brand-muted">{result?.error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* JSON format hint */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-brand-muted font-semibold hover:text-primary transition-colors list-none flex items-center gap-1">
          <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
          View expected JSON format
        </summary>
        <pre className="mt-2 p-3 bg-brand-bg rounded-xl text-[10px] text-brand-muted overflow-x-auto font-mono leading-relaxed">
{`[{
  "id": "topic-1",
  "title": "At the Coffee Shop",
  "description": "Scene description",
  "participants": ["Alice", "Bob"],
  "lines": [{
    "id": "l1",
    "characterId": "Alice",
    "englishText": "Good morning!",
    "vietnameseText": "Chào buổi sáng!",
    "emotionTone": "cheerful"
  }]
}]`}
        </pre>
      </details>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-2">
        {(state === 'success' || state === 'error') && (
          <Button variant="outline" size="sm" onClick={reset}>
            <Upload size={14} /> Upload another
          </Button>
        )}
        {state === 'success' ? (
          <Button size="sm" onClick={onClose}>Done</Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        )}
      </div>
    </div>
  );
}
