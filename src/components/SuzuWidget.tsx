'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, RefreshCw, ShieldAlert, BarChart3, ShoppingBag, Loader2, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Message {
  id: string;
  sender: 'suzu' | 'admin';
  text: string;
  quickActions?: string[];
  timestamp: string;
}

export function SuzuWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'suzu',
      text: '🤖 **Hello Admin! I am SUZU, your AI Admin Copilot.**\n\nI can analyze store sales, check security firewall alerts, monitor traffic, and help you manage Sandy Digital Hub in real time. How can I help you today?',
      quickActions: [
        'Show today sales & order summary',
        'Check security firewall status',
        'What are top visited pages?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customQuery?: string) => {
    const queryText = (customQuery || input).trim();
    if (!queryText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/suzu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (res.ok) {
        const data = await res.json();
        const suzuMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'suzu',
          text: data.reply || 'SUZU AI processed your request.',
          quickActions: data.quickActions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, suzuMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'suzu',
            text: '⚠️ Unable to connect to SUZU AI server. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      }
    } catch (error) {
      console.error('SUZU Agent error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only render SUZU widget inside Admin routes
  if (!pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[99999]">
      {/* Floating SUZU Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-gray-900 hover:bg-black text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-blue-500/50 cursor-pointer"
          title="SUZU AI Admin Copilot"
        >
          <span className="absolute -inset-1 rounded-full bg-[#2563EB] opacity-40 group-hover:opacity-75 animate-ping"></span>
          <div className="relative z-10 flex items-center gap-2">
            <Bot size={24} className="text-[#2563EB]" />
            <span className="text-xs font-black text-white hidden sm:inline-block pr-1">SUZU AI</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full z-20"></span>
        </button>
      )}

      {/* SUZU AI Assistant Chat Drawer */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-[360px] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Drawer Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB] relative">
                <Bot size={22} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-gray-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white">SUZU AI</h3>
                  <span className="px-2 py-0.5 rounded-md bg-[#2563EB]/20 text-[#2563EB] text-[9px] font-black uppercase border border-[#2563EB]/30">
                    Copilot
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium">Virtual Admin Assistant • Online</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(messages.slice(0, 1))}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Command Bar */}
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('Show today sales & order summary')}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:border-blue-300 hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <ShoppingBag size={12} className="text-[#2563EB]" /> Sales
            </button>
            <button
              onClick={() => handleSend('Check security firewall status')}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:border-blue-300 hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <ShieldAlert size={12} className="text-red-500" /> Firewall
            </button>
            <button
              onClick={() => handleSend('What are top visited pages?')}
              className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:border-blue-300 hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <BarChart3 size={12} className="text-emerald-500" /> Analytics
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    msg.sender === 'admin'
                      ? 'bg-[#2563EB] text-white font-semibold rounded-br-none shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm font-medium'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Quick Action Suggestion Chips */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="pt-2 flex flex-col gap-1.5 border-t border-gray-100 mt-2">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase">Suggested Follow-ups:</span>
                      {msg.quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(action)}
                          className="text-left text-[11px] font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 p-2 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                        >
                          ⚡ {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 px-1 mt-1 font-semibold">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold bg-white p-3 rounded-2xl border border-gray-200 w-fit">
                <Loader2 size={15} className="animate-spin text-[#2563EB]" />
                <span>SUZU is analyzing store data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SUZU AI about sales, users, firewall..."
                className="flex-1 bg-gray-50 text-gray-900 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#2563EB] outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white transition-all disabled:opacity-50 cursor-pointer shrink-0 shadow-sm"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
