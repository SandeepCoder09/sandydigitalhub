'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Wrench,
  Users,
  MessageSquare,
  User,
  FolderCheck,
  ShieldAlert,
  BarChart3,
  AlertOctagon,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [chatAlertCount, setChatAlertCount] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!session?.user || session.user.role !== 'ADMIN') return;

    let intervalId: NodeJS.Timeout | null = null;

    const fetchChatAlerts = async () => {
      if (document.hidden) return;

      try {
        const res = await fetch('/api/admin/chat');
        if (res.ok) {
          const data = await res.json();
          setChatAlertCount(data.alertCount || 0);
        } else if (res.status === 401 || res.status === 403) {
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Error fetching admin chat alerts:', error);
      }
    };

    fetchChatAlerts();
    intervalId = setInterval(fetchChatAlerts, 15000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [session]);

  const links = [
    { href: '/admin', label: 'Dashboard', mobileLabel: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/analytics', label: 'Visitor Analytics', mobileLabel: 'Analytics', icon: BarChart3 },
    { href: '/admin/orders', label: 'Manage Orders', mobileLabel: 'Orders', icon: ShoppingBag },
    { href: '/admin/site-control', label: 'Site & Page Control', mobileLabel: 'Control', icon: ShieldAlert },
    { href: '/admin/security-logs', label: 'Security Audit Logs', mobileLabel: 'Security Logs', icon: AlertOctagon },
    { href: '/admin/uploads', label: 'User Uploads', mobileLabel: 'Uploads', icon: FolderCheck },
    { href: '/admin/services', label: 'Manage Services', mobileLabel: 'Services', icon: Wrench },
    { href: '/admin/users', label: 'Manage Users', mobileLabel: 'Users', icon: Users },
    { href: '/admin/chat', label: 'Live Support Chat', mobileLabel: 'Live Chat', icon: MessageSquare, badge: chatAlertCount },
    { href: '/account', label: 'My Account', mobileLabel: 'Account', icon: User },
  ];

  return (
    <>
      {/* Mobile Top Toggle Navigation (< md) */}
      <div className="block md:hidden mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-gray-900 text-base">
              <ShieldAlert size={18} className="text-[#FF4500]" />
              <span>Admin Panel Menu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              <span>{mobileMenuOpen ? 'Close Menu' : 'Toggle Menu'}</span>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold pt-2 border-t border-gray-100">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all text-center w-full relative ${
                      isActive
                        ? 'bg-[#FF4500] text-white shadow-md font-bold'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span className="truncate">{link.mobileLabel}</span>
                    {link.badge && link.badge > 0 ? (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold animate-pulse ring-2 ring-white">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Vertical Collapsible Sidebar (>= md) */}
      <div
        className={`hidden md:block bg-white p-5 rounded-3xl border border-gray-200 shadow-sm transition-all duration-300 h-fit shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
          {!isCollapsed && <h2 className="text-xl font-black text-gray-900">Admin Panel</h2>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors mx-auto cursor-pointer"
            title={isCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} className="text-[#FF4500]" /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                title={isCollapsed ? link.label : undefined}
                className={`inline-flex items-center ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-2.5'
                } rounded-2xl text-sm font-bold transition-all relative ${
                  isActive
                    ? 'text-[#FF4500] bg-orange-50 font-extrabold border border-orange-200 shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{link.label}</span>}
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse shadow-md ${
                    isCollapsed ? 'absolute -top-1 -right-1 text-[9px] p-1' : 'text-[10px]'
                  }`}>
                    {isCollapsed ? link.badge : `🚨 ${link.badge}`}
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
