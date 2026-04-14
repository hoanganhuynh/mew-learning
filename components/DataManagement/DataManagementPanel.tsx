'use client';

import { Upload, Sparkles, ClipboardPaste } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FileUpload from './FileUpload';
import AIGeneration from './AIGeneration';
import JsonPasteImport from './JsonPasteImport';
import { useAppStore } from '@/store/appStore';

export default function DataManagementPanel() {
  const { dataPanelOpen, setDataPanelOpen } = useAppStore();
  const close = () => setDataPanelOpen(false);

  return (
    <Dialog open={dataPanelOpen} onOpenChange={setDataPanelOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Dialogue Content</DialogTitle>
          <DialogDescription>
            Import a file, paste JSON directly, or let AI create a new dialogue for you.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import" className="mt-1">
          <TabsList>
            <TabsTrigger value="import" className="gap-1.5">
              <Upload size={13} /> Import File
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-1.5">
              <ClipboardPaste size={13} /> Paste JSON
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-1.5">
              <Sparkles size={13} /> AI Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <FileUpload onClose={close} />
          </TabsContent>

          <TabsContent value="paste">
            <JsonPasteImport onClose={close} />
          </TabsContent>

          <TabsContent value="generate">
            <AIGeneration onClose={close} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
