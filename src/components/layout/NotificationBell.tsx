'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Bell, CheckCircle2, Clock, AlertCircle, ArrowRight, MessageSquare,
  Megaphone, ShieldAlert, Wrench, Zap, Package, X, RefreshCw,
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
  return map[type] || { icon: Bell, color: 'bg-gray-100 text-gray-500' };
}

export function NotificationBell({ placement = 'auto', align = 'auto', theme = 'auto' }: NotificationBellProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adminChatCount, setAdminChatCount] = useState(0);

  const isUp = placement === 'up';
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes((session?.user as any)?.role || '');

  // ─── 1. Lightweight Unread Count Polling (< 50 bytes, zero heavy document downloads) ───
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

  // ─── 2. Full Notification Feed Fetch (Only triggered when user opens the menu or refreshes) ───
  const fetchFullNotifications = useCallback(async () => {
    if (!session?.user) return;
    setLoading(true);
    try {
      const data = await clientFetch<{ notifications: NotifItem[]; unreadCount: number }>(
        '/api/notifications?limit=25',
        { cacheTtlMs: 10000 }
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

  // Set up low-overhead polling for badge count only
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
    }, 30000); // 30s lightweight ping

    return () => clearInterval(interval);
  }, [session, fetchUnreadCount]);

  // Fetch full notification list whenever user clicks open the bell
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

  // Compute dropdown placement classes: Centered on mobile (< sm), dropdown on desktop (sm+)
  let dropdownPositionClass =
    'fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[390px] sm:absolute sm:left-auto sm:right-0 sm:translate-x-0 sm:top-full sm:mt-2.5 sm:w-[380px]';

  if (isUp) {
    dropdownPositionClass =
      'fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[390px] sm:absolute sm:left-1/2 sm:-translate-x-[45%] sm:top-auto sm:bottom-full sm:mb-3 sm:w-[380px]';
  } else if (align === 'left') {
    dropdownPositionClass =
      'fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[390px] sm:absolute sm:left-full sm:ml-3 sm:top-0 sm:translate-x-0 sm:w-[380px]';
  } else if (align === 'right') {
    dropdownPositionClass =
      'fixed left-1/2 -translate-x-1/2 top-20 w-[calc(100vw-24px)] max-w-[390px] sm:absolute sm:left-auto sm:right-0 sm:translate-x-0 sm:top-full sm:mt-2.5 sm:w-[380px]';
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer group ${
          theme === 'dark'
            ? 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white shadow-inner'
            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
        }`}
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

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[1px] sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`z-50 ${dropdownPositionClass} bg-white border border-slate-200/90 rounded-2xl shadow-2xl shadow-slate-950/20 overflow-hidden text-slate-900 duration-150 animate-in fade-in zoom-in-95`}
          >
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 text-[#7C3AED]">
                  <Bell size={15} />
                </div>
                <span className="font-bold text-xs sm:text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#7C3AED] text-white px-2 py-0.5 rounded-full shadow-2xs">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-[#7C3AED] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={fetchFullNotifications}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Refresh Notifications"
                >
                  <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Admin chat alert shortcut */}
            {isAdmin && adminChatCount > 0 && (
              <Link
                href="/admin/chat"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50 border-b border-red-100 text-red-700 hover:bg-red-100 transition-colors"
              >
                <span className="p-1 rounded-lg bg-red-100 text-red-600 animate-pulse">
                  <MessageSquare size={13} />
                </span>
                <span className="text-xs font-bold flex-1">
                  {adminChatCount} live agent request{adminChatCount > 1 ? 's' : ''} pending
                </span>
                <ArrowRight size={12} />
              </Link>
            )}

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center text-xs font-medium text-slate-400">
                  <RefreshCw size={24} className="mx-auto text-slate-300 mb-2 animate-spin" />
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-xs font-medium text-slate-400">
                  <Bell size={28} className="mx-auto text-slate-200 mb-2" />
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 25).map((n) => {
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
                      className={`flex items-start gap-3 p-3.5 hover:bg-purple-50/50 transition-colors ${
                        !n.isRead ? 'bg-purple-50/20' : ''
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-1.5">
                          <p className="text-[12.5px] font-bold text-slate-900 leading-snug break-words">
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#7C3AED] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[11.5px] text-slate-600 leading-relaxed break-words">
                          {n.body}
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[10.5px] text-slate-400 font-medium">
                            {formatRelative(n.createdAt)}
                          </span>
                          {n.isAnnouncement && (
                            <span className="text-[9px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                              Platform
                            </span>
                          )}
                          {n.priority === 'URGENT' && (
                            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
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
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
              <Link
                href={isAdmin ? '/admin/notifications' : '/notifications'}
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#7C3AED] font-bold hover:underline inline-flex items-center gap-1.5"
              >
                <span>{isAdmin ? 'View All Notifications' : 'View All My Notifications'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
