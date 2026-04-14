import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedWord } from '@/types/vocabulary';

interface VocabularyStore {
  words: SavedWord[];
  addWord:          (word: Omit<SavedWord, 'id' | 'savedAt'>) => void;
  removeWord:       (id: string) => void;
  updateVietnamese: (id: string, vietnameseText: string) => void;
}

export const useVocabularyStore = create<VocabularyStore>()(
  persist(
    (set) => ({
      words: [],

      addWord: (word) =>
        set((s) => ({
          words: [
            {
              ...word,
              id:      crypto.randomUUID(),
              savedAt: Date.now(),
            },
            ...s.words,
          ],
        })),

      removeWord: (id) =>
        set((s) => ({ words: s.words.filter((w) => w.id !== id) })),

      updateVietnamese: (id, vietnameseText) =>
        set((s) => ({
          words: s.words.map((w) => (w.id === id ? { ...w, vietnameseText } : w)),
        })),
    }),
    { name: 'english-app-vocabulary-v1' }
  )
);
