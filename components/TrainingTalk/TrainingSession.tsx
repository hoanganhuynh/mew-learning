'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import CharacterAvatar from './CharacterAvatar';
import TrainingBubble from './TrainingBubble';
import UserTurnControl from './UserTurnControl';
import { useTrainingStore } from '@/store/trainingStore';
import { speak, stop as stopTTS } from '@/lib/tts';
import { useAppStore } from '@/store/appStore';
import type { CharacterOption, TrainingPhase, TrainingMessage } from '@/types/training';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  sessionId: string;
  topic:     string;
  character: CharacterOption;
  onEnd:     () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrainingSession({ sessionId, topic, character, onEnd }: Props) {
  const { settings } = useAppStore();
  const { addMessage, updateLastUserMsg, endSession, getSession } = useTrainingStore();

  const [phase,             setPhase]             = useState<TrainingPhase>('character-speaking');
  const [suggestedResponse, setSuggestedResponse] = useState<string>('');
  const [isLoadingStart,    setIsLoadingStart]    = useState(true);
  const [isProcessing,      setIsProcessing]      = useState(false);
  const [turnCount,         setTurnCount]         = useState(0);

  const bottomRef        = useRef<HTMLDivElement>(null);
  const historyRef       = useRef<TrainingMessage[]>([]);
  const isMountedRef     = useRef(true);

  // Keep historyRef in sync for API calls without triggering re-renders
  const session = getSession(sessionId);
  const messages = session?.messages ?? [];
  historyRef.current = messages;

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopTTS();
    };
  }, []);

  // ── Speak character message and transition to user-turn ──────────────────────
  const speakAndTransition = useCallback((text: string, onDone?: () => void) => {
    if (!isMountedRef.current) return;
    setPhase('character-speaking');
    speak(text, {
      gender: 'female',
      rate:   settings.speechRate,
      onEnd: () => {
        if (!isMountedRef.current) return;
        setPhase('user-turn');
        onDone?.();
      },
      onError: () => {
        if (!isMountedRef.current) return;
        // Even on TTS error, allow user to respond
        setPhase('user-turn');
        onDone?.();
      },
    });
  }, [settings.speechRate]);

  // ── Bootstrap: fetch opening message ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const res = await fetch('/api/training/start', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, character: character.name, persona: character.persona }),
        });
        const data = await res.json();
        if (cancelled || !isMountedRef.current) return;

        const msgId = `msg-${Date.now()}`;
        const charMsg: TrainingMessage = {
          id:        msgId,
          role:      'character',
          text:      data.openingMessage,
          timestamp: Date.now(),
        };
        addMessage(sessionId, charMsg);
        setSuggestedResponse(data.suggestedUserOpener ?? '');
        setIsLoadingStart(false);

        speakAndTransition(data.openingMessage);
      } catch {
        if (cancelled || !isMountedRef.current) return;
        const fallback = `Hello! I'm ${character.name}. Let's talk about "${topic}". What do you think about this topic?`;
        const charMsg: TrainingMessage = {
          id:        `msg-${Date.now()}`,
          role:      'character',
          text:      fallback,
          timestamp: Date.now(),
        };
        addMessage(sessionId, charMsg);
        setIsLoadingStart(false);
        speakAndTransition(fallback);
      }
    };

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle user submits speech ────────────────────────────────────────────────
  const handleUserSubmit = useCallback(async (transcript: string) => {
    if (!isMountedRef.current) return;

    stopTTS();
    setPhase('processing');
    setIsProcessing(true);
    setTurnCount((c) => c + 1);

    // Optimistically add user message
    const userMsgId = `msg-${Date.now()}`;
    const userMsg: TrainingMessage = {
      id:        userMsgId,
      role:      'user',
      text:      transcript,
      timestamp: Date.now(),
    };
    addMessage(sessionId, userMsg);

    try {
      // Build conversation history for API (exclude the message we just added)
      const history = historyRef.current
        .filter((m) => m.id !== userMsgId)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/training/turn', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          character:   character.name,
          persona:     character.persona,
          userMessage: transcript,
          history,
        }),
      });
      const data = await res.json();
      if (!isMountedRef.current) return;

      // Patch user message with evaluation
      updateLastUserMsg(sessionId, { evaluation: data.evaluation });

      // Add character response
      const charMsg: TrainingMessage = {
        id:        `msg-${Date.now()}`,
        role:      'character',
        text:      data.characterResponse,
        timestamp: Date.now(),
      };
      addMessage(sessionId, charMsg);
      setSuggestedResponse(data.suggestedUserResponse ?? '');
      setIsProcessing(false);

      // Speak character response
      speakAndTransition(data.characterResponse);
    } catch {
      if (!isMountedRef.current) return;
      setIsProcessing(false);
      const fallback = `That's interesting! Can you tell me more about that?`;
      const charMsg: TrainingMessage = {
        id:        `msg-${Date.now()}`,
        role:      'character',
        text:      fallback,
        timestamp: Date.now(),
      };
      addMessage(sessionId, charMsg);
      speakAndTransition(fallback);
    }
  }, [sessionId, topic, character, addMessage, updateLastUserMsg, speakAndTransition]);

  // ── Handle timeout ────────────────────────────────────────────────────────────
  const handleTimeout = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (phase !== 'user-turn') return;

    stopTTS();
    setPhase('timed-out');

    // Add a timed-out placeholder user message
    const timedOutMsg: TrainingMessage = {
      id:                `msg-${Date.now()}`,
      role:              'user',
      text:              '(no response — timed out)',
      timedOut:          true,
      suggestedResponse: suggestedResponse || undefined,
      timestamp:         Date.now(),
    };
    addMessage(sessionId, timedOutMsg);

    // Short pause, then character responds with encouragement
    await new Promise((r) => setTimeout(r, 1200));
    if (!isMountedRef.current) return;

    try {
      const history = historyRef.current
        .slice(-6)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/training/turn', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          character:   character.name,
          persona:     character.persona,
          userMessage: '',
          timedOut:    true,
          history,
        }),
      });
      const data = await res.json();
      if (!isMountedRef.current) return;

      const charMsg: TrainingMessage = {
        id:        `msg-${Date.now()}`,
        role:      'character',
        text:      data.characterResponse,
        timestamp: Date.now(),
      };
      addMessage(sessionId, charMsg);
      setSuggestedResponse(data.suggestedUserResponse ?? '');
      speakAndTransition(data.characterResponse);
    } catch {
      if (!isMountedRef.current) return;
      const fallback = `No worries! Take your time. ${suggestedResponse ? `You could try saying: "${suggestedResponse}"` : "Let's try a different question."}`;
      const charMsg: TrainingMessage = {
        id:        `msg-${Date.now()}`,
        role:      'character',
        text:      fallback,
        timestamp: Date.now(),
      };
      addMessage(sessionId, charMsg);
      speakAndTransition(fallback);
    }
  }, [phase, sessionId, topic, character, suggestedResponse, addMessage, speakAndTransition]);

  // ── End session ───────────────────────────────────────────────────────────────
  const handleEnd = useCallback(() => {
    stopTTS();
    endSession(sessionId);
    onEnd();
  }, [sessionId, endSession, onEnd]);

  // ── Avatar state ──────────────────────────────────────────────────────────────
  const avatarState: 'idle' | 'speaking' | 'listening' | 'thinking' =
    phase === 'character-speaking' ? 'speaking'  :
    phase === 'user-turn'          ? 'listening' :
    phase === 'processing'         ? 'thinking'  :
    'idle';

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-surface flex-shrink-0">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={character} state={avatarState} size="sm" />
          <div>
            <p className="font-extrabold text-sm text-brand-strong">{character.label}</p>
            <p className="text-[11px] text-brand-muted truncate max-w-[180px]">{topic}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {turnCount > 0 && (
            <span className="text-[11px] font-bold text-brand-muted bg-brand-input rounded-full px-2.5 py-0.5">
              {turnCount} turn{turnCount !== 1 ? 's' : ''}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs text-danger border-danger/30 hover:bg-danger/5 hover:border-danger"
            onClick={handleEnd}
          >
            <LogOut size={13} />
            End
          </Button>
        </div>
      </div>

      {/* ── Loading overlay ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoadingStart && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-brand-bg/80 backdrop-blur-sm"
          >
            <CharacterAvatar character={character} state="thinking" size="lg" />
            <p className="mt-8 font-extrabold text-brand-strong text-lg">Preparing…</p>
            <p className="text-brand-muted text-sm mt-1">{character.label} is getting ready</p>
            <Loader2 size={20} className="mt-4 animate-spin text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Conversation scroll area ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <TrainingBubble
            key={msg.id}
            message={msg}
            character={character}
            index={i}
          />
        ))}

        {/* Processing indicator */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 w-full"
            >
              <div className={cn(
                'w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-base flex-shrink-0 shadow-sm mt-1',
                character.color
              )}>
                {character.emoji}
              </div>
              <div className="bg-brand-surface border border-brand-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-bubble">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-brand-muted"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── User turn controls ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t border-brand-border bg-brand-surface px-4 py-4">
        <UserTurnControl
          key={messages.length} // remount = fresh countdown
          onSubmit={handleUserSubmit}
          onTimeout={handleTimeout}
          suggestedResponse={suggestedResponse}
          disabled={phase !== 'user-turn'}
        />
      </div>
    </div>
  );
}
