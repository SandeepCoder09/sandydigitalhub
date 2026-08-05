'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatOrderId } from '@/lib/utils';
import { Bell, CheckCircle2, Clock, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';

export function NotificationBell() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!session?.user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    if (session.user.role === 'ADMIN') {
      const fetchAdminNotifications = async () => {
        if (document.hidden) return;

        try {
          const res = await fetch('/api/admin/chat');
          if (res.ok) {
            const data = await res.json();
            const alerts = (data.sessions || []).filter((s: any) => s.needsAdmin && !s.adminRead);
            setNotifications(alerts.map((a: any) => ({
              id: a._id,
              brandedId: 'Live Agent Needed 🚨',
              status: 'LIVE_AGENT_REQUEST',
              title: `${a.lastSender || 'Customer'} requested to talk with a live Sandy Digital Hub agent!`,
              updatedAt: a.updatedAt,
            })));
            setUnreadCount(data.alertCount || 0);
          } else if (res.status === 401 || res.status === 403) {
            if (intervalId) clearInterval(intervalId);
          }
        } catch (err) {
          console.error('Failed to fetch admin notifications:', err);
        }
      };

      fetchAdminNotifications();
      intervalId = setInterval(fetchAdminNotifications, 20000); // Smart 20s interval
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    } else {
      fetchCustomerOrders();
    }
  }, [session]);

  const fetchCustomerOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const orders = data.orders || [];

        const activeNotifs = orders
          .filter((o: any) => ['PROCESSING', 'COMPLETED', 'AWAITING_CUSTOMER_VISIT'].includes(o.orderStatus))
          .map((o: any) => ({
            id: o._id.toString(),
            brandedId: formatOrderId(o._id, o.createdAt),
            status: o.orderStatus,
            title: o.services?.map((s: any) => s.title).join(', ') || 'Service Order',
            updatedAt: o.updatedAt || o.createdAt,
          }));

        setNotifications(activeNotifs);
        setUnreadCount(activeNotifs.length);
      }
    } catch (error) {
      console.error('Failed to fetch order notifications:', error);
    }
  };

  if (!session?.user) return null;

  const isAdmin = session.user.role === 'ADMIN';

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-muted/80 hover:bg-accent text-foreground transition-colors flex items-center justify-center border border-border/40 shadow-sm"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#111111] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden text-white">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#2563EB]" />
                <span className="font-bold text-sm">
                  {isAdmin ? 'Admin Live Support Notifications' : 'Order Status Updates'}
                </span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[#2563EB]/20 text-[#2563EB] px-2 py-0.5 rounded-full">
                  {unreadCount} {isAdmin ? 'Alerts' : 'Active'}
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/40">
                  {isAdmin ? 'No pending customer live agent requests.' : 'No recent order status updates.'}
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={isAdmin ? '/admin/chat' : '/requests'}
                    onClick={() => setIsOpen(false)}
                    className="p-3.5 flex items-start gap-3 hover:bg-white/5 transition-colors block"
                  >
                    <div className="mt-0.5">
                      {n.status === 'LIVE_AGENT_REQUEST' ? (
                        <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
                          <MessageSquare size={15} />
                        </div>
                      ) : n.status === 'COMPLETED' ? (
                        <div className="p-1.5 rounded-lg bg-green-500/20 text-green-400">
                          <CheckCircle2 size={15} />
                        </div>
                      ) : n.status === 'PROCESSING' ? (
                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                          <Clock size={15} className="animate-spin" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                          <AlertCircle size={15} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-[#2563EB]">{n.brandedId}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          n.status === 'LIVE_AGENT_REQUEST' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          n.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          n.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {n.status === 'LIVE_AGENT_REQUEST' ? 'AGENT NEEDED' : n.status === 'AWAITING_CUSTOMER_VISIT' ? 'AWAITING VISIT' : n.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/80 line-clamp-2">{n.title}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-white/5 border-t border-white/5 text-center">
              <Link
                href={isAdmin ? '/admin/chat' : '/requests'}
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>{isAdmin ? 'Open Live Support Chat Inbox' : 'View All My Requests'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
