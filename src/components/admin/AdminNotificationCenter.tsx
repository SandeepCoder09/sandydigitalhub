'use client';

import { useState } from 'react';
import { Bell, Check, Trash2, Filter, X, ShieldAlert, ShoppingBag, UserPlus, CreditCard, RefreshCw } from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'PAYMENT' | 'ORDER' | 'VERIFICATION' | 'CUSTOMER' | 'SERVICE' | 'SYSTEM';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export function AdminNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'PAYMENT' | 'ORDER'>('ALL');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      category: 'ORDER',
      title: 'New Service Request Placed',
      desc: 'Sandeep Sharma requested PF / EPFO Balance Withdrawal (SDH-20260805-8CC8)',
      time: '10 mins ago',
      read: false,
    },
    {
      id: '2',
      category: 'PAYMENT',
      title: 'Payment Confirmed (₹450)',
      desc: 'UPI Payment received for Order SDH-20260805-37DB via Razorpay',
      time: '25 mins ago',
      read: false,
    },
    {
      id: '3',
      category: 'CUSTOMER',
      title: 'New Customer Registered',
      desc: 'Rahul Kumar created an account (rahul.k@example.com)',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '4',
      category: 'SYSTEM',
      title: 'Security Firewall Active',
      desc: 'Automated firewall blocked unauthorized API attempt from 192.168.1.45',
      time: '3 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'PAYMENT') return n.category === 'PAYMENT';
    if (filter === 'ORDER') return n.category === 'ORDER';
    return true;
  });

  const getCategoryBadge = (category: NotificationItem['category']) => {
    switch (category) {
      case 'PAYMENT':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />;
      case 'ORDER':
        return <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />;
      case 'VERIFICATION':
        return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />;
      case 'CUSTOMER':
        return <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />;
      case 'SERVICE':
        return <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />;
      case 'SYSTEM':
      default:
        return <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />;
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
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Drawer Dropdown */}
      {isOpen && (
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
              <button
                onClick={markAllRead}
                className="text-[11px] font-bold text-violet-600 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-2 border-b border-gray-100 flex items-center gap-1 text-[11px] font-bold">
            {(['ALL', 'UNREAD', 'PAYMENT', 'ORDER'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-violet-600 text-white font-extrabold shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications Feed List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-gray-400">
                No notifications match filter.
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start justify-between gap-3 hover:bg-gray-50 transition-colors ${
                    !n.read ? 'bg-violet-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-1">{getCategoryBadge(n.category)}</div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-gray-900 truncate">
                        {n.title}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium line-clamp-2 mt-0.5">
                        {n.desc}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1">
                        {n.time}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-gray-300 hover:text-red-600 p-1 cursor-pointer shrink-0"
                    title="Delete Notification"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
