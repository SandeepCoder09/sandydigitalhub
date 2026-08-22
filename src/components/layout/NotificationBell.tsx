'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, Clock, AlertCircle, ArrowRight, MessageSquare,
  Megaphone, ShieldAlert, Wrench, Zap, Package, X, RefreshCw, CheckCheck,
} from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';

interface NotifItem {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
  pinned: boolean;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
  relatedType?: string | null;
  isAnnouncement: boolean;
}

interface NotificationBellProps {
  placement?: 'up' | 'down' | 'auto';
  align?: 'left' | 'right' | 'auto';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

function formatRelative(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getNotifIcon(type: string, isAnnouncement: boolean) {
  if (isAnnouncement) {
    const iconMap: Record<string, { icon: any; color: string }> = {
      MAINTENANCE: { icon: Wrench, color: 'bg-amber-100 text-amber-600' },
      SECURITY_NOTICE: { icon: ShieldAlert, color: 'bg-red-100 text-red-600' },
      NEW_FEATURE: { icon: Zap, color: 'bg-violet-100 text-violet-600' },
      PLATFORM_UPDATE: { icon: Zap, color: 'bg-indigo-100 text-indigo-600' },
      NEW_SERVICE: { icon: Package, color: 'bg-emerald-100 text-emerald-600' },
    };
    const conf = iconMap[type] || { icon: Megaphone, color: 'bg-slate-100 text-slate-600' };
    return conf;
  }
  const map: Record<string, { icon: any; color: string }> = {
    ORDER_COMPLETED: { icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    ORDER_PLACED: { icon: Package, color: 'bg-blue-100 text-blue-600' },
    ORDER_CANCELLED: { icon: X, color: 'bg-red-100 text-red-600' },
    ORDER_STATUS_CHANGED: { icon: Clock, color: 'bg-purple-100 text-purple-600' },
    PARTNER_APPROVED: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
    PARTNER_SUSPENDED: { icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
    LIVE_AGENT_REQUEST: { icon: MessageSquare, color: 'bg-red-100 text-red-600' },
  };
  return map[type] || { icon: Bell, color: 'bg-purple-100 text-purple-600' };
}

export function NotificationBell({ theme = 'auto', className }: NotificationBellProps = {}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminChatCount, setAdminChatCount] = useState(0);

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes((session?.user as any)?.role || '');

  // Mount check for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when notification drawer is open
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

  // ─── 1. Lightweight Unread Count Polling (< 50 bytes) ───
  const fetchUnreadCount = useCallback(async () => {
    if (!session?.user || document.hidden) return;
    try {
      const data = await clientFetch<{ unreadCount: number; adminChatCount: number }>(
        '/api/notifications/unread-count',
        { cacheTtlMs: 15000 }
      );
      if (data) {
        setUnreadCount(data.unreadCount || 0);
        setAdminChatCount(data.adminChatCount || 0);
      }
    } catch {}
  }, [session]);

  // ─── 2. Full Notification Feed Fetch (Triggered on open/refresh) ───
  const fetchFullNotifications = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const data = await clientFetch<{ notifications: NotifItem[]; unreadCount: number }>(
        '/api/notifications?limit=30',
        { cacheTtlMs: 5000 }
      );
      if (data) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user) {
      setNotifications([]);
      setUnreadCount(0);
      setAdminChatCount(0);
      return;
    }

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [session, fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      fetchFullNotifications();
    }
  }, [isOpen, fetchFullNotifications]);

  // ─── Mark single item read ─────────────────────────────────────────────────
  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch {}
  };

  // ─── Mark all read ─────────────────────────────────────────────────────────
  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
    } catch {}
  };

  if (!session?.user) return null;

  const totalBadge = unreadCount + adminChatCount;

  const notificationDrawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs"
            style={{ zIndex: 9998 }}
          />

          {/* Slide-in Drawer: Full screen width on mobile, 420px on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-slate-200 flex flex-col shadow-2xl"
            style={{ zIndex: 9999 }}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-100 text-[#7C3AED] shadow-xs">
                  <Bell size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-none">Notifications</h2>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-extrabold bg-[#7C3AED] text-white px-2 py-0.5 rounded-full shadow-2xs">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">Platform updates and order activity</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={fetchFullNotifications}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title="Refresh Notifications"
                >
                  <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500 font-medium">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="font-bold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <CheckCheck size={14} />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Admin chat alert banner */}
            {isAdmin && adminChatCount > 0 && (
              <Link
                href="/admin/chat"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3.5 bg-red-50 border-b border-red-100 text-red-700 hover:bg-red-100 transition-colors shrink-0"
              >
                <span className="p-1.5 rounded-xl bg-red-100 text-red-600 animate-pulse">
                  <MessageSquare size={16} />
                </span>
                <span className="text-xs font-bold flex-1">
                  {adminChatCount} live agent request{adminChatCount > 1 ? 's' : ''} pending
                </span>
                <ArrowRight size={14} />
              </Link>
            )}

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50/20 custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <RefreshCw size={32} className="text-slate-300 mb-3 animate-spin" />
                  <p className="text-sm font-semibold text-slate-600">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                    <Bell size={28} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                    You will receive order status updates, announcements, and alerts here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const { icon: Icon, color } = getNotifIcon(n.type, n.isAnnouncement);
                  const dest = n.link || (isAdmin ? '/admin' : '/requests');

                  return (
                    <Link
                      key={n.id}
                      href={dest}
                      onClick={() => {
                        if (!n.isRead) markRead(n.id);
                        setIsOpen(false);
                      }}
                      className={`flex items-start gap-3.5 p-4 hover:bg-purple-50/40 transition-colors ${
                        !n.isRead ? 'bg-purple-50/25' : 'bg-white'
                      }`}
                    >
                      <div className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${color} shadow-2xs`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[13px] leading-snug break-words ${!n.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] shrink-0 mt-1 shadow-xs" />
                          )}
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed break-words">
                          {n.body}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {formatRelative(n.createdAt)}
                          </span>
                          {n.isAnnouncement && (
                            <span className="text-[9px] font-extrabold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                              Platform Notice
                            </span>
                          )}
                          {n.priority === 'URGENT' && (
                            <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                              URGENT
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white shrink-0">
              <Link
                href={isAdmin ? '/admin/notifications' : '/notifications'}
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <span>{isAdmin ? 'View All Admin Notifications' : 'View All My Notifications'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          className ||
          `relative p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer group ${
            theme === 'dark'
              ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shadow-inner'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`
        }
        aria-label="Notifications"
        id="notification-bell-btn"
        title="Notifications"
      >
        <Bell
          size={16}
          className={
            theme === 'dark'
              ? 'text-slate-300 group-hover:text-white transition-colors'
              : 'text-slate-600 group-hover:text-slate-900 transition-colors'
          }
        />
        {totalBadge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#7C3AED] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-sm">
            {totalBadge > 9 ? '9+' : totalBadge}
          </span>
        )}
      </button>

      {mounted && createPortal(notificationDrawerContent, document.body)}
    </>
  );
}
