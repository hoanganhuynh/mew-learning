'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      position="bottom-right"
      offset="72px"          // sit above the mobile nav bar (h-14 = 56px + gap)
      toastOptions={{
        classNames: {
          toast:       'font-sans text-sm font-semibold rounded-xl border shadow-lg',
          description: 'text-xs font-normal opacity-80',
        },
      }}
    />
  );
}
