'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, difficultyColor } from '@/lib/utils';
import { CHARACTER_OPTIONS, type CharacterOption } from '@/types/training';
import { useAppStore } from '@/store/appStore';

interface Props {
  onStart: (topic: string, character: CharacterOption) => void;
}

export default function TopicSelector({ onStart }: Props) {
  const topics  = useAppStore((s) => s.topics);
  const [customTopic,  setCustomTopic]  = useState('');
  const [selectedTopic,setSelectedTopic]= useState<string>('');
  const [character,    setCharacter]    = useState<CharacterOption>(CHARACTER_OPTIONS[0]);
  const [search,       setSearch]       = useState('');

  const filtered = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const activeTopic = customTopic.trim() || selectedTopic;

  const handleStart = () => {
    if (!activeTopic) return;
    onStart(activeTopic, character);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-brand-strong">Training Talk</h1>
        <p className="text-brand-muted mt-2 max-w-md mx-auto">
          Choose a topic, pick your virtual conversation partner, and start practising
          real English conversation. Your performance is evaluated after every turn.
        </p>
      </div>

      {/* ── Character selection ───────────────────────────────────────────────── */}
      <section>
        <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted mb-3">
          Choose your conversation partner
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CHARACTER_OPTIONS.map((c) => (
            <motion.button
              key={c.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCharacter(c)}
              className={cn(
                'relative text-left p-4 rounded-2xl border-2 transition-all',
                character.name === c.name
                  ? 'border-primary shadow-card bg-primary/5'
                  : 'border-brand-border bg-brand-surface hover:border-brand-muted'
              )}
            >
              {character.name === c.name && (
                <motion.div
                  layoutId="char-selected"
                  className="absolute inset-0 rounded-2xl bg-primary/5 border-2 border-primary"
                />
              )}
              <div className="relative z-10">
                <div className={cn(
                  'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl mb-3 shadow-md',
                  c.color
                )}>
                  {c.emoji}
                </div>
                <p className="font-extrabold text-brand-strong text-sm">{c.label}</p>
                <p className="text-xs text-brand-muted mt-0.5 leading-snug">{c.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Custom topic input ────────────────────────────────────────────────── */}
      <section>
        <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted mb-3">
          Type your own topic
        </h2>
        <div className="flex gap-2">
          <Input
            value={customTopic}
            onChange={(e) => { setCustomTopic(e.target.value); setSelectedTopic(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="e.g. Giving feedback on a design, weekend plans, a job promotion…"
            className="flex-1"
          />
        </div>
      </section>

      {/* ── Topic picker from library ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-sm uppercase tracking-wider text-brand-muted">
            Or choose from your library
          </h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-brand-border bg-brand-surface text-brand-text placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-primary/40 w-36"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {filtered.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setSelectedTopic(t.title); setCustomTopic(''); }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all',
                selectedTopic === t.title
                  ? 'border-primary bg-primary/5'
                  : 'border-brand-border bg-brand-surface hover:border-brand-muted'
              )}
            >
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                selectedTopic === t.title ? 'bg-primary text-white' : 'bg-brand-input text-brand-muted'
              )}>
                <Tag size={13} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-brand-text truncate">{t.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {t.category && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary-dark">{t.category}</span>
                  )}
                  {t.difficulty && (
                    <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize', difficultyColor(t.difficulty))}>
                      {t.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-brand-muted col-span-2 py-4 text-center">No topics match your search.</p>
          )}
        </div>
      </section>

      {/* ── Start button ──────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleStart}
          disabled={!activeTopic}
          className="gap-2 px-10 rounded-2xl"
        >
          Start Conversation <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
