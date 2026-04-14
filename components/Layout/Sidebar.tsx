'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, ChevronRight, Heart } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, difficultyColor } from '@/lib/utils';
import type { DialogueTopic } from '@/types';

function TopicItem({ topic, isActive }: { topic: DialogueTopic; isActive: boolean }) {
  const { setCurrentTopic, removeTopic, toggleFavorite, favoriteTopicIds } = useAppStore();
  const isFav = favoriteTopicIds.includes(topic.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={() => setCurrentTopic(topic.id)}
        className={cn(
          'group w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-150',
          isActive
            ? 'bg-primary/10 border border-primary/20 shadow-sm'
            : 'hover:bg-brand-input border border-transparent'
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            isActive ? 'bg-primary text-white' : 'bg-brand-input text-brand-muted'
          )}
        >
          <MessageSquare size={15} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-bold text-sm truncate', isActive ? 'text-primary-dark' : 'text-brand-text')}>
            {topic.title}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            {topic.difficulty && (
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize', difficultyColor(topic.difficulty))}>
                {topic.difficulty}
              </span>
            )}
            <span className="text-[10px] text-brand-muted font-medium">
              {topic.lines.length} lines
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(topic.id); }}
            className={cn(
              'p-1 rounded-md transition-colors',
              isFav
                ? 'text-red-500 opacity-100'
                : 'text-brand-muted opacity-0 group-hover:opacity-100 hover:text-red-400'
            )}
            title={isFav ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          >
            <Heart size={13} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); removeTopic(topic.id); }}
            className="p-1 rounded-md text-brand-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-colors"
            title="Remove topic"
          >
            <Trash2 size={13} />
          </button>
          <ChevronRight size={14} className={cn('text-brand-muted', isActive && 'text-primary')} />
        </div>
      </button>
    </motion.div>
  );
}

export default function Sidebar() {
  const { topics, currentTopicId, sidebarOpen, setDataPanelOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:relative z-20 top-0 left-0 h-full w-[85vw] max-w-xs md:w-64 bg-brand-surface border-r border-brand-border flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-brand-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-brand-strong text-sm uppercase tracking-wider">
                  Topics
                </h2>
                <Badge variant="secondary">{topics.length}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full text-sm gap-1.5" onClick={() => setDataPanelOpen(true)}>
                <Plus size={14} /> Add Topic
              </Button>
            </div>

            {/* Topic list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <AnimatePresence>
                {topics.map((topic) => (
                  <TopicItem key={topic.id} topic={topic} isActive={topic.id === currentTopicId} />
                ))}
              </AnimatePresence>

              {topics.length === 0 && (
                <div className="text-center py-8 text-brand-muted">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No topics yet.</p>
                  <p className="text-xs mt-1">Import a file or generate one with AI.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-brand-border space-y-1.5">
              <p className="text-[10px] text-brand-muted text-center font-medium">
                {topics.reduce((acc, t) => acc + t.lines.length, 0)} total dialogue lines
              </p>
              <p className="text-[9px] text-brand-muted/60 text-center font-medium leading-relaxed">
                Made by 🖐️ &amp; Claude Code · 2026
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
