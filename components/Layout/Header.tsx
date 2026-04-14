'use client';

import { motion } from 'framer-motion';
import { Settings, Upload, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAppStore, useCurrentTopic } from '@/store/appStore';

export default function Header() {
  const { setSettingsPanelOpen, setDataPanelOpen, setSidebarOpen, sidebarOpen } = useAppStore();
  const currentTopic = useCurrentTopic();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-30 h-14 md:h-16 bg-brand-surface border-b border-brand-border shadow-sm flex items-center px-3 md:px-4 gap-2 md:gap-3"
    >
      {/* Mobile sidebar toggle — only in dialogue mode when a topic may be selected */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex-shrink-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Topics"
      >
        <Menu size={20} />
      </Button>

      {/* Logo / mascot */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot.png"
          alt="Mascot"
          className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const fb = img.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = 'flex';
          }}
        />
        {/* Fallback */}
        <div className="hidden w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary items-center justify-center shadow-md flex-shrink-0">
          <span className="text-white font-extrabold">E</span>
        </div>

        {/* Title: on mobile show current topic name (truncated), on desktop show app name */}
        <div className="min-w-0">
          <h1 className="font-extrabold text-brand-strong leading-tight text-base md:text-lg truncate">
            {/* Mobile: show topic title if selected, else app name */}
            <span className="md:hidden">
              {currentTopic
                ? <span className="text-sm font-bold">{currentTopic.title}</span>
                : <>Mew<span className="text-primary">Learning</span></>
              }
            </span>
            {/* Desktop: always show app name */}
            <span className="hidden md:inline">
              Mew<span className="text-primary">Learning</span>
            </span>
          </h1>
          <p className="hidden md:block text-[10px] text-brand-muted -mt-0.5 font-semibold tracking-wide uppercase">
            English · Vietnamese
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Import — desktop label, mobile icon only */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-1.5 text-sm"
          onClick={() => setDataPanelOpen(true)}
        >
          <Upload size={15} />
          Import / Generate
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setDataPanelOpen(true)}
          aria-label="Import"
        >
          <Upload size={18} />
        </Button>

        <ThemeToggle />

        {/* Settings — desktop only (mobile has it in bottom nav) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={() => setSettingsPanelOpen(true)}
          aria-label="Settings"
        >
          <Settings size={18} />
        </Button>
      </div>
    </motion.header>
  );
}
