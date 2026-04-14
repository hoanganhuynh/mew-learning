'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, BookMarked, Heart } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import Header from '@/components/Layout/Header';
import Sidebar from '@/components/Layout/Sidebar';
import MobileNav from '@/components/Layout/MobileNav';
import DialoguePlayer from '@/components/DialoguePlayer';
import SettingsPanel from '@/components/Settings/SettingsPanel';
import DataManagementPanel from '@/components/DataManagement/DataManagementPanel';
import SavedWords from '@/components/SavedWords';
import FavoriteTopics from '@/components/FavoriteTopics';
import { useVocabularyStore } from '@/store/vocabularyStore';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

type AppMode = 'dialogue' | 'vocabulary' | 'favorites';

/**
 * Root page — assembles the full application shell.
 *
 *  Modes (toggled via tabs below the header):
 *    • Dialogue Practice  — topic list + dialogue player + pronunciation
 *    • Training Talk      — virtual character + turn-by-turn conversation
 */
export default function Home() {
  const [mode, setMode] = useState<AppMode>('dialogue');
  const wordCount  = useVocabularyStore((s) => s.words.length);
  const favCount   = useAppStore((s) => s.favoriteTopicIds.length);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-screen overflow-hidden">

        {/* ── Top header bar ──────────────────────────────────────────────── */}
        <Header />

        {/* ── Mode tabs — desktop only ────────────────────────────────────── */}
        <div className="hidden md:flex items-end gap-0 px-4 bg-brand-surface border-b border-brand-border flex-shrink-0">
          <ModeTab
            active={mode === 'dialogue'}
            onClick={() => setMode('dialogue')}
            icon={<BookOpen size={14} />}
            label="Dialogue Practice"
          />
          <ModeTab
            active={mode === 'vocabulary'}
            onClick={() => setMode('vocabulary')}
            icon={<BookMarked size={14} />}
            label="Saved Words"
            badge={wordCount > 0 ? wordCount : undefined}
          />
          <ModeTab
            active={mode === 'favorites'}
            onClick={() => setMode('favorites')}
            icon={<Heart size={14} />}
            label="Yêu Thích"
            badge={favCount > 0 ? favCount : undefined}
          />
        </div>

        {/* ── Main content area ─────────────────────────────────────────────
             pb-14 reserves space for the mobile bottom nav (56px = h-14).
             md:pb-0 removes it on desktop where nav is not shown.          ── */}
        <div className="flex flex-1 overflow-hidden min-h-0 pb-14 md:pb-0">

          {/* ── Dialogue Practice mode ─────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {mode === 'dialogue' && (
              <motion.div
                key="dialogue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 overflow-hidden min-h-0 w-full"
              >
                {/* Sidebar — topics list */}
                <Sidebar />

                {/* Dialogue player fills remaining space */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-bg">
                  <DialoguePlayer />
                </main>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Saved Words mode ───────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {mode === 'vocabulary' && (
              <motion.div
                key="vocabulary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-hidden min-h-0 w-full bg-brand-bg"
              >
                <SavedWords />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Favorite Topics mode ───────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {mode === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-hidden min-h-0 w-full bg-brand-bg"
              >
                <FavoriteTopics onOpenDialogue={() => setMode('dialogue')} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── Mobile bottom navigation ────────────────────────────────────── */}
        <MobileNav mode={mode} setMode={setMode} />

        {/* ── Global modals ───────────────────────────────────────────────── */}
        <SettingsPanel />
        <DataManagementPanel />
      </div>
    </TooltipProvider>
  );
}

// ─── Mode tab sub-component ───────────────────────────────────────────────────

function ModeTab({
  active, onClick, icon, label, badge,
}: {
  active:   boolean;
  onClick:  () => void;
  icon:     React.ReactNode;
  label:    string;
  badge?:   number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors',
        'focus-visible:outline-none',
        active
          ? 'text-primary'
          : 'text-brand-muted hover:text-brand-text'
      )}
    >
      {icon}
      {label}
      {badge !== undefined && (
        <span className="ml-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center px-1">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {/* active underline */}
      {active && (
        <motion.div
          layoutId="mode-tab-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}
