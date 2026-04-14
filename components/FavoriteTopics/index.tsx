'use client';

import { Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { Badge } from '@/components/ui/badge';
import { cn, difficultyColor } from '@/lib/utils';
import type { DialogueTopic } from '@/types';

function FavTopicCard({
  topic,
  isActive,
  onSelect,
  onUnfav,
}: {
  topic:    DialogueTopic;
  isActive: boolean;
  onSelect: () => void;
  onUnfav:  () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <button
        onClick={onSelect}
        className={cn(
          'group w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all border',
          isActive
            ? 'bg-primary/10 border-primary/20 shadow-sm'
            : 'bg-brand-surface border-brand-border hover:border-primary/30 hover:shadow-sm'
        )}
      >
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
          isActive ? 'bg-primary text-white' : 'bg-brand-input text-brand-muted'
        )}>
          <MessageSquare size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-bold text-sm truncate', isActive ? 'text-primary' : 'text-brand-text')}>
            {topic.title}
          </p>
          {topic.description && (
            <p className="text-xs text-brand-muted mt-0.5 line-clamp-2 leading-relaxed">
              {topic.description}
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1.5">
            {topic.difficulty && (
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize', difficultyColor(topic.difficulty))}>
                {topic.difficulty}
              </span>
            )}
            {topic.category && (
              <span className="text-[10px] text-brand-muted font-medium bg-brand-bg px-1.5 py-0.5 rounded-full">
                {topic.category}
              </span>
            )}
            <span className="text-[10px] text-brand-muted font-medium">
              {topic.lines.length} lines · {topic.participants.join(', ')}
            </span>
          </div>
        </div>

        {/* Unfavorite */}
        <button
          onClick={(e) => { e.stopPropagation(); onUnfav(); }}
          title="Bỏ yêu thích"
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
        >
          <Heart size={14} fill="currentColor" className="text-red-500" />
        </button>
      </button>
    </motion.div>
  );
}

export default function FavoriteTopics({ onOpenDialogue }: { onOpenDialogue: () => void }) {
  const { topics, currentTopicId, favoriteTopicIds, setCurrentTopic, toggleFavorite } = useAppStore();
  const favTopics = topics.filter((t) => favoriteTopicIds.includes(t.id));

  const handleSelect = (id: string) => {
    setCurrentTopic(id);
    onOpenDialogue();
  };

  if (favTopics.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <Heart size={36} className="text-red-400 opacity-60" />
        </div>
        <h2 className="text-xl font-extrabold text-brand-strong mb-2">Chưa có topic yêu thích</h2>
        <p className="text-brand-muted text-sm max-w-xs leading-relaxed">
          Click vào icon ❤ trên bất kỳ topic nào trong danh sách để lưu vào đây.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-brand-border bg-brand-surface flex-shrink-0">
        <div className="flex items-center gap-2">
          <Heart size={18} className="text-red-500" fill="currentColor" />
          <h2 className="font-extrabold text-brand-strong text-base">Topic Yêu Thích</h2>
          <Badge variant="secondary" className="ml-auto">{favTopics.length}</Badge>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {favTopics.map((topic) => (
              <FavTopicCard
                key={topic.id}
                topic={topic}
                isActive={topic.id === currentTopicId}
                onSelect={() => handleSelect(topic.id)}
                onUnfav={() => toggleFavorite(topic.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
