'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookmarkPlus, X, Loader2 } from 'lucide-react';
import { useVocabularyStore } from '@/store/vocabularyStore';
import type { TranslateResult } from '@/types/vocabulary';

interface SelectionData {
  text:        string;
  lineId:      string;
  topicId:     string;
  topicTitle:  string;
  lineContext: string;
  rect:        DOMRect;
}

const EMPTY_RESULT: TranslateResult = { vietnamese: '', phonetic: '', partOfSpeech: '', englishDef: '' };

export default function VocabularyTooltip() {
  const [selection,   setSelection]   = useState<SelectionData | null>(null);
  const [result,      setResult]      = useState<TranslateResult>(EMPTY_RESULT);
  const [translating, setTranslating] = useState(false);
  const [mounted,     setMounted]     = useState(false);

  // Allow user to override the auto-translated Vietnamese
  const [overrideVi,  setOverrideVi]  = useState<string | null>(null);

  const tooltipRef = useRef<HTMLDivElement>(null);
  const { addWord } = useVocabularyStore();

  useEffect(() => { setMounted(true); }, []);

  const autoTranslate = useCallback(async (text: string) => {
    setTranslating(true);
    setResult(EMPTY_RESULT);
    setOverrideVi(null);
    try {
      const res = await fetch('/api/translate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ text }),
      });
      if (res.ok) setResult(await res.json() as TranslateResult);
    } catch { /* keep empty */ }
    finally { setTranslating(false); }
  }, []);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;

      const sel  = window.getSelection();
      const text = sel?.toString().trim();
      if (!text) { setSelection(null); return; }

      const anchorNode = sel?.anchorNode;
      const element =
        anchorNode?.nodeType === Node.TEXT_NODE
          ? anchorNode.parentElement
          : (anchorNode as Element | null);

      const lineEl = element?.closest('[data-line-id]') as HTMLElement | null;
      if (!lineEl) { setSelection(null); return; }

      const lineId      = lineEl.dataset.lineId     ?? '';
      const topicId     = lineEl.dataset.topicId    ?? '';
      const topicTitle  = lineEl.dataset.topicTitle ?? '';
      const lineContext = lineEl.dataset.lineEnglish ?? '';

      const range = sel?.getRangeAt(0);
      const rect  = range?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      setSelection({ text, lineId, topicId, topicTitle, lineContext, rect });
      autoTranslate(text);
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [autoTranslate]);

  const handleSave = useCallback(() => {
    if (!selection) return;
    const vietnameseText = overrideVi !== null ? overrideVi.trim() : result.vietnamese;
    addWord({
      text:           selection.text,
      vietnameseText,
      phonetic:       result.phonetic     || undefined,
      partOfSpeech:   result.partOfSpeech || undefined,
      englishDef:     result.englishDef   || undefined,
      topicId:        selection.topicId,
      topicTitle:     selection.topicTitle,
      lineId:         selection.lineId,
      lineContext:    selection.lineContext,
    });
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, [selection, result, overrideVi, addWord]);

  const handleClose = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  if (!mounted || !selection) return null;

  const tooltipWidth = 310;
  const left = Math.min(
    Math.max(8, selection.rect.left + selection.rect.width / 2 - tooltipWidth / 2),
    window.innerWidth - tooltipWidth - 8
  );

  const displayVi = overrideVi !== null ? overrideVi : result.vietnamese;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position:  'fixed',
        left,
        top:       selection.rect.top - 8,
        transform: 'translateY(-100%)',
        zIndex:    9999,
        width:     tooltipWidth,
      }}
      className="bg-brand-surface border border-brand-border rounded-2xl shadow-2xl p-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-extrabold text-brand-muted uppercase tracking-wider">
          Lưu vào từ vựng
        </span>
        <button onMouseDown={(e) => e.preventDefault()} onClick={handleClose}
          className="text-brand-muted hover:text-brand-text transition-colors">
          <X size={13} />
        </button>
      </div>

      {/* Word + phonetic + POS */}
      <div className="bg-primary/8 rounded-xl px-3 py-2 mb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-primary">{selection.text}</span>
          {result.phonetic && (
            <span className="text-xs text-brand-muted font-mono">{result.phonetic}</span>
          )}
          {result.partOfSpeech && (
            <span className="text-[10px] font-bold text-brand-muted bg-brand-surface border border-brand-border/60 px-1.5 py-0.5 rounded-md italic">
              {result.partOfSpeech}
            </span>
          )}
        </div>
        {result.englishDef && (
          <p className="text-xs text-brand-muted mt-1 leading-relaxed line-clamp-2">
            {result.englishDef}
          </p>
        )}
      </div>

      {/* Vietnamese translation — editable, auto-filled */}
      <div className="relative mb-2">
        {translating ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border bg-brand-input text-brand-muted text-sm">
            <Loader2 size={13} className="animate-spin flex-shrink-0" />
            <span>Đang tra từ điển…</span>
          </div>
        ) : (
          <input
            value={displayVi}
            onChange={(e) => setOverrideVi(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleClose();
            }}
            placeholder="Nghĩa tiếng Việt…"
            className="w-full text-sm px-3 py-2 rounded-lg border border-brand-border bg-brand-input text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}
      </div>

      {/* Save */}
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSave}
        disabled={translating}
        className="w-full flex items-center justify-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BookmarkPlus size={14} />
        Lưu từ vựng
      </button>
    </div>,
    document.body
  );
}
