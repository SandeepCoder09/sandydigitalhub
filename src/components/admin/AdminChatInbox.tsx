'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, AlertTriangle, RefreshCw, ArrowLeft, LogOut } from 'lucide-react';

export function AdminChatInbox() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [mobileView, setMobileView] = useState<'sessions' | 'chat'>('sessions');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedSessionId) {
      fetchSessionMessages(selectedSessionId);
      interval = setInterval(() => fetchSessionMessages(selectedSessionId), 1500);
    }
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setAlertCount(data.alertCount || 0);
        if (!selectedSessionId && data.sessions?.length > 0) {
          setSelectedSessionId(data.sessions[0]._id);
        }
      }
    } catch (e) {
      console.error('Error fetching admin chat sessions:', e);
    }
  };

  const fetchSessionMessages = async (sid: string) => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Error fetching session messages:', e);
    }
  };

  const selectSession = (sid: string) => {
    setSelectedSessionId(sid);
    setMobileView('chat');
  };

  const handleSendReply = async (cannedMsg?: string) => {
    const text = cannedMsg || replyText;
    if (!selectedSessionId || !text.trim() || loading) return;

    const tempMsg = {
      _id: 'temp_' + Date.now(),
      senderName: 'Admin Support Agent 👨‍💼',
      senderRole: 'ADMIN',
      message: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setReplyText('');
    setLoading(true);
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: selectedSessionId, message: text.trim() }),
      });
      if (res.ok) {
        await fetchSessionMessages(selectedSessionId);
        await fetchSessions();
        setTimeout(scrollToBottom, 50);
      }
    } catch (e) {
      console.error('Error sending admin reply:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!selectedSessionId || loading) return;
    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'QUIT_SESSION',
          sessionId: selectedSessionId,
          senderName: 'Admin',
        }),
      });
    } catch (e) {
      console.error('Failed to end session:', e);
    } finally {
      setSelectedSessionId('');
      setMessages([]);
      setMobileView('sessions');
      await fetchSessions();
      setLoading(false);
    }
  };

  const cannedReplies = [
    'Hi! How can I assist you?',
    'Please share your Order ID (SDH-...).',
    'Your e-District application is being processed.',
    'Your request is completed!',
  ];

  const activeSessionData = sessions.find((s) => s._id === selectedSessionId);

  /* ─── Sessions List Panel ─── */
  const SessionsPanel = () => (
    <div className="flex flex-col h-full bg-[#161616]">
      <div className="p-3.5 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
        <div className="flex items-center gap-2 font-bold text-sm">
          <MessageSquare size={16} className="text-[#FF7A00]" />
          <span>Conversations</span>
          {alertCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">
              {alertCount}
            </span>
          )}
        </div>
        <button onClick={fetchSessions} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-xs text-white/40">No live chat sessions yet.</div>
        ) : (
          sessions.map((s) => {
            const isSelected = s._id === selectedSessionId;
            const hasAlert = s.needsAdmin && !s.adminRead;
            return (
              <button
                key={s._id}
                onClick={() => selectSession(s._id)}
                className={`w-full p-3.5 text-left transition-all flex items-start gap-3 ${
                  isSelected ? 'bg-[#FF7A00]/15 border-l-4 border-[#FF7A00]' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs uppercase text-white shrink-0">
                  {s.lastSender ? s.lastSender.slice(0, 2) : 'CU'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-xs text-white truncate">{s.lastSender || 'Customer'}</span>
                    {hasAlert && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1 animate-pulse">
                        <AlertTriangle size={10} />
                        Agent Needed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/60 truncate">{s.lastMessage}</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  /* ─── Chat Panel ─── */
  const ChatPanel = () => (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      {selectedSessionId ? (
        <>
          {/* Header */}
          <div className="p-3 border-b border-white/10 bg-[#161616] flex items-center gap-3 shrink-0">
            {/* Back button on mobile */}
            <button
              onClick={() => setMobileView('sessions')}
              className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="truncate">Chatting with: {activeSessionData?.lastSender || 'Customer'}</span>
                {activeSessionData?.needsAdmin && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                    🚨 Human Requested
                  </span>
                )}
              </div>
              <div className="text-[9px] text-white/40 font-mono mt-0.5 truncate">Session: {selectedSessionId}</div>
            </div>
            <button
              onClick={handleEndSession}
              disabled={loading}
              title="End this chat session"
              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 disabled:opacity-40"
            >
              <LogOut size={12} />
              <span>End Session</span>
            </button>
          </div>

          {/* Message Stream */}
          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => {
              const isAdmin = m.senderRole === 'ADMIN';
              const isCustomer = m.senderRole === 'CUSTOMER';
              return (
                <div key={m._id || idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                  <div className="text-[9px] text-white/40 mb-0.5 px-1">
                    {m.senderName} ({m.senderRole})
                  </div>
                  <div
                    className={`max-w-[85%] p-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isAdmin
                        ? 'bg-purple-600 text-white rounded-br-none shadow-md font-medium'
                        : isCustomer
                        ? 'bg-[#FF7A00]/90 text-white rounded-bl-none font-medium'
                        : 'bg-white/10 text-white/80 rounded-bl-none'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canned Responses */}
          <div className="px-2 py-1.5 bg-[#141414] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {cannedReplies.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendReply(chip)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 border border-white/10 text-[10px] font-semibold text-white/70 whitespace-nowrap transition-colors"
              >
                ⚡ {chip}
              </button>
            ))}
          </div>

          {/* Reply Input */}
          <div className="p-2.5 bg-[#161616] border-t border-white/10 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Type reply..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-purple-500 transition-colors"
            />
            <button
              onClick={() => handleSendReply()}
              disabled={!replyText.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <Send size={14} />
              <span>Reply</span>
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-white/40 text-xs">
          <MessageSquare size={32} className="mb-2 text-white/20" />
          <span>Select a conversation to start chatting.</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-white" style={{ height: 'calc(100vh - 200px)', minHeight: '350px', maxHeight: '750px' }}>

      {/* Desktop: side-by-side layout */}
      <div className="hidden md:flex h-full">
        <div className="w-80 border-r border-white/10 shrink-0">
          <SessionsPanel />
        </div>
        <div className="flex-1 min-w-0">
          <ChatPanel />
        </div>
      </div>

      {/* Mobile: toggle between sessions list and chat */}
      <div className="flex md:hidden h-full">
        {mobileView === 'sessions' ? (
          <div className="w-full">
            <SessionsPanel />
          </div>
        ) : (
          <div className="w-full">
            <ChatPanel />
          </div>
        )}
      </div>

    </div>
  );
}
