'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Wrench, Users, MessageSquare } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [chatAlertCount, setChatAlertCount] = useState<number>(0);

  useEffect(() => {
    fetchChatAlerts();
    const interval = setInterval(fetchChatAlerts, 5000); // Poll for live customer chat requests every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchChatAlerts = async () => {
    try {
      const res = await fetch('/api/admin/chat');
      if (res.ok) {
        const data = await res.json();
        setChatAlertCount(data.alertCount || 0);
      }
    } catch (error) {
      console.error('Error fetching admin chat alerts:', error);
    }
  };

  const links = [
    { href: '/admin', label: 'Dashboard', mobileLabel: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'Manage Orders', mobileLabel: 'Orders', icon: ShoppingBag },
    { href: '/admin/services', label: 'Manage Services', mobileLabel: 'Services', icon: Wrench },
    { href: '/admin/users', label: 'Manage Users', mobileLabel: 'Users', icon: Users },
    { href: '/admin/chat', label: 'Live Support Chat', mobileLabel: 'Live Chat', icon: MessageSquare, badge: chatAlertCount },
  ];

  return (
    <>
      {/* Mobile Top Navigation 2x2 Grid (< md) */}
      <div className="block md:hidden mb-6">
        <div className="bg-[#111111] p-3.5 rounded-2xl border border-white/10 space-y-2.5">
          <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider px-1">Admin Panel Navigation</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all text-center w-full relative ${
                    isActive
                      ? 'bg-[#FF7A00] text-white shadow-md font-bold'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate">{link.mobileLabel}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold animate-pulse ring-2 ring-black">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Vertical Sidebar (>= md) */}
      <div className="hidden md:block w-64 bg-[#111111] p-6 rounded-2xl border border-white/10 h-fit">
        <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#FF7A00] bg-white/5 font-bold border border-[#FF7A00]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{link.label}</span>
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse shadow-md">
                    🚨 {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
