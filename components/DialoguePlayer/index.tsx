'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, MessageSquare, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAppStore, useCurrentTopic } from '@/store/appStore';
import { speak, stop } from '@/lib/tts';
import { localAudioPath, checkTopicDownloadStatus } from '@/lib/audioLibrary';
import ContextCard, { type DownloadStatus, type FailedLine } from './ContextCard';
import DialogueBubble from './DialogueBubble';
import VocabularyTooltip from './VocabularyTooltip';
import FloatingControls from '@/components/FloatingControls';
import PronunciationPractice from '@/components/PronunciationPractice';

export default function DialoguePlayer() {
  const topic = useCurrentTopic();
  const {
    activeLineIndex, setActiveLineIndex, advanceLine,
    settings, setSetting, practice, setPractice, resetPractice,
  } = useAppStore();

  const [isAutoPlaying,    setIsAutoPlaying]    = useState(false);
  const [downloadStatus,   setDownloadStatus]   = useState<DownloadStatus>({
    state: 'idle', downloadedCount: 0, totalCount: 0,
  });
  const [uploadingLines,   setUploadingLines]   = useState<Set<number>>(new Set());
  const [bubbleRefreshKey, setBubbleRefreshKey] = useState(0);

  const bottomRef      = useRef<HTMLDivElement>(null);
  const downloadAbort  = useRef(false);

  const participantMap = Object.fromEntries(
    (topic?.participants ?? []).map((p, i) => [p, i])
  );

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeLineIndex]);

  // ── Check local download status when topic changes ────────────────────────────
  useEffect(() => {
    if (!topic) return;
    let cancelled = false;

    setDownloadStatus({ state: 'checking', downloadedCount: 0, totalCount: topic.lines.length });

    checkTopicDownloadStatus(topic.id, topic.lines.length).then(({ fullyDownloaded, downloadedCount }) => {
      if (cancelled) return;
      setDownloadStatus({
        state:           fullyDownloaded ? 'done' : downloadedCount > 0 ? 'partial' : 'idle',
        downloadedCount,
        totalCount:      topic.lines.length,
        failedLines:     [],   // no errors from a passive check
      });
    });

    return () => { cancelled = true; };
  }, [topic?.id]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-play ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAutoPlaying || !topic) return;
    const line = topic.lines[activeLineIndex];
    if (!line) { setIsAutoPlaying(false); return; }

    speak(line.englishText, {
      rate:      settings.speechRate,
      voice:     (settings.voiceName ?? {})[line.characterId] ?? 'nova',
      localFile: localAudioPath(topic.id, activeLineIndex),
      onEnd: () => {
        const t = setTimeout(() => {
          if (activeLineIndex < topic.lines.length - 1) advanceLine();
          else setIsAutoPlaying(false);
        }, 600);
        return () => clearTimeout(t);
      },
      onError: () => setIsAutoPlaying(false),
    });

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, activeLineIndex, topic?.id]);

  // ── Download all lines via Edge TTS (free, no rate limit) ───────────────────
  //
  // Edge TTS has no hard rate limit. We add a small pause between requests
  // as a courtesy to avoid hammering the service.
  const RATE_LIMIT_DELAY_MS = 300; // 300 ms between requests

  const handleDownload = useCallback(async () => {
    if (!topic) return;

    downloadAbort.current = false;

    const failedLines: FailedLine[] = [];
    let done = 0;

    setDownloadStatus({
      state: 'downloading', downloadedCount: 0,
      totalCount: topic.lines.length, failedLines: [], rateLimitCountdown: 0,
    });

    for (let i = 0; i < topic.lines.length; i++) {
      if (downloadAbort.current) break;

      // ── Rate-limit countdown (skip before the very first request) ─────────
      if (i > 0) {
        let remaining = Math.ceil(RATE_LIMIT_DELAY_MS / 1000);
        while (remaining > 0 && !downloadAbort.current) {
          setDownloadStatus((prev) => ({ ...prev, rateLimitCountdown: remaining }));
          await new Promise((r) => setTimeout(r, 1000));
          remaining--;
        }
        setDownloadStatus((prev) => ({ ...prev, rateLimitCountdown: 0 }));
        if (downloadAbort.current) break;
      }

      const line  = topic.lines[i];
      const voice = (settings.voiceName ?? {})[line.characterId] ?? 'nova';

      try {
        const res = await fetch('/api/audio-library/save', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topicId:     topic.id,
            lineIndex:   i,
            text:        line.englishText,
            openaiVoice: voice,
          }),
        });

        if (res.ok) {
          done++;
        } else {
          let errorMsg = `HTTP ${res.status}`;
          try {
            const json = await res.json();
            if (res.status === 502 || res.status === 503) {
              errorMsg = json.detail
                ? extractEdgeError(json.detail)
                : (json.error ?? 'Edge TTS error — check server logs');
            } else {
              errorMsg = json.error ?? errorMsg;
            }
          } catch { /* ignore */ }

          failedLines.push({
            lineIndex:   i,
            characterId: line.characterId,
            text:        line.englishText.slice(0, 80) + (line.englishText.length > 80 ? '…' : ''),
            error:       errorMsg,
          });
        }
      } catch (e) {
        failedLines.push({
          lineIndex:   i,
          characterId: line.characterId,
          text:        line.englishText.slice(0, 80) + (line.englishText.length > 80 ? '…' : ''),
          error:       e instanceof Error ? e.message : 'Network error',
        });
      }

      setDownloadStatus({
        state:             'downloading',
        downloadedCount:   done,
        totalCount:        topic.lines.length,
        failedLines:       [],
        rateLimitCountdown: 0,
      });
    }

    // Final state
    setDownloadStatus({
      state:             done === topic.lines.length ? 'done' : 'partial',
      downloadedCount:   done,
      totalCount:        topic.lines.length,
      failedLines,
      rateLimitCountdown: 0,
    });

    setBubbleRefreshKey((k) => k + 1);
  }, [topic, settings.voiceName]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Manual upload for a failed line ──────────────────────────────────────────
  const handleUpload = useCallback(async (lineIndex: number, file: File) => {
    if (!topic) return;

    setUploadingLines((prev) => new Set(prev).add(lineIndex));

    try {
      const formData = new FormData();
      formData.append('topicId',    topic.id);
      formData.append('lineIndex',  String(lineIndex));
      formData.append('file',       file);

      const res = await fetch('/api/audio-library/upload', {
        method: 'POST',
        body:   formData,
      });

      if (res.ok) {
        // Remove this line from failedLines
        setDownloadStatus((prev) => {
          const remaining = (prev.failedLines ?? []).filter((fl) => fl.lineIndex !== lineIndex);
          return {
            ...prev,
            downloadedCount: prev.downloadedCount + 1,
            state:           remaining.length === 0 && prev.downloadedCount + 1 === prev.totalCount
                               ? 'done'
                               : 'partial',
            failedLines: remaining,
          };
        });

        // Refresh bubbles so this line shows HardDrive icon
        setBubbleRefreshKey((k) => k + 1);
      } else {
        const json = await res.json().catch(() => ({}));
        alert(`Upload failed: ${json.error ?? 'Unknown error'}`);
      }
    } catch (e) {
      alert(`Upload failed: ${e instanceof Error ? e.message : 'Network error'}`);
    } finally {
      setUploadingLines((prev) => {
        const next = new Set(prev);
        next.delete(lineIndex);
        return next;
      });
    }
  }, [topic]);

  // ── Empty state ───────────────────────────────────────────────────────────────
  if (!topic) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
          <MessageSquare size={36} className="text-primary opacity-60" />
        </div>
        <h2 className="text-xl font-extrabold text-brand-strong mb-2">No Topic Selected</h2>
        <p className="text-brand-muted text-sm max-w-xs">
          Choose a topic from the sidebar, or import / generate new dialogues to get started.
        </p>
      </div>
    );
  }

  const progress = ((activeLineIndex + 1) / topic.lines.length) * 100;

  const toggleAutoPlay = () => {
    if (isAutoPlaying) { stop(); setIsAutoPlaying(false); }
    else               { setIsAutoPlaying(true); }
  };

  const restart = () => {
    stop();
    setIsAutoPlaying(false);
    setActiveLineIndex(0);
    resetPractice();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Progress bar + Vietnamese toggle */}
      <div className="px-5 pt-3 pb-2 border-b border-brand-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-brand-muted">
            Line {activeLineIndex + 1} of {topic.lines.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Languages size={11} className="text-brand-muted" />
            <span className="text-[11px] font-bold text-brand-muted">Tiếng Việt</span>
            <Switch
              checked={settings.showTranslation}
              onCheckedChange={(v) => setSetting('showTranslation', v)}
              className="scale-75 origin-right"
            />
          </div>
        </div>
        <Progress value={progress} />
      </div>

      {/* Scrollable dialogue */}
      <div className="flex-1 overflow-y-auto px-3 md:px-5 py-4 md:py-5 space-y-3 md:space-y-4">
        {/* Mascot greeting */}
        <div className="flex flex-col items-center py-4 md:py-6 gap-2 md:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot.png"
            alt="Mascot"
            className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-xl"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="text-center">
            <p className="font-extrabold text-brand-strong text-sm md:text-base">Chào Anthony!</p>
            <p className="text-xs md:text-sm text-brand-muted mt-0.5">Bắt đầu hội thoại thôi nào 🎯</p>
          </div>
        </div>

        <ContextCard
          topic={topic}
          downloadStatus={downloadStatus}
          onDownload={handleDownload}
          onUpload={handleUpload}
          uploadingLines={uploadingLines}
        />

        <AnimatePresence initial={false}>
          {topic.lines.slice(0, activeLineIndex + 1).map((line, i) => (
            <DialogueBubble
              key={line.id}
              line={line}
              participantIndex={participantMap[line.characterId] ?? 0}
              isActive={i === activeLineIndex && settings.highlightActiveLines}
              isDimmed={settings.highlightActiveLines && i < activeLineIndex}
              lineIndex={i}
              topicId={topic.id}
              topicTitle={topic.title}
              refreshKey={bubbleRefreshKey}
              onPractice={(lineId) => { resetPractice(); setPractice({ mode: 'idle', targetLineId: lineId }); }}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Pronunciation practice panel */}
      <AnimatePresence>
        {practice.targetLineId && (
          <motion.div
            key="practice"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="border-t border-brand-border bg-brand-surface shadow-2xl"
          >
            <PronunciationPractice
              line={topic.lines.find((l) => l.id === practice.targetLineId) ?? topic.lines[0]}
              onClose={resetPractice}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vocabulary tooltip — appears on text selection */}
      <VocabularyTooltip />

      {/* Playback controls — left / center / right layout */}
      <div className="border-t border-brand-border bg-brand-surface px-3 md:px-5 py-2 md:py-3 flex items-center">
        {/* Left */}
        <div className="flex-1 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={restart} title="Restart">
            <RotateCcw size={16} />
          </Button>
          <Button
            variant="ghost" size="icon"
            onClick={() => {
              const line = topic.lines[activeLineIndex];
              speak(line.englishText, {
                rate:      settings.speechRate,
                voice:     (settings.voiceName ?? {})[line.characterId] ?? 'nova',
                localFile: localAudioPath(topic.id, activeLineIndex),
              });
            }}
            title="Speak current line"
          >
            <Volume2 size={16} />
          </Button>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline" size="icon"
            onClick={() => setActiveLineIndex(Math.max(0, activeLineIndex - 1))}
            disabled={activeLineIndex === 0}
          >
            <SkipBack size={16} />
          </Button>
          <Button
            size="icon-lg" variant={isAutoPlaying ? 'danger' : 'primary'}
            onClick={toggleAutoPlay} className="rounded-full"
          >
            {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          <Button
            variant="outline" size="icon"
            onClick={() => setActiveLineIndex(Math.min(topic.lines.length - 1, activeLineIndex + 1))}
            disabled={activeLineIndex === topic.lines.length - 1}
          >
            <SkipForward size={16} />
          </Button>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-end">
          <span className="text-xs font-bold text-brand-muted truncate max-w-[120px]">
            {topic.participants.join(' · ')}
          </span>
        </div>
      </div>

      {/* Floating speed + voice controls */}
      <FloatingControls />
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Extract a human-readable message from an Edge TTS error. */
function extractEdgeError(detail: string): string {
  const d = String(detail).toLowerCase();
  if (d.includes('network') || d.includes('fetch') || d.includes('socket')) {
    return 'Network error — check your internet connection';
  }
  if (d.includes('timeout')) return 'Request timed out — try again';
  return String(detail).slice(0, 120);
}
