'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, BookOpen, Tag,
  Download, CheckCircle2, Loader2, RefreshCw, HardDrive,
  AlertTriangle, Upload, XCircle, WifiOff,
} from 'lucide-react';
import { difficultyColor, cn } from '@/lib/utils';
import type { DialogueTopic } from '@/types';

const AVATAR_PALETTE = [
  'bg-primary text-white',
  'bg-secondary text-white',
  'bg-accent text-brand-text',
  'bg-danger text-white',
  'bg-purple-500 text-white',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FailedLine {
  lineIndex:   number;
  characterId: string;
  text:        string;        // short excerpt for display
  error:       string;        // error message from API
}

export interface DownloadStatus {
  state:             'idle' | 'checking' | 'downloading' | 'done' | 'partial' | 'unavailable';
  downloadedCount:   number;
  totalCount:        number;
  failedLines?:      FailedLine[];
  /** Seconds remaining in the rate-limit pause between requests. 0 = not waiting. */
  rateLimitCountdown?: number;
}

interface Props {
  topic:          DialogueTopic;
  downloadStatus: DownloadStatus;
  onDownload:     () => void;
  onUpload:       (lineIndex: number, file: File) => Promise<void>;
  uploadingLines: Set<number>;    // lines currently being uploaded
}

// ─── Download header button ───────────────────────────────────────────────────

function DownloadButton({ status, onClick }: { status: DownloadStatus; onClick: () => void }) {
  const { state, downloadedCount, totalCount, failedLines } = status;
  const failCount = failedLines?.length ?? 0;

  if (state === 'checking') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-muted px-3 py-1.5 rounded-xl bg-brand-input">
        <Loader2 size={12} className="animate-spin" />
        Checking…
      </div>
    );
  }

  if (state === 'downloading') {
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 min-w-[160px]">
        <Loader2 size={12} className="animate-spin" />
        Generating {downloadedCount + 1}/{totalCount}…
      </div>
    );
  }

  if (state === 'done') {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-[11px] font-bold text-success px-3 py-1.5 rounded-xl bg-success/10 border border-success/20 hover:bg-success/20 transition-all"
        title="All audio files saved locally. Click to re-download."
      >
        <CheckCircle2 size={12} />
        <HardDrive size={12} />
        Saved locally · {totalCount} files
        <RefreshCw size={10} className="opacity-50" />
      </button>
    );
  }

  if (state === 'partial' && failCount > 0) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-[11px] font-bold text-danger px-3 py-1.5 rounded-xl bg-danger/10 border border-danger/20 hover:bg-danger/20 transition-all"
        title={`${failCount} lines failed. Click to retry.`}
      >
        <AlertTriangle size={12} />
        {downloadedCount}/{totalCount} done · {failCount} failed — Retry
      </button>
    );
  }

  if (state === 'partial') {
    // partial because not all downloaded yet (no attempt error)
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-[11px] font-bold text-accent-dark px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all"
      >
        <Download size={12} />
        Resume download ({downloadedCount}/{totalCount})
      </button>
    );
  }

  if (state === 'unavailable') {
    return (
      <div
        className="flex items-center gap-1.5 text-[11px] font-bold text-brand-muted/50 px-3 py-1.5 rounded-xl bg-brand-input border border-transparent cursor-not-allowed"
        title="Saving audio files to disk requires running the app locally. Not available on Vercel."
      >
        <WifiOff size={12} />
        <HardDrive size={12} />
        Local only — not on Vercel
      </div>
    );
  }

  // idle
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[11px] font-bold text-brand-muted px-3 py-1.5 rounded-xl bg-brand-input hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
      title="Download all audio lines via Edge TTS and save to local disk."
    >
      <Download size={12} />
      <HardDrive size={12} />
      Download audio for local
    </button>
  );
}

// ─── Failed lines list ────────────────────────────────────────────────────────

function FailedLineRow({
  failed,
  uploading,
  onUpload,
}: {
  failed:    FailedLine;
  uploading: boolean;
  onUpload:  (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUpload(f);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="flex items-start gap-2.5 py-2 px-3 rounded-xl bg-danger/5 border border-danger/15">
      {/* Line number */}
      <span className="text-[10px] font-extrabold text-danger/70 mt-0.5 flex-shrink-0 w-5 text-right">
        #{failed.lineIndex + 1}
      </span>

      {/* Text + error */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-brand-text truncate">
          <span className="text-brand-muted font-bold mr-1">{failed.characterId}:</span>
          {failed.text}
        </p>
        <p className="text-[10px] text-danger mt-0.5 font-medium flex items-center gap-1">
          <XCircle size={9} />
          {failed.error}
        </p>
      </div>

      {/* Upload button */}
      <div className="flex-shrink-0">
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all',
            uploading
              ? 'bg-secondary/10 text-secondary border-secondary/20 cursor-wait opacity-70'
              : 'bg-brand-surface text-brand-muted border-brand-border hover:bg-primary/10 hover:text-primary hover:border-primary/20'
          )}
          title="Upload a WAV/MP3 file for this line"
        >
          {uploading
            ? <><Loader2 size={10} className="animate-spin" /> Uploading…</>
            : <><Upload size={10} /> Upload WAV</>
          }
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContextCard({ topic, downloadStatus, onDownload, onUpload, uploadingLines }: Props) {
  const { failedLines = [] } = downloadStatus;

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-gradient-to-br from-primary/8 via-brand-surface to-secondary/8 rounded-2xl border border-brand-border shadow-card p-5 mb-5"
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-md">
          <BookOpen size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-xl text-brand-strong leading-tight">{topic.title}</h2>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {topic.category && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-dark uppercase tracking-wide">
                <Tag size={9} /> {topic.category}
              </span>
            )}
            {topic.difficulty && (
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full capitalize', difficultyColor(topic.difficulty))}>
                {topic.difficulty}
              </span>
            )}
            <span className="text-[10px] font-semibold text-brand-muted">{topic.lines.length} lines</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-brand-muted leading-relaxed">{topic.description}</p>

      {/* Characters + download button */}
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-brand-muted flex-shrink-0" />
          <span className="text-xs font-semibold text-brand-muted">Characters:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {topic.participants.map((name, i) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold', AVATAR_PALETTE[i % AVATAR_PALETTE.length])}>
                  {name[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-brand-text">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <DownloadButton status={downloadStatus} onClick={onDownload} />
      </div>

      {/* ── Failed lines section ────────────────────────────────────────────── */}
      <AnimatePresence>
        {failedLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-danger/20">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} className="text-danger" />
                <span className="text-[11px] font-extrabold text-danger uppercase tracking-wide">
                  {failedLines.length} line{failedLines.length > 1 ? 's' : ''} failed — upload WAV manually
                </span>
              </div>
              <p className="text-[10px] text-brand-muted mb-3 leading-relaxed">
                Edge TTS could not generate audio for the lines below (network or API error).
                You can upload your own WAV or MP3 file for each line — it will be used instead.
              </p>
              <div className="space-y-2">
                {failedLines.map((fl) => (
                  <FailedLineRow
                    key={fl.lineIndex}
                    failed={fl}
                    uploading={uploadingLines.has(fl.lineIndex)}
                    onUpload={(file) => onUpload(fl.lineIndex, file)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
