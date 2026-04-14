import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Generate a random id (browser-safe, no crypto dependency). */
export function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Score colour: green ≥ 80, yellow ≥ 50, red < 50. */
export function scoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-accent-dark';
  return 'text-danger';
}

/** Score background colour. */
export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-success/10 border-success/30';
  if (score >= 50) return 'bg-accent/10 border-accent/30';
  return 'bg-danger/10 border-danger/30';
}

/** Difficulty badge colour. */
export function difficultyColor(level?: string): string {
  switch (level) {
    case 'beginner':
      return 'bg-primary/10 text-primary-dark';
    case 'intermediate':
      return 'bg-secondary/10 text-secondary-dark';
    case 'advanced':
      return 'bg-danger/10 text-danger-dark';
    default:
      return 'bg-brand-input text-brand-muted';
  }
}

/** Map a character name to one of several avatar colors (deterministic). */
const AVATAR_COLORS = [
  'bg-primary text-white',
  'bg-secondary text-white',
  'bg-accent text-brand-text',
  'bg-danger text-white',
  '#7C3AED',
];
export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
