'use client';

import { BookOpen, BookMarked, Heart, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { useVocabularyStore } from '@/store/vocabularyStore';

type AppMode = 'dialogue' | 'vocabulary' | 'favorites';

interface NavItem {
  id:      AppMode | 'setting';
  label:   string;
  icon:    React.ReactNode;
  badge?:  number;
}

export default function MobileNav() {
  const { setSettingsPanelOpen, favoriteTopicIds, appMode: mode, setAppMode: setMode } = useAppStore();
  const wordCount = useVocabularyStore((s) => s.words.length);
  const favCount  = favoriteTopicIds.length;

  const items: NavItem[] = [
    {
      id:    'dialogue',
      label: 'Dialogue',
      icon:  <BookOpen size={22} />,
    },
    {
      id:    'vocabulary',
      label: 'Saved Words',
      icon:  <BookMarked size={22} />,
      badge: wordCount > 0 ? wordCount : undefined,
    },
    {
      id:    'favorites',
      label: 'Yêu Thích',
      icon:  <Heart size={22} />,
      badge: favCount > 0 ? favCount : undefined,
    },
    {
      id:    'setting',
      label: 'Setting',
      icon:  <Settings size={22} />,
    },
  ];

  const handleTap = (id: AppMode | 'setting') => {
    if (id === 'setting') {
      setSettingsPanelOpen(true);
    } else {
      setMode(id);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-surface border-t border-brand-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch h-14">
        {items.map((item) => {
          const isActive = item.id !== 'setting' && mode === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTap(item.id)}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive ? 'text-primary' : 'text-brand-muted'
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-b-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon + badge */}
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center justify-center px-1 leading-none">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-bold leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
