'use client';

import { useState, useMemo, useRef } from 'react';
import { Search, Volume2, Trash2, BookOpen, Pencil, Check, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useVocabularyStore } from '@/store/vocabularyStore';
import { useAppStore } from '@/store/appStore';
import { speak } from '@/lib/tts';
import { cn } from '@/lib/utils';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export default function SavedWords() {
  const { words, removeWord, updateVietnamese } = useVocabularyStore();
  const { settings, setCurrentTopic, setAppMode } = useAppStore();

  const [query,   setQuery]   = useState('');
  const [editId,  setEditId]  = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter(
      (w) =>
        w.text.toLowerCase().includes(q) ||
        w.vietnameseText.toLowerCase().includes(q) ||
        w.topicTitle.toLowerCase().includes(q)
    );
  }, [words, query]);

  const startEdit = (id: string, current: string) => {
    setEditId(id);
    setEditVal(current);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const commitEdit = (id: string) => {
    updateVietnamese(id, editVal.trim());
    setEditId(null);
    toast.success('Translation saved');
  };

  const cancelEdit = () => setEditId(null);

  const handleSpeak = (text: string) => {
    speak(text, { rate: settings.speechRate, gender: 'female' });
  };

  const handleGoToSource = (topicId: string) => {
    setCurrentTopic(topicId);
    setAppMode('dialogue');
  };

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (words.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
          <BookOpen size={36} className="text-primary opacity-60" />
        </div>
        <h2 className="text-xl font-extrabold text-brand-strong mb-2">Chưa có từ nào</h2>
        <p className="text-brand-muted text-sm max-w-xs leading-relaxed">
          Bôi đen bất kỳ cụm từ nào trong đoạn hội thoại để lưu vào từ vựng yêu thích.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-5 pt-4 pb-3 border-b border-brand-border bg-brand-surface flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h2 className="font-extrabold text-brand-strong text-base">Kho từ vựng</h2>
          </div>
          <span className="text-xs font-bold text-brand-muted bg-brand-bg px-2 py-0.5 rounded-full">
            {words.length} từ
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm từ, nghĩa tiếng Việt, hoặc chủ đề…"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-brand-border bg-brand-input text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-brand-muted text-sm">
            Không tìm thấy từ nào khớp.
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-brand-surface z-10">
              <tr className="border-b border-brand-border">
                <th className="text-left text-[10px] font-extrabold text-brand-muted uppercase tracking-wider px-3 md:px-4 py-2.5 w-8 hidden sm:table-cell">#</th>
                <th className="text-left text-[10px] font-extrabold text-brand-muted uppercase tracking-wider px-3 py-2.5">Từ / Cụm từ</th>
                <th className="text-left text-[10px] font-extrabold text-brand-muted uppercase tracking-wider px-3 py-2.5">Nghĩa tiếng Việt</th>
                <th className="text-left text-[10px] font-extrabold text-brand-muted uppercase tracking-wider px-3 py-2.5 hidden md:table-cell">Hội thoại</th>
                <th className="w-16 md:w-20 px-2 md:px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((word, idx) => (
                <tr
                  key={word.id}
                  className="border-b border-brand-border/50 hover:bg-brand-bg/60 transition-colors group"
                >
                  {/* STT */}
                  <td className="px-3 md:px-4 py-3 text-brand-muted font-bold text-xs hidden sm:table-cell">{idx + 1}</td>

                  {/* Word + listen */}
                  <td className="px-3 py-2.5 md:py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(word.text)}
                        title="Nghe phát âm"
                        className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
                        <Volume2 size={11} />
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <p className="font-bold text-brand-text leading-tight">{word.text}</p>
                          {word.phonetic && (
                            <span className="text-[10px] text-brand-muted font-mono">{word.phonetic}</span>
                          )}
                          {word.partOfSpeech && (
                            <span className="text-[9px] font-bold text-brand-muted bg-brand-bg border border-brand-border/50 px-1 py-px rounded italic">
                              {word.partOfSpeech}
                            </span>
                          )}
                        </div>
                        {word.englishDef && (
                          <p className="text-[10px] text-brand-muted mt-0.5 leading-tight line-clamp-1">
                            {word.englishDef}
                          </p>
                        )}
                        {!word.englishDef && word.lineContext && (
                          <p className="text-[10px] text-brand-muted mt-0.5 leading-tight line-clamp-1 italic">
                            {word.lineContext}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Vietnamese — inline editable */}
                  <td className="px-3 py-3">
                    {editId === word.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={editRef}
                          value={editVal}
                          onChange={(e) => setEditVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')  commitEdit(word.id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 text-sm px-2 py-0.5 rounded-lg border border-primary/40 bg-brand-input text-brand-text focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-0"
                        />
                        <button onClick={() => commitEdit(word.id)} className="text-success hover:text-success/80 flex-shrink-0">
                          <Check size={13} />
                        </button>
                        <button onClick={cancelEdit} className="text-brand-muted hover:text-brand-text flex-shrink-0">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(word.id, word.vietnameseText)}
                        className="flex items-center gap-1.5 group/edit w-full text-left rounded-lg px-1.5 py-0.5 -mx-1.5 hover:bg-brand-bg transition-colors"
                        title="Nhấn để sửa nghĩa"
                      >
                        <span className={cn('text-sm leading-tight flex-1', word.vietnameseText ? 'text-brand-text' : 'text-brand-muted italic')}>
                          {word.vietnameseText || 'Thêm nghĩa…'}
                        </span>
                        <Pencil size={10} className="text-brand-muted opacity-0 group-hover/edit:opacity-100 flex-shrink-0 transition-opacity" />
                      </button>
                    )}
                  </td>

                  {/* Source topic */}
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-muted bg-brand-bg border border-brand-border/60 rounded-lg px-2 py-0.5 max-w-[160px] truncate">
                      {word.topicTitle}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Jump to source */}
                      <button
                        onClick={() => handleGoToSource(word.topicId)}
                        title="Go to source dialogue"
                        className="w-6 h-6 rounded-lg bg-brand-input text-brand-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                      >
                        <ExternalLink size={11} />
                      </button>

                      {/* Confirm delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            title="Xóa từ này"
                            className="w-6 h-6 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove word?</AlertDialogTitle>
                            <AlertDialogDescription>
                              &ldquo;{word.text}&rdquo; will be removed from your vocabulary list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { removeWord(word.id); toast.success('Word removed'); }}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
