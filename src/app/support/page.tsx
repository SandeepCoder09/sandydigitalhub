'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LifeBuoy, Plus, MessageSquare, Send, CheckCircle2, Clock,
  AlertCircle, ShieldAlert, ArrowRight, User, RefreshCw, X,
  FileText, Paperclip, ChevronRight, Lock, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
  customerName: string;
  messageCount: number;
  lastActivityAt: string;
  createdAt: string;
}

interface MessageItem {
  _id: string;
  senderName: string;
  senderRole: string;
  content: string;
  isInternalNote: boolean;
  createdAt: string;
}

interface FullTicket {
  ticketNumber: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  customerName: string;
  relatedRequestNumber?: string;
  messages: MessageItem[];
}

export default function SupportCenterPage() {
  const { data: session, status: authStatus } = useSession();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<FullTicket | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // New Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('SERVICE_REQUEST');
  const [newPriority, setNewPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [newRequestNum, setNewRequestNum] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [creatingTicket, setCreatingTicket] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const isAdminOrStaff = ['ADMIN', 'SUPER_ADMIN', 'PARTNER_ADMIN', 'PARTNER_STAFF'].includes(
    (session?.user as any)?.role || ''
  );

  const fetchTickets = useCallback(async () => {
    if (!session?.user) return;
    try {
      setLoadingList(true);
      const res = await fetch('/api/support/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoadingList(false);
    }
  }, [session]);

  const loadTicketDetail = async (ticketNumber: string) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(`/api/support/tickets?ticketNumber=${ticketNumber}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
      }
    } catch (err) {
      console.error('Failed to load ticket detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchTickets();
    }
  }, [session, fetchTickets]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setCreatingTicket(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newSubject.trim(),
          category: newCategory,
          priority: newPriority,
          relatedRequestNumber: newRequestNum.trim() || undefined,
          message: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        setNewSubject('');
        setNewMessage('');
        setNewRequestNum('');
        fetchTickets();
        if (data.ticket?.ticketNumber) {
          loadTicketDetail(data.ticket.ticketNumber);
        }
      }
    } catch (err) {
      console.error('Create ticket error:', err);
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketNumber: selectedTicket.ticketNumber,
          message: replyText.trim(),
          isInternalNote: isAdminOrStaff && isInternalNote,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setIsInternalNote(false);
        loadTicketDetail(selectedTicket.ticketNumber);
        fetchTickets();
      }
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">Open</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">In Progress</span>;
      case 'WAITING_FOR_USER':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">Action Required</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Resolved</span>;
      case 'CLOSED':
      default:
        return <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold">Closed</span>;
    }
  };

  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50/60 pt-16 pb-20 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <LifeBuoy size={28} />
          </div>
          <h2 className="text-lg font-black text-gray-900">Support Center Authentication</h2>
          <p className="text-xs text-gray-500 font-medium">
            Please log in to your customer, partner, or admin account to access your support ticket thread.
          </p>
          <Link href="/login?callbackUrl=/support">
            <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs h-11 cursor-pointer">
              Log In to Access Support →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-8 sm:pt-12 pb-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider mb-2">
              <LifeBuoy size={12} /> Unified Support Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Support & Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Role-isolated support tickets with prompt assistance and transparent updates.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchTickets}
              className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} className={loadingList ? 'animate-spin' : ''} />
            </button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs h-11 px-5 rounded-2xl shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={15} /> Create Support Ticket
            </Button>
          </div>
        </div>
      </section>

      {/* Main Ticket Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          
          {/* Left Column: Tickets List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Your Tickets ({tickets.length})
                </span>
              </div>

              <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-100">
                {loadingList && tickets.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-400 font-semibold animate-pulse">
                    Loading your tickets...
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <LifeBuoy size={28} className="mx-auto text-gray-300" />
                    <p className="text-xs font-bold text-gray-500">No tickets found</p>
                    <p className="text-[11px] text-gray-400">Need help with an order? Open a ticket.</p>
                  </div>
                ) : (
                  tickets.map((t) => {
                    const isSelected = selectedTicket?.ticketNumber === t.ticketNumber;
                    return (
                      <button
                        key={t.id}
                        onClick={() => loadTicketDetail(t.ticketNumber)}
                        className={`w-full p-4 text-left transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected ? 'bg-purple-50/70 border-l-4 border-[#7C3AED]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-purple-700">{t.ticketNumber}</span>
                            {getStatusBadge(t.status)}
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 truncate leading-snug">{t.subject}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                            <span>{new Date(t.lastActivityAt).toLocaleDateString('en-IN')}</span>
                            <span>· {t.messageCount} msg{t.messageCount !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 shrink-0 mt-2" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Conversation Thread */}
          <div className="lg:col-span-8">
            {!selectedTicket ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-12 text-center h-full flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <MessageSquare size={26} />
                </div>
                <h3 className="text-base font-black text-gray-900">Select a Ticket to View Discussion</h3>
                <p className="text-xs text-gray-500 max-w-sm font-medium">
                  Choose a ticket from the left panel to read responses, send replies, or check current status.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col h-full">
                {/* Thread Header */}
                <div className="p-5 border-b border-gray-100 bg-slate-50/60 flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-700">{selectedTicket.ticketNumber}</span>
                      {getStatusBadge(selectedTicket.status)}
                      <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-md">
                        {selectedTicket.category.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-gray-900 leading-snug">{selectedTicket.subject}</h3>
                    {selectedTicket.relatedRequestNumber && (
                      <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1">
                        <FileText size={12} /> Linked Request: {selectedTicket.relatedRequestNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Messages Timeline */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[420px] bg-slate-50/30">
                  {selectedTicket.messages.map((m, idx) => {
                    const isInternal = m.isInternalNote;
                    const isStaff = ['ADMIN', 'SUPER_ADMIN', 'PARTNER_ADMIN', 'PARTNER_STAFF'].includes(m.senderRole);

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isInternal
                            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                            : isStaff
                            ? 'bg-purple-50/80 border-purple-200 text-purple-950 ml-4'
                            : 'bg-white border-gray-200 text-gray-900 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold">
                            {isInternal && <Lock size={12} className="text-amber-700" />}
                            <span>{m.senderName}</span>
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-black/5">
                              {isInternal ? 'Internal Staff Note' : m.senderRole}
                            </span>
                          </div>
                          <span className="text-[10px] opacity-60">
                            {new Date(m.createdAt).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap font-medium">{m.content}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-gray-100 bg-white space-y-2">
                  <textarea
                    rows={3} required
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your message or response..."
                    className="w-full p-3 rounded-2xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <div className="flex items-center justify-between gap-3">
                    {isAdminOrStaff && (
                      <label className="flex items-center gap-1.5 text-xs text-amber-800 font-bold cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isInternalNote}
                          onChange={e => setIsInternalNote(e.target.checked)}
                          className="accent-amber-600 rounded"
                        />
                        <Lock size={12} /> Add as Private Internal Note (Invisible to Customer)
                      </label>
                    )}
                    <Button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="ml-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} /> {sendingReply ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Create Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <LifeBuoy size={18} className="text-[#7C3AED]" /> Open New Support Ticket
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Issue Summary *</label>
                <input
                  type="text" required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  placeholder="e.g. Need update on PAN card status"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="SERVICE_REQUEST">Service Request & Status</option>
                    <option value="PAYMENT_BILLING">Payment & Invoices</option>
                    <option value="STUDIO_PROJECT">Sandy Digital Studio Project</option>
                    <option value="PARTNER_SUPPORT">Partner Center Inquiries</option>
                    <option value="FREE_TOOLS">Free Digital Tools</option>
                    <option value="OTHER">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Related Request / Order ID (Optional)</label>
                <input
                  type="text"
                  value={newRequestNum}
                  onChange={e => setNewRequestNum(e.target.value)}
                  placeholder="e.g. SDH-20260821-F4A8"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  required rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Explain what assistance or clarification you need..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <Button
                type="submit"
                disabled={creatingTicket}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs py-3 h-11 shadow-md cursor-pointer"
              >
                {creatingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
