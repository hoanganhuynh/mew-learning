'use client';

import { Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store/appStore';

export default function PlayerToolbar() {
  const { settings, setSetting } = useAppStore();

  return (
    <div className="flex items-center justify-end px-4 py-2 border-b border-brand-border bg-brand-surface">
      <div className="flex items-center gap-1.5">
        <Languages size={12} className="text-brand-muted" />
        <span className="text-[11px] font-bold text-brand-muted">Tiếng Việt</span>
        <Switch
          checked={settings.showTranslation}
          onCheckedChange={(v) => setSetting('showTranslation', v)}
          className="scale-75 origin-right"
        />
      </div>
    </div>
  );
}
