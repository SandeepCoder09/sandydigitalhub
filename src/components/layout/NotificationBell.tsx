'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { formatOrderId } from '@/lib/utils';
import { Bell, CheckCircle2, Clock, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';

interface NotificationBellProps {
  placement?: 'up' | 'down' | 'auto';
}

export function NotificationBell({ placement = 'auto' }: NotificationBellProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const isUp = placement === 'up';

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
      intervalId = setInterval(fetchAdminNotifications, 20000); // 20s interval
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
        className="relative p-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] transition-colors flex items-center justify-center border border-slate-200 hover:border-purple-200 shadow-2xs cursor-pointer group"
        aria-label="Notifications"
      >
        <Bell size={17} className="text-slate-600 group-hover:text-[#7C3AED] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#7C3AED] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
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

          <div
            className={`absolute ${
              isUp
                ? 'bottom-full mb-3 left-1/2 -translate-x-[45%] w-76 sm:w-84 animate-in fade-in slide-in-from-bottom-2'
                : 'top-full mt-3 right-0 w-80 sm:w-96 animate-in fade-in slide-in-from-top-2'
            } bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-purple-950/15 z-50 overflow-hidden text-slate-900 duration-150`}
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-purple-100 text-[#7C3AED]">
                  <Bell size={15} />
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                  {isAdmin ? 'Admin Live Alerts' : 'Order Status Updates'}
                </span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold bg-[#7C3AED] text-white px-2 py-0.5 rounded-full shadow-2xs">
                  {unreadCount} {isAdmin ? 'Alerts' : 'Active'}
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs font-semibold text-slate-400">
                  {isAdmin ? 'No pending customer live agent requests.' : 'No recent order status updates.'}
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={isAdmin ? '/admin/chat' : '/requests'}
                    onClick={() => setIsOpen(false)}
                    className="p-3.5 flex items-start gap-3 hover:bg-purple-50/60 transition-colors block text-left"
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.status === 'LIVE_AGENT_REQUEST' ? (
                        <div className="p-1.5 rounded-xl bg-red-100 text-red-600 animate-pulse">
                          <MessageSquare size={15} />
                        </div>
                      ) : n.status === 'COMPLETED' ? (
                        <div className="p-1.5 rounded-xl bg-green-100 text-green-600">
                          <CheckCircle2 size={15} />
                        </div>
                      ) : n.status === 'PROCESSING' ? (
                        <div className="p-1.5 rounded-xl bg-purple-100 text-[#7C3AED]">
                          <Clock size={15} className="animate-spin" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-xl bg-purple-100 text-[#7C3AED]">
                          <AlertCircle size={15} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex justify-between items-center text-xs gap-1">
                        <span className="font-mono font-bold text-[#7C3AED] truncate">{n.brandedId}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0 ${
                          n.status === 'LIVE_AGENT_REQUEST' ? 'bg-red-100 text-red-700 border border-red-200' :
                          n.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' :
                          n.status === 'PROCESSING' ? 'bg-purple-100 text-[#7C3AED] border border-purple-200' : 'bg-purple-100 text-[#7C3AED] border border-purple-200'
                        }`}>
                          {n.status === 'LIVE_AGENT_REQUEST' ? 'AGENT NEEDED' : n.status === 'AWAITING_CUSTOMER_VISIT' ? 'VISIT' : n.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{n.title}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 text-center">
              <Link
                href={isAdmin ? '/admin/chat' : '/requests'}
                onClick={() => setIsOpen(false)}
                className="text-xs text-[#7C3AED] font-extrabold hover:underline inline-flex items-center gap-1.5"
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
