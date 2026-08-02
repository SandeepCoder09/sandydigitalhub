'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Mic, MicOff, Send, X, Minimize2, Maximize2, Volume2, VolumeX,
  Loader2, Sparkles, MessageSquare, Wand2, ChevronDown, Trash2,
  RotateCcw, Bot
} from 'lucide-react';

const SUZU_BASE_URL = 'https://suzuai.vercel.app';

// System prompt for customer-facing SUZU on Sandy Digital Hub
const CUSTOMER_SYSTEM_PROMPT = `You are SUZU, the friendly AI assistant for Sandy Digital Hub — a premium digital services & Jan Seva center in Fatehpur, UP, India.

SERVICES YOU KNOW ABOUT:
- Government Document Services: Aadhaar, PAN Card, Passport, Voter ID, Income Certificate, Domicile (Niwas), Caste (Jati), GST Registration, EPFO, Ration Card, Birth/Death Certificate
- Digital Services: Website Development, Mobile App Development, UI/UX Design, Digital Marketing, Logo Design
- Cyber Cafe: Printing, Scanning, Typing, Photo Services, Online Forms
- Contact: +91 8756454282 | Fatehpur, UP
- Website: sandydigitalhub.com

PERSONALITY:
- Warm, friendly, helpful, and professional
- Speak in simple, clear language — mix Hindi and English naturally (Hinglish) when helpful
- Be concise: 1-3 short sentences for most replies
- Guide customers to services, answer questions about documents needed, pricing, and timelines
- For pricing, say "Please visit the shop or call +91 8756454282 for exact pricing"

RULES:
1. Never make up prices or fake government policies
2. Always encourage customers to call or visit for complex queries
3. Keep responses short and natural, like a helpful shop assistant`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ViewMode = 'chat' | 'voice';
type VoiceState = 'idle' | 'recording' | 'processing' | 'speaking';

const QUICK_CHIPS = [
  '📋 Document list for Income Certificate',
  '🌐 Website development cost?',
  '📄 PAN Card services available?',
  '⏱️ How long for Passport?',
];

export function SuzuBusinessWidget() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'नमस्ते! 👋 I\'m SUZU, your Sandy Digital Hub assistant. I can help you with government document services, website development, or any other queries. How can I help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Voice state
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'admin';

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && viewMode === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, viewMode]);

  // Don't show on admin pages or if admin user
  if (pathname?.startsWith('/admin') || isAdmin) return null;

  // ── Chat API Call ──────────────────────────────────────────────────────────
  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsChatLoading(true);

    try {
      const historyForApi = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Call SUZU brain API with customer system prompt injected as first message
      const res = await fetch(`${SUZU_BASE_URL}/api/brain/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CUSTOMER_SYSTEM_PROMPT },
            ...historyForApi,
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.response || 'I\'m sorry, I could not process that. Please try again.';
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: reply,
            timestamp: new Date(),
          }
        ]);
      } else {
        throw new Error('API call failed');
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please call us at +91 8756454282 for immediate assistance!',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ── TTS: Synthesize and Play Audio ─────────────────────────────────────────
  const speakText = async (text: string) => {
    if (isMuted) return;
    try {
      const res = await fetch(`${SUZU_BASE_URL}/api/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data.audio) return;

      const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      const blob = new Blob([audioBytes], { type: 'audio/mp3' });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setVoiceState('idle');
    } catch (err) {
      console.error('TTS error:', err);
    }
  };

  // ── Voice Recording ────────────────────────────────────────────────────────
  const startRecording = async () => {
    setVoiceError('');
    setTranscript('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setVoiceState('processing');
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAndRespond(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setVoiceState('recording');
    } catch (err: any) {
      setVoiceError('Microphone access denied. Please allow microphone permission.');
      setVoiceState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAndRespond = async (audioBlob: Blob) => {
    try {
      // Step 1: Transcribe
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      const transcribeRes = await fetch(`${SUZU_BASE_URL}/api/voice/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error('Transcription failed');
      const { transcript: userText } = await transcribeRes.json();

      if (!userText?.trim()) {
        setVoiceState('idle');
        setVoiceError('Could not hear that. Please try again.');
        return;
      }

      setTranscript(userText);

      // Add user message to chat
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMsg]);

      // Step 2: Get AI response
      const historyForApi = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const chatRes = await fetch(`${SUZU_BASE_URL}/api/brain/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: CUSTOMER_SYSTEM_PROMPT },
            ...historyForApi,
          ],
        }),
      });

      if (!chatRes.ok) throw new Error('Chat failed');
      const chatData = await chatRes.json();
      const reply = chatData.response || 'Sorry, I could not understand. Please try again.';

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Step 3: Speak the reply
      setVoiceState('speaking');
      await speakText(reply);

    } catch (err) {
      console.error('Voice pipeline error:', err);
      setVoiceError('Something went wrong. Please try the chat mode.');
      setVoiceState('idle');
    }
  };

  const handleVoiceButton = () => {
    if (voiceState === 'recording') {
      stopRecording();
    } else if (voiceState === 'speaking') {
      audioRef.current?.pause();
      setVoiceState('idle');
    } else if (voiceState === 'idle') {
      startRecording();
    }
  };

  const voiceStatusText = {
    idle: 'Tap to speak',
    recording: 'Listening... tap to stop',
    processing: 'Thinking...',
    speaking: 'Speaking... tap to stop',
  }[voiceState];

  const voiceStatusColor = {
    idle: '#94A3B8',
    recording: '#22C55E',
    processing: '#FF7A00',
    speaking: '#8B5CF6',
  }[voiceState];

  return (
    <div className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-[99990]">
      {/* Floating SUZU Business Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer text-white"
          style={{
            background: 'linear-gradient(135deg, #0F1628, #1A2540)',
            border: '1px solid rgba(255,122,0,0.4)',
            boxShadow: '0 8px 32px rgba(255,122,0,0.25), 0 0 0 0 rgba(255,122,0,0.4)',
          }}
        >
          <span className="absolute -inset-1 rounded-full bg-orange-500/20 group-hover:bg-orange-500/30 animate-ping opacity-60"></span>
          <div className="relative z-10 w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
            <Sparkles size={16} className="text-orange-400" />
          </div>
          <div className="relative z-10">
            <div className="text-xs font-black text-white leading-none">SUZU AI</div>
            <div className="text-[9px] font-semibold text-orange-400/80 leading-none mt-0.5">Talk or Chat</div>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full z-20"></span>
        </button>
      )}

      {/* Main Widget Window */}
      {isOpen && !isMinimized && (
        <div
          className="flex flex-col overflow-hidden rounded-3xl shadow-2xl"
          style={{
            width: '380px',
            height: '600px',
            background: 'linear-gradient(145deg, #0B0F1A, #0F1628)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,122,0,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5500)', boxShadow: '0 4px 16px rgba(255,122,0,0.35)' }}
                >
                  <Sparkles size={18} className="text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 rounded-full" style={{ borderColor: '#0B0F1A' }}></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white">SUZU AI</span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-orange-400 border"
                    style={{ background: 'rgba(255,122,0,0.1)', borderColor: 'rgba(255,122,0,0.25)' }}
                  >
                    SDH
                  </span>
                </div>
                <p className="text-[10px] font-medium" style={{ color: '#64748B' }}>Sandy Digital Hub Assistant · Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: '#64748B' }}
              >
                <Minimize2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-1.5 px-4 py-2.5 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {(['chat', 'voice'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  background: viewMode === mode ? 'rgba(255,122,0,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${viewMode === mode ? 'rgba(255,122,0,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  color: viewMode === mode ? '#FF7A00' : '#64748B',
                }}
              >
                {mode === 'chat' ? <MessageSquare size={12} /> : <Mic size={12} />}
                {mode === 'chat' ? 'Chat' : 'Voice'}
              </button>
            ))}
          </div>

          {/* ── CHAT MODE ── */}
          {viewMode === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-orange-400">
                        <Sparkles size={8} /> SUZU AI
                      </div>
                    )}
                    <div
                      className="max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-medium"
                      style={{
                        background: msg.role === 'user'
                          ? 'rgba(255,122,0,0.15)'
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(255,122,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
                        color: '#E2E8F0',
                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      }}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] px-1" style={{ color: '#475569' }}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs font-medium" style={{ color: '#64748B' }}>
                    <Loader2 size={13} className="animate-spin text-orange-400" />
                    SUZU is thinking...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chips */}
              {messages.length <= 1 && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#94A3B8',
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask SUZU anything..."
                    className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-medium outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      color: '#E2E8F0',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isChatLoading}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-40 shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF7A00, #FF5500)' }}
                  >
                    <Send size={15} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* ── VOICE MODE ── */}
          {viewMode === 'voice' && (
            <div className="flex-1 flex flex-col items-center justify-between px-5 py-6 min-h-0">
              {/* Top: Last exchange display */}
              <div className="w-full space-y-2 overflow-y-auto max-h-[160px] min-h-0">
                {messages.slice(-4).map((msg) => (
                  <div key={msg.id}
                    className={`px-4 py-2 rounded-xl text-xs font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    style={{
                      background: msg.role === 'user' ? 'rgba(255,122,0,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(255,122,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      color: '#CBD5E1',
                    }}
                  >
                    {msg.content.length > 80 ? msg.content.slice(0, 80) + '…' : msg.content}
                  </div>
                ))}
              </div>

              {/* Center: Orb */}
              <div className="flex flex-col items-center gap-4">
                {/* Animated orb */}
                <div className="relative flex items-center justify-center">
                  {voiceState !== 'idle' && (
                    <>
                      <div className="absolute w-52 h-52 rounded-full animate-ping opacity-10"
                        style={{ background: voiceStatusColor }} />
                      <div className="absolute w-44 h-44 rounded-full animate-pulse opacity-20"
                        style={{ background: voiceStatusColor }} />
                    </>
                  )}
                  <div className="relative w-36 h-36 rounded-full flex items-center justify-center"
                    style={{
                      background: voiceState === 'idle'
                        ? 'linear-gradient(135deg, #1E293B, #0F172A)'
                        : `radial-gradient(circle, ${voiceStatusColor}30 0%, ${voiceStatusColor}10 100%)`,
                      border: `2px solid ${voiceState === 'idle' ? 'rgba(255,255,255,0.08)' : voiceStatusColor + '60'}`,
                      boxShadow: voiceState !== 'idle' ? `0 0 40px ${voiceStatusColor}40` : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <Sparkles size={40} style={{ color: voiceState === 'idle' ? '#FF7A00' : voiceStatusColor }} />
                  </div>
                </div>

                {/* Status */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold" style={{ color: voiceStatusColor }}>{voiceStatusText}</p>
                  {transcript && (
                    <p className="text-xs italic" style={{ color: '#64748B' }}>&ldquo;{transcript}&rdquo;</p>
                  )}
                  {voiceError && (
                    <p className="text-xs text-red-400 font-medium">{voiceError}</p>
                  )}
                </div>

                {/* Mic Button */}
                <button
                  onClick={handleVoiceButton}
                  disabled={voiceState === 'processing'}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    background: voiceState === 'recording'
                      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                      : voiceState === 'speaking'
                      ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                      : voiceState === 'processing'
                      ? 'linear-gradient(135deg, #FF7A00, #FF5500)'
                      : 'linear-gradient(135deg, #FF7A00, #FF5500)',
                    boxShadow: voiceState === 'recording'
                      ? '0 0 40px rgba(34,197,94,0.5)'
                      : '0 0 40px rgba(255,122,0,0.4)',
                  }}
                >
                  {voiceState === 'processing' ? (
                    <Loader2 size={28} className="animate-spin" />
                  ) : voiceState === 'recording' ? (
                    <MicOff size={28} />
                  ) : (
                    <Mic size={28} />
                  )}
                </button>
              </div>

              {/* Mute toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer"
                  style={{
                    background: isMuted ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isMuted ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    color: isMuted ? '#F87171' : '#64748B',
                  }}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {isMuted ? 'Voice Off' : 'Voice On'}
                </button>
                <button
                  onClick={() => setMessages(messages.slice(0, 1))}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: '#64748B',
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimized Bar */}
      {isOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full shadow-xl cursor-pointer transition-all hover:scale-105 text-white"
          style={{
            background: 'linear-gradient(135deg, #0B0F1A, #1A2540)',
            border: '1px solid rgba(255,122,0,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <Sparkles size={16} className="text-orange-400" />
          <span className="text-xs font-black text-white">SUZU AI</span>
          <ChevronDown size={13} className="text-slate-400 rotate-180" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-gray-900 rounded-full"></span>
        </button>
      )}
    </div>
  );
}
