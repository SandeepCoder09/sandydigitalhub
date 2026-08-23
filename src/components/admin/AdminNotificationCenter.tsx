'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Bell, Check, Trash2, Filter, X, ShieldAlert, ShoppingBag, UserPlus,
  CreditCard, RefreshCw, ExternalLink, Megaphone, CheckCheck, ArrowRight,
  AlertCircle
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'PAYMENT' | 'ORDER' | 'CUSTOMER' | 'SERVICE' | 'SYSTEM' | 'ANNOUNCEMENT';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link?: string;
}

const READ_STORAGE_KEY = 'sdh_admin_read_notifs';
const DELETED_STORAGE_KEY = 'sdh_admin_deleted_notifs';

export function AdminNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'PAYMENT' | 'ORDER' | 'ANNOUNCEMENT'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedRead = JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]');
      const savedDeleted = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY) || '[]');
      setReadIds(savedRead);
      setDeletedIds(savedDeleted);
    } catch {
      // ignore
    }
  }, []);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        const rawNotifs: NotificationItem[] = data.notifications || [];
        
        // Merge with local read/deleted states
        const savedRead = JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]');
        const savedDeleted = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY) || '[]');

        const processed = rawNotifs
          .filter((n) => !savedDeleted.includes(n.id))
          .map((n) => ({
            ...n,
            read: n.read || savedRead.includes(n.id),
          }));

        // Also fetch platform announcements targeted to ADMIN
        try {
          const annRes = await fetch('/api/notifications?limit=10');
          if (annRes.ok) {
            const annData = await annRes.json();
            const annNotifs: NotificationItem[] = (annData.notifications || [])
              .filter((n: any) => n.isAnnouncement)
              .filter((n: any) => !savedDeleted.includes(n.id))
              .map((n: any) => ({
                id: n.id,
                category: 'ANNOUNCEMENT' as const,
                title: n.title,
                desc: n.body,
                time: n.createdAt,
                read: n.isRead || savedRead.includes(n.id),
                link: '/admin/announcements',
              }));
            setNotifications([...processed, ...annNotifs]);
            return;
          }
        } catch {}

        setNotifications(processed);
      }
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      if (!document.hidden) fetchNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemRead = (id: string) => {
    const updated = Array.from(new Set([...readIds, id]));
    setReadIds(updated);
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = Array.from(new Set([...deletedIds, id]));
    setDeletedIds(updated);
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'PAYMENT') return n.category === 'PAYMENT';
    if (filter === 'ORDER') return n.category === 'ORDER';
    if (filter === 'ANNOUNCEMENT') return n.category === 'ANNOUNCEMENT';
    return true;
  });

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'PAYMENT':
        return <CreditCard size={15} className="text-emerald-600" />;
      case 'ORDER':
        return <ShoppingBag size={15} className="text-violet-600" />;
      case 'CUSTOMER':
        return <UserPlus size={15} className="text-purple-600" />;
      case 'SERVICE':
        return <ShieldAlert size={15} className="text-red-600" />;
      case 'ANNOUNCEMENT':
        return <Megaphone size={15} className="text-indigo-600" />;
      case 'SYSTEM':
      default:
        return <AlertCircle size={15} className="text-amber-600" />;
    }
  };

  const drawerContent = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full sm:w-[420px] h-full bg-white flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Bell size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">Admin Notifications</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {unreadCount} Unread Events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Action Controls & Single-Row Horizontal Filter Chips */}
        <div className="p-3 bg-slate-50 border-b border-gray-200 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-bold text-[11px]">
              {filteredNotifications.length} of {notifications.length} notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-extrabold text-violet-600 hover:text-violet-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px] font-bold flex-nowrap">
            {(['ALL', 'UNREAD', 'PAYMENT', 'ORDER', 'ANNOUNCEMENT'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs ${
                  filter === f
                    ? 'bg-violet-600 text-white font-extrabold scale-[1.02]'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                {f === 'ANNOUNCEMENT' && <Megaphone size={11} />}
                <span>{f === 'ALL' ? 'All' : f === 'UNREAD' ? 'Unread' : f === 'PAYMENT' ? 'Payment' : f === 'ORDER' ? 'Order' : 'Platform'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Feed List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar bg-gray-50/30">
          {loading && notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <RefreshCw size={28} className="text-violet-500 mb-2 animate-spin" />
              <p className="text-xs font-bold text-gray-600">Loading live updates...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
                <Bell size={22} />
              </div>
              <p className="text-xs font-bold text-gray-700">No notifications found</p>
              <p className="text-[11px] text-gray-400 mt-0.5">You are all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || '/admin/orders'}
                onClick={() => {
                  markItemRead(n.id);
                  setIsOpen(false);
                }}
                className={`p-3.5 flex items-start justify-between gap-3 hover:bg-violet-50/50 transition-colors block text-left group ${
                  !n.read ? 'bg-violet-50/40 font-semibold' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-white transition-colors shrink-0 mt-0.5 border border-gray-200/50">
                    {getCategoryIcon(n.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2 mt-0.5">
                      {n.desc}
                    </p>
                    <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                      {n.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => deleteNotification(e, n.id)}
                  className="text-gray-300 hover:text-red-600 p-1 cursor-pointer shrink-0 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 size={13} />
                </button>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-gray-200 shrink-0">
          <Link
            href="/admin/notifications"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-violet-600/20 transition-all text-xs cursor-pointer"
          >
            <span>Open Full Notification Hub</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl bg-[#181B21] hover:bg-slate-800 border border-[#2B3038] text-gray-300 hover:text-white transition-all cursor-pointer"
        title="Admin Notifications Center"
        aria-label="Admin Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
