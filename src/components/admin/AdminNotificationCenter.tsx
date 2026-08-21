'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, Filter, X, ShieldAlert, ShoppingBag, UserPlus, CreditCard, RefreshCw, ExternalLink, Megaphone } from 'lucide-react';

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
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'PAYMENT' | 'ORDER' | 'ANNOUNCEMENT'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedRead = JSON.parse(localStorage.getItem(READ_STORAGE_KEY) || '[]');
      const savedDeleted = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY) || '[]');
      setReadIds(savedRead);
      setDeletedIds(savedDeleted);
    } catch {
      // ignore
    }
  }, []);

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

  const getCategoryBadge = (category: NotificationItem['category']) => {
    switch (category) {
      case 'PAYMENT':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-2xs" />;
      case 'ORDER':
        return <span className="w-2.5 h-2.5 rounded-full bg-violet-600 shrink-0 shadow-2xs" />;
      case 'CUSTOMER':
        return <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 shadow-2xs" />;
      case 'SERVICE':
        return <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 animate-ping" />;
      case 'ANNOUNCEMENT':
        return <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />;
      case 'SYSTEM':
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-gray-100 hover:bg-violet-50 text-gray-600 hover:text-violet-700 transition-all border border-gray-200 cursor-pointer"
        title="Admin Notifications Center"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Drawer Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-gray-200 shadow-2xl z-50 overflow-hidden animate-in fade-in duration-150">
            {/* Header */}
            <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-violet-600" />
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Notifications ({unreadCount} Unread)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-violet-600 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-2 border-b border-gray-100 flex items-center gap-1 text-[11px] font-bold flex-wrap">
              {(['ALL', 'UNREAD', 'PAYMENT', 'ORDER', 'ANNOUNCEMENT'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    filter === f
                      ? 'bg-violet-600 text-white font-extrabold shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'ANNOUNCEMENT' && <Megaphone size={11} />}
                  {f === 'ALL' ? 'All' : f === 'UNREAD' ? 'Unread' : f === 'PAYMENT' ? 'Payment' : f === 'ORDER' ? 'Order' : 'Platform'}
                </button>
              ))}
            </div>

            {/* Notifications Feed List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-gray-400">
                  No notifications recorded.
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
                      !n.read ? 'bg-violet-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="mt-1">{getCategoryBadge(n.category)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-extrabold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 font-medium line-clamp-2 mt-0.5 leading-relaxed">
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
                      title="Delete Notification"
                    >
                      <Trash2 size={13} />
                    </button>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
