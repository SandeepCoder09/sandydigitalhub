'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, Clock, AlertCircle, ShieldAlert, Package,
  Megaphone, Wrench, Zap, X, RefreshCw, Check, ArrowRight,
  ShoppingBag, Search, ChevronRight, Sparkles, Star,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  pinned: boolean;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
  relatedType?: string | null;
  isAnnouncement: boolean;
  category: string;
}

type TabType = 'ALL' | 'UNREAD' | 'ORDERS' | 'PLATFORM';

// ─── Config ───────────────────────────────────────────────────────────────────

function getIconConf(type: string, isAnnouncement: boolean) {
  if (isAnnouncement) {
    const map: Record<string, { icon: any; bg: string; text: string; label: string }> = {
      MAINTENANCE: { icon: Wrench, bg: 'bg-amber-100', text: 'text-amber-600', label: 'Maintenance' },
      SECURITY_NOTICE: { icon: ShieldAlert, bg: 'bg-red-100', text: 'text-red-700', label: 'Security' },
      NEW_FEATURE: { icon: Zap, bg: 'bg-violet-100', text: 'text-violet-600', label: 'New Feature' },
      PLATFORM_UPDATE: { icon: Sparkles, bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'Update' },
      NEW_SERVICE: { icon: Package, bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'New Service' },
    };
    return map[type] || { icon: Megaphone, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Platform' };
  }
  const map: Record<string, { icon: any; bg: string; text: string; label: string }> = {
    ORDER_COMPLETED: { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Completed' },
    ORDER_PLACED: { icon: ShoppingBag, bg: 'bg-blue-100', text: 'text-blue-600', label: 'Order Placed' },
    ORDER_CANCELLED: { icon: X, bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelled' },
    ORDER_STATUS_CHANGED: { icon: Clock, bg: 'bg-purple-100', text: 'text-purple-600', label: 'Status Update' },
    PARTNER_APPROVED: { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Approved' },
    PARTNER_SUSPENDED: { icon: AlertCircle, bg: 'bg-orange-100', text: 'text-orange-600', label: 'Suspended' },
    ACTION_REQUIRED: { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-600', label: 'Action Required' },
  };
  return map[type] || { icon: Bell, bg: 'bg-gray-100', text: 'text-gray-500', label: 'Notification' };
}

function getPriorityStyle(priority: string) {
  if (priority === 'URGENT') return 'bg-red-100 text-red-700 border border-red-200';
  if (priority === 'HIGH') return 'bg-amber-100 text-amber-700 border border-amber-200';
  return '';
}

function formatRelative(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  if (h < 48) return 'Yesterday';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatFull(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CustomerNotificationsPage() {
  const [tab, setTab] = useState<TabType>('ALL');
  const [search, setSearch] = useState('');
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Notif | null>(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications?limit=50');
      if (res.ok) {
        const data = await res.json();
        setNotifs(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const id = setInterval(() => { if (!document.hidden) fetchNotifs(); }, 30000);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  // ─── Mark read ─────────────────────────────────────────────────────────────
  const markRead = async (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch {}
  };

  const markAllRead = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch {}
  };

  const openNotif = (n: Notif) => {
    setSelected(n);
    if (!n.isRead) markRead(n.id);
  };

  // ─── Derived ──────────────────────────────────────────────────────────────
  const filtered = notifs.filter(n => {
    const matchTab =
      tab === 'ALL' ? true :
      tab === 'UNREAD' ? !n.isRead :
      tab === 'ORDERS' ? !n.isAnnouncement && n.type.startsWith('ORDER') :
      n.isAnnouncement;
    const matchSearch = !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCounts = {
    ALL: notifs.length,
    UNREAD: unreadCount,
    ORDERS: notifs.filter(n => !n.isAnnouncement && n.type.startsWith('ORDER')).length,
    PLATFORM: notifs.filter(n => n.isAnnouncement).length,
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50/60 pt-8 sm:pt-14 pb-20 px-3 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                <Bell size={24} />
              </span>
              My Notifications
            </h1>
            <p className="text-sm text-gray-500 mt-1.5 font-medium ml-15">
              Order updates, platform announcements and important notices all in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifs}
              className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors cursor-pointer shadow-xs"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors cursor-pointer shadow-sm shadow-violet-200"
              >
                <Check size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'UNREAD', 'ORDERS', 'PLATFORM'] as TabType[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                tab === t
                  ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {t === 'ALL' && <Bell size={12} />}
              {t === 'UNREAD' && <span className="w-2 h-2 rounded-full bg-current" />}
              {t === 'ORDERS' && <ShoppingBag size={12} />}
              {t === 'PLATFORM' && <Megaphone size={12} />}
              {t === 'ALL' ? 'All' : t === 'UNREAD' ? 'Unread' : t === 'ORDERS' ? 'My Orders' : 'Platform'}
              {tabCounts[t] > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  tab === t ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {tabCounts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notifications…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xs"
          />
        </div>

        {/* ── Content: List + Detail ── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Left: List */}
          <div className="flex-1 space-y-2">
            {loading && filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-sm text-gray-400 font-semibold animate-pulse shadow-xs">
                Loading notifications…
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-14 flex flex-col items-center text-center shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <Bell size={28} className="text-gray-200" />
                </div>
                <p className="text-base font-black text-gray-500">No notifications here</p>
                <p className="text-xs text-gray-400 font-medium mt-1">
                  {search ? 'Try a different search term.' : "You're all caught up!"}
                </p>
                {search && (
                  <button onClick={() => setSearch('')} className="mt-3 text-xs font-bold text-violet-600 hover:underline cursor-pointer">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map(n => {
                  const conf = getIconConf(n.type, n.isAnnouncement);
                  const Icon = conf.icon;
                  const isActive = selected?.id === n.id;
                  const priStyle = getPriorityStyle(n.priority);

                  return (
                    <button
                      key={n.id}
                      onClick={() => openNotif(n)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all cursor-pointer group flex items-start gap-4 ${
                        isActive
                          ? 'bg-violet-50 border-violet-300 shadow-sm shadow-violet-100'
                          : !n.isRead
                          ? 'bg-white border-violet-100 hover:border-violet-200 shadow-xs hover:shadow-sm'
                          : 'bg-white border-gray-200 hover:border-gray-300 shadow-xs'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`p-2.5 rounded-xl shrink-0 ${conf.bg} mt-0.5`}>
                        <Icon size={16} className={conf.text} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-bold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {n.pinned && <span className="mr-1">📌</span>}
                              {n.title}
                            </p>
                            <p className="text-[12px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                              {n.body}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${conf.bg} ${conf.text}`}>
                            {conf.label}
                          </span>
                          {n.isAnnouncement && (
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                              Platform
                            </span>
                          )}
                          {priStyle && (
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${priStyle}`}>
                              {n.priority}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium ml-auto">{formatRelative(n.createdAt)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-24">
              {!selected ? (
                <div className="bg-white rounded-3xl border border-gray-200 p-10 flex flex-col items-center text-center shadow-xs min-h-[300px] justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-4">
                    <Bell size={24} className="text-violet-200" />
                  </div>
                  <p className="text-sm font-black text-gray-500">Select a notification</p>
                  <p className="text-xs text-gray-400 mt-1">Tap any item to see full details.</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                  {/* Header */}
                  {(() => {
                    const conf = getIconConf(selected.type, selected.isAnnouncement);
                    const Icon = conf.icon;
                    return (
                      <div className={`p-5 border-b border-gray-100 ${conf.bg}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className={`p-3 rounded-2xl bg-white/70 backdrop-blur-sm shrink-0`}>
                            <Icon size={22} className={conf.text} />
                          </div>
                          <button
                            onClick={() => setSelected(null)}
                            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white/50 cursor-pointer transition-colors"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Body */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h2 className="text-base font-black text-gray-900 leading-snug">{selected.title}</h2>
                      {selected.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md mt-1.5">
                          📌 Pinned Notice
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] text-gray-600 leading-relaxed font-medium bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
                      {selected.body}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-bold text-gray-400">Type</span>
                        <span className="font-bold text-gray-700">
                          {getIconConf(selected.type, selected.isAnnouncement).label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-bold text-gray-400">Status</span>
                        <span className={`font-bold ${selected.isRead ? 'text-emerald-600' : 'text-violet-600'}`}>
                          {selected.isRead ? '✓ Read' : '● Unread'}
                        </span>
                      </div>
                      {selected.priority !== 'NORMAL' && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-bold text-gray-400">Priority</span>
                          <span className={`font-black text-[11px] px-2 py-0.5 rounded-md ${getPriorityStyle(selected.priority)}`}>
                            {selected.priority}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-start py-2 border-b border-gray-100 gap-3">
                        <span className="font-bold text-gray-400 shrink-0">Date</span>
                        <span className="font-bold text-gray-700 text-right text-[11px]">{formatFull(selected.createdAt)}</span>
                      </div>
                      {selected.isAnnouncement && (
                        <div className="flex justify-between items-center py-2">
                          <span className="font-bold text-gray-400">Source</span>
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                            Platform Announcement
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  {selected.link && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/60">
                      <Link
                        href={selected.link}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors shadow-sm"
                      >
                        View Related Page
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Back to requests shortcut */}
              <div className="mt-3">
                <Link
                  href="/requests"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <ShoppingBag size={13} />
                  View My Requests
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
