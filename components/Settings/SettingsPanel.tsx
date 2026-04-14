'use client';

import { Settings, Zap, Eye } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={14} className="text-primary" />
      </div>
      <h3 className="font-extrabold text-sm text-brand-strong uppercase tracking-wide">{children}</h3>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 px-4 bg-brand-bg rounded-xl">
      <div>
        <p className="font-semibold text-sm text-brand-text">{label}</p>
        <p className="text-xs text-brand-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPanel() {
  const { settingsPanelOpen, setSettingsPanelOpen, settings, setSetting } = useAppStore();

  return (
    <Dialog open={settingsPanelOpen} onOpenChange={setSettingsPanelOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings size={20} className="text-primary" /> Settings
          </DialogTitle>
          <DialogDescription>
            Speed, voice and translation controls are on the dialogue toolbar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <section>
            <SectionTitle icon={Eye}>Display</SectionTitle>
            <div className="space-y-3">
              <SettingRow
                label="Highlight Active Line"
                description="Dim non-active bubbles during playback."
              >
                <Switch
                  checked={settings.highlightActiveLines}
                  onCheckedChange={(v) => setSetting('highlightActiveLines', v)}
                />
              </SettingRow>
            </div>
          </section>

          <section>
            <SectionTitle icon={Zap}>Playback</SectionTitle>
            <div className="space-y-3">
              <SettingRow
                label="Auto-Play"
                description="Automatically speak each line when advancing."
              >
                <Switch
                  checked={settings.autoPlay}
                  onCheckedChange={(v) => setSetting('autoPlay', v)}
                />
              </SettingRow>
            </div>
          </section>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-[10px] text-brand-muted/70 font-medium">
            Made by 🖐️ &amp; Claude Code · 2026
          </p>
          <Button onClick={() => setSettingsPanelOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
