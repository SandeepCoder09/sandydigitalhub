'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, Clock, AlertCircle, ShieldAlert, ShoppingBag,
  UserPlus, CreditCard, MessageSquare, Megaphone, Wrench, Zap, Package,
  RefreshCw, Check, Trash2, Filter, X, Search, ArrowRight, Eye,
  ChevronDown, Star, AlertTriangle, Circle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminNotif {
  id: string;
  category: 'PAYMENT' | 'ORDER' | 'CUSTOMER' | 'SERVICE' | 'SYSTEM' | 'ANNOUNCEMENT';
  title: string;
  desc: string;
  time: string;
  rawDate: string;
  read: boolean;
  link?: string;
}

interface UnifiedNotif {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
  pinned: boolean;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
  isAnnouncement: boolean;
  category: string;
}

type FilterType = 'ALL' | 'UNREAD' | 'PAYMENT' | 'ORDER' | 'CUSTOMER' | 'SYSTEM' | 'ANNOUNCEMENT';

const READ_KEY = 'sdh_admin_read_notifs';
const DEL_KEY = 'sdh_admin_deleted_notifs';

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; dot: string; bg: string; text: string }> = {
  PAYMENT: { label: 'Payment', icon: CreditCard, dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  ORDER: { label: 'Order', icon: ShoppingBag, dot: 'bg-violet-600', bg: 'bg-violet-50', text: 'text-violet-700' },
  CUSTOMER: { label: 'Customer', icon: UserPlus, dot: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  SERVICE: { label: 'Live Support', icon: MessageSquare, dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  SYSTEM: { label: 'System', icon: AlertCircle, dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  ANNOUNCEMENT: { label: 'Platform', icon: Megaphone, dot: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  MAINTENANCE: { label: 'Maintenance', icon: Wrench, dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  SECURITY_NOTICE: { label: 'Security', icon: ShieldAlert, dot: 'bg-red-700', bg: 'bg-red-50', text: 'text-red-800' },
  NEW_FEATURE: { label: 'New Feature', icon: Zap, dot: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700' },
  NEW_SERVICE: { label: 'New Service', icon: Package, dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  GENERAL: { label: 'General', icon: Bell, dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-600' },
};

function getCatConf(category: string) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.GENERAL;
}

function formatFull(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
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

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminNotificationsPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [search, setSearch] = useState('');
  const [allNotifs, setAllNotifs] = useState<AdminNotif[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AdminNotif | null>(null);
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // ─── Load local state ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      setReadIds(JSON.parse(localStorage.getItem(READ_KEY) || '[]'));
      setDeletedIds(JSON.parse(localStorage.getItem(DEL_KEY) || '[]'));
    } catch {}
  }, []);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetch_notifications = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both admin event notifications and unified platform announcements in parallel
      const [adminRes, unifiedRes] = await Promise.all([
        fetch('/api/admin/notifications'),
        fetch('/api/notifications?limit=50'),
      ]);

      const saved_read = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
      const saved_del = JSON.parse(localStorage.getItem(DEL_KEY) || '[]');

      let combined: AdminNotif[] = [];

      if (adminRes.ok) {
        const data = await adminRes.json();
        combined = (data.notifications || []).map((n: any) => ({
          ...n,
          read: n.read || saved_read.includes(n.id),
        })).filter((n: AdminNotif) => !saved_del.includes(n.id));
      }

      if (unifiedRes.ok) {
        const uData = await unifiedRes.json();
        const annNotifs: AdminNotif[] = (uData.notifications || [])
          .filter((n: any) => n.isAnnouncement && !saved_del.includes(n.id))
          .map((n: any) => ({
            id: n.id,
            category: 'ANNOUNCEMENT' as const,
            title: n.title,
            desc: n.body,
            time: formatRelative(n.createdAt),
            rawDate: n.createdAt,
            read: n.isRead || saved_read.includes(n.id),
            link: '/admin/announcements',
          }));
        // merge, avoiding duplicate ids
        const existingIds = new Set(combined.map(n => n.id));
        combined = [...combined, ...annNotifs.filter(n => !existingIds.has(n.id))];
      }

      // Sort
      combined.sort((a, b) =>
        sortDir === 'desc'
          ? new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
          : new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
      );

      setAllNotifs(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sortDir]);

  useEffect(() => {
    fetch_notifications();
    const interval = setInterval(() => {
      if (!document.hidden) fetch_notifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetch_notifications]);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const markRead = (id: string) => {
    const updated = Array.from(new Set([...readIds, id]));
    setReadIds(updated);
    try { localStorage.setItem(READ_KEY, JSON.stringify(updated)); } catch {}
    setAllNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (selected?.id === id) setSelected(s => s ? { ...s, read: true } : s);
  };

  const markAllRead = async () => {
    const allIds = allNotifs.map(n => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try { localStorage.setItem(READ_KEY, JSON.stringify(updated)); } catch {}
    setAllNotifs(prev => prev.map(n => ({ ...n, read: true })));
    // Also persist to server
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch {}
  };

  const deleteNotif = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = Array.from(new Set([...deletedIds, id]));
    setDeletedIds(updated);
    try { localStorage.setItem(DEL_KEY, JSON.stringify(updated)); } catch {}
    setAllNotifs(prev => prev.filter(n => n.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const clearAll = () => {
    const allIds = allNotifs.map(n => n.id);
    const updated = Array.from(new Set([...deletedIds, ...allIds]));
    setDeletedIds(updated);
    try { localStorage.setItem(DEL_KEY, JSON.stringify(updated)); } catch {}
    setAllNotifs([]);
    setSelected(null);
  };

  // ─── Derived State ─────────────────────────────────────────────────────────
  const unread = allNotifs.filter(n => !n.read).length;
  const stats = {
    total: allNotifs.length,
    unread,
    payment: allNotifs.filter(n => n.category === 'PAYMENT').length,
    order: allNotifs.filter(n => n.category === 'ORDER').length,
    customer: allNotifs.filter(n => n.category === 'CUSTOMER').length,
    announcement: allNotifs.filter(n => n.category === 'ANNOUNCEMENT').length,
  };

  const filtered = allNotifs.filter(n => {
    const matchCat =
      filter === 'ALL' ? true :
      filter === 'UNREAD' ? !n.read :
      n.category === filter;
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-violet-100 text-violet-700">
              <Bell size={22} />
            </span>
            Notification Center
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            All platform activity, order events, customer registrations and announcements in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetch_notifications}
            className="p-2.5 rounded-2xl bg-white border border-gray-200 text-gray-500 hover:text-violet-600 hover:border-violet-300 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-colors cursor-pointer"
            >
              <Check size={14} />
              Mark all read ({unread})
            </button>
          )}
          {allNotifs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-700', bg: 'bg-white', icon: Bell },
          { label: 'Unread', value: stats.unread, color: 'text-violet-700', bg: 'bg-violet-50', icon: Circle },
          { label: 'Payments', value: stats.payment, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CreditCard },
          { label: 'Orders', value: stats.order, color: 'text-blue-700', bg: 'bg-blue-50', icon: ShoppingBag },
          { label: 'Customers', value: stats.customer, color: 'text-purple-700', bg: 'bg-purple-50', icon: UserPlus },
          { label: 'Platform', value: stats.announcement, color: 'text-indigo-700', bg: 'bg-indigo-50', icon: Megaphone },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`${bg} rounded-2xl border border-gray-100 p-4 text-center shadow-xs`}>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className={`text-[10px] font-bold ${color} opacity-70 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1`}>
              <Icon size={10} />
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Layout ── */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[600px]">
        {/* ── Left: Filter + List ── */}
        <div className="lg:w-[420px] xl:w-[460px] shrink-0 flex flex-col gap-3">
          {/* Search + Sort Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search notifications…"
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              />
            </div>
            <button
              onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
              title="Toggle sort direction"
            >
              <ChevronDown size={13} className={sortDir === 'asc' ? 'rotate-180 transition-transform' : 'transition-transform'} />
              {sortDir === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'UNREAD', 'PAYMENT', 'ORDER', 'CUSTOMER', 'SYSTEM', 'ANNOUNCEMENT'] as FilterType[]).map(f => {
              const conf = f === 'ALL' ? null : f === 'UNREAD' ? null : getCatConf(f);
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer border flex items-center gap-1 ${
                    filter === f
                      ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {f === 'ALL' && <Bell size={11} />}
                  {f === 'UNREAD' && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  {f === 'ALL' ? 'All' : f === 'UNREAD' ? `Unread (${unread})` : conf?.label}
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
            {loading && filtered.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-12 text-xs text-gray-400 font-semibold animate-pulse">
                Loading notifications…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Bell size={40} className="text-gray-100 mb-3" />
                <p className="text-sm font-bold text-gray-400">No notifications found.</p>
                {search && (
                  <button onClick={() => setSearch('')} className="mt-2 text-xs text-violet-600 font-bold cursor-pointer hover:underline">
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[640px] divide-y divide-gray-50">
                {filtered.map(n => {
                  const conf = getCatConf(n.category);
                  const Icon = conf.icon;
                  const isActive = selected?.id === n.id;

                  return (
                    <button
                      key={n.id}
                      onClick={() => { setSelected(n); if (!n.read) markRead(n.id); }}
                      className={`w-full text-left p-4 flex items-start gap-3 transition-all group cursor-pointer ${
                        isActive ? 'bg-violet-50 border-l-2 border-violet-600' :
                        !n.read ? 'bg-blue-50/30 hover:bg-violet-50/40 border-l-2 border-transparent hover:border-violet-300' :
                        'hover:bg-gray-50/80 border-l-2 border-transparent'
                      }`}
                    >
                      {/* Category Icon */}
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${conf.bg}`}>
                        <Icon size={13} className={conf.text} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-bold truncate leading-tight ${isActive ? 'text-violet-800' : 'text-gray-900'}`}>
                            {n.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />}
                            <button
                              onClick={(e) => deleteNotif(e, n.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 cursor-pointer transition-all"
                              title="Remove"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.desc}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${conf.bg} ${conf.text}`}>
                            {conf.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{n.time}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Detail Panel ── */}
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <div className="w-20 h-20 rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-5">
                <Bell size={36} className="text-violet-200" />
              </div>
              <h3 className="text-base font-black text-gray-700">Select a notification</h3>
              <p className="text-xs text-gray-400 font-medium mt-1 max-w-xs">
                Click any notification on the left to view its full details here.
              </p>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {/* Detail Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {(() => {
                      const conf = getCatConf(selected.category);
                      const Icon = conf.icon;
                      return (
                        <div className={`p-3 rounded-2xl shrink-0 ${conf.bg}`}>
                          <Icon size={20} className={conf.text} />
                        </div>
                      );
                    })()}
                    <div className="min-w-0">
                      <h2 className="text-lg font-black text-gray-900 leading-tight">{selected.title}</h2>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {(() => {
                          const conf = getCatConf(selected.category);
                          return (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${conf.bg} ${conf.text}`}>
                              {conf.label}
                            </span>
                          );
                        })()}
                        {selected.read && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <CheckCircle2 size={10} /> Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Full Message */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Message</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    {selected.desc}
                  </p>
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Category</div>
                    <div className="text-sm font-bold text-gray-800">{getCatConf(selected.category).label}</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</div>
                    <div className={`text-sm font-bold flex items-center gap-1.5 ${selected.read ? 'text-emerald-600' : 'text-violet-600'}`}>
                      {selected.read ? (
                        <>
                          <CheckCircle2 size={14} />
                          Read
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />
                          Unread
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 col-span-2">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Received At</div>
                    <div className="text-sm font-bold text-gray-800">{formatFull(selected.rawDate)}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">{selected.time}</div>
                  </div>
                </div>
              </div>

              {/* Detail Footer */}
              <div className="p-5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={(e) => deleteNotif(e as any, selected.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <Trash2 size={13} />
                  Remove Notification
                </button>

                {selected.link && (
                  <Link
                    href={selected.link}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 cursor-pointer transition-colors shadow-sm"
                  >
                    <Eye size={13} />
                    View Details
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
