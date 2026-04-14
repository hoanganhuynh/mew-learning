'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Cycles through: system → light → dark → system …
 * Shows a subtle animated icon transition.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const cycle = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const icon =
    theme === 'system' ? <Monitor size={17} /> :
    theme === 'light'  ? <Sun size={17} />     :
                         <Moon size={17} />;

  const label =
    theme === 'system' ? 'System theme' :
    theme === 'light'  ? 'Light mode'   : 'Dark mode';

  return (
    <button
      onClick={cycle}
      title={label}
      aria-label={label}
      className={cn(
        'relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
        'text-brand-muted hover:text-brand-text hover:bg-brand-input',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1   }}
          exit={{    opacity: 0, rotate:  30, scale: 0.8 }}
          transition={{ duration: 0.18 }}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
