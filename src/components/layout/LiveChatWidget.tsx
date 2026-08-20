'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, UserCheck, LogOut } from 'lucide-react';

export function LiveChatWidget() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [adminRequested, setAdminRequested] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sid = localStorage.getItem('sdh_chat_session_id');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 9) + Date.now();
      localStorage.setItem('sdh_chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && sessionId) {
      fetchMessages();
      interval = setInterval(() => {
        if (!document.hidden) {
          fetchMessages();
        }
      }, 4000); // 4s smart background polling
    }
    return () => clearInterval(interval);
  }, [isOpen, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleRequestRealAgent = async () => {
    if (loading) return;
    setLoading(true);
    setAdminRequested(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REQUEST_ADMIN',
          sessionId,
          senderName: session?.user?.name || 'Client',
        }),
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to request real agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuitSession = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'QUIT_SESSION',
          sessionId,
          senderName: session?.user?.name || 'Client',
        }),
      });
    } catch (e) {
      console.error('Failed to quit session:', e);
    } finally {
      // Clear session and close chat
      localStorage.removeItem('sdh_chat_session_id');
      const newSid = 'sid_' + Math.random().toString(36).substring(2, 9) + Date.now();
      localStorage.setItem('sdh_chat_session_id', newSid);
      setSessionId(newSid);
      setMessages([]);
      setAdminRequested(false);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || loading) return;

    if (text.includes('Real Agent') || text.includes('Talk to Real')) {
      handleRequestRealAgent();
      setInputMsg('');
      return;
    }

    const senderName = session?.user?.name || 'Client';
    setInputMsg('');
    setLoading(true);

    // Optimistic user message
    const tempUserMsg = {
      _id: 'temp_' + Date.now(),
      senderName,
      senderRole: 'CUSTOMER',
      message: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          senderName,
        }),
      });

      if (res.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    '🙋‍♂️ Talk to Real Agent',
    'Order Status Check 📦',
    'Aay / Jati / Niwas Cert 📜',
    'Website Development Quote 💻',
  ];

  // Suppress customer floating chat widget on Admin routes or if logged in as Admin
  if (pathname?.startsWith('/admin') || session?.user?.role === 'ADMIN') {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-[#7C3AED] hover:bg-[#6D28D9] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ring-4 ring-[#7C3AED]/20"
          aria-label="Open Live Chat Room"
        >
          <span className="absolute -inset-1 rounded-full bg-[#7C3AED] opacity-40 group-hover:opacity-70 animate-ping"></span>
          <MessageSquare size={22} className="relative z-10 fill-current" />
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full z-20"></span>
        </button>
      )}

      {/* Live Chat Room Box */}
      {isOpen && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl w-[92vw] sm:w-96 max-h-[600px] h-[82vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-3.5 bg-[#181818] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#7C3AED]">
                <Bot size={18} />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-[#181818]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-white">
                  <span>Sandy Digital Hub Support</span>
                  <Sparkles size={12} className="text-[#7C3AED]" />
                </div>
                <div className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span>Online & Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleRequestRealAgent}
                disabled={adminRequested || loading}
                title="Connect with human admin"
                className="px-2 py-1 rounded-lg bg-[#7C3AED]/20 hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white border border-[#7C3AED]/30 text-[10px] font-bold transition-all flex items-center gap-1"
              >
                <UserCheck size={12} />
                <span className="hidden sm:inline">{adminRequested ? 'Agent Alerted' : 'Real Agent'}</span>
              </button>
              <button
                onClick={handleQuitSession}
                disabled={loading || messages.length === 0}
                title="End chat session"
                className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-[10px] font-bold transition-all flex items-center gap-1 disabled:opacity-40"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Quit</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Stream Timeline */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#0c0c0c]/80">
            {messages.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-white/50">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#7C3AED]">
                  <Bot size={24} />
                </div>
                <p className="font-semibold text-white">Welcome to Sandy Digital Hub Support!</p>
                <p className="text-[11px] max-w-xs mx-auto text-white/60">
                  Ask any question or click <strong>"Talk to Real Agent"</strong> to chat directly with our admin team.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isUser = m.senderRole === 'CUSTOMER';
                const isAdmin = m.senderRole === 'ADMIN';

                return (
                  <div
                    key={m._id || idx}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[9px] text-white/40 mb-1 px-1 flex items-center gap-1">
                      {isAdmin && <span className="text-purple-400 font-bold">👨‍💼 Live Admin</span>}
                      <span>{m.senderName}</span>
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-[#7C3AED] text-white rounded-br-none shadow-md'
                          : isAdmin
                          ? 'bg-purple-950/80 text-purple-100 border border-purple-500/40 rounded-bl-none shadow-lg'
                          : 'bg-white/10 text-white border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
            {loading && (
              <div className="flex items-center gap-2 text-white/40 text-[11px] italic">
                <Loader2 size={12} className="animate-spin text-[#7C3AED]" />
                <span>Sandy Hub Support is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="p-2 bg-[#141414] border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-colors border ${
                  chip.includes('Real Agent')
                    ? 'bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/40 font-bold hover:bg-[#7C3AED] hover:text-white'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/70'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#181818] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#7C3AED] transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputMsg.trim() || loading}
              className="p-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold transition-all shadow-md shrink-0"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
