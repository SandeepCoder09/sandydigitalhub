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
  X,
  ShieldCheck,
  ChevronRight,
  Building2,
  Megaphone,
  Bell
} from "lucide-react";
import { AdminNotificationCenter } from "./AdminNotificationCenter";

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

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

  const navGroups: NavGroup[] = [
    {
      title: "OVERVIEW",
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { href: '/admin/analytics', label: 'Visitor Analytics', icon: BarChart3 },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { href: '/admin/partners', label: 'Partner Centers', icon: Building2 },
        { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingBag },
        { href: '/admin/uploads', label: 'User Uploads', icon: FolderCheck },
        { href: '/admin/services', label: 'Manage Services', icon: Wrench },
        { href: '/admin/chat', label: 'Live Support Chat', icon: MessageSquare, badge: chatAlertCount },
      ]
    },
    {
      title: "PEOPLE",
      items: [
        { href: '/admin/users', label: 'Manage Users', icon: Users },
      ]
    },
    {
      title: "SYSTEM & CONTROL",
      items: [
        { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
        { href: '/admin/notifications', label: 'Notification Center', icon: Bell },
        { href: '/admin/site-control', label: 'Site & Page Control', icon: ShieldAlert },
        { href: '/admin/security-logs', label: 'Security Audit Logs', icon: AlertOctagon },
        { href: '/account', label: 'My Admin Account', icon: User },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Single Unified Navbar (< lg) */}
      <div className="block lg:hidden sticky top-0 z-30 mb-2">
        <div className="bg-[#111318] px-3.5 py-2.5 border-b border-[#2B3038] shadow-md flex items-center justify-between text-white">
          {/* Brand Logo & Name */}
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-xs shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black tracking-tight truncate">Sandy Digital Hub</div>
              <div className="text-[9px] font-bold text-violet-400 uppercase tracking-widest">Admin Console</div>
            </div>
          </Link>

          {/* Quick Actions & Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <AdminNotificationCenter />
            
            <Link
              href="/account"
              className="w-7 h-7 rounded-xl bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs"
              title="Admin Profile"
            >
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl bg-[#181B21] border border-[#2B3038] text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="bg-[#111318] border-b border-[#2B3038] p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1">
                  {group.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-violet-600/20 text-violet-200 border border-violet-500/40 font-bold'
                            : 'text-gray-400 hover:text-white hover:bg-[#181B21]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={15} className={isActive ? 'text-violet-400' : 'text-gray-400'} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Vertical Graphite Sidebar (>= lg) */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111318] border-r border-[#2B3038] min-h-screen text-slate-300 transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20 p-3' : 'w-[260px] p-5'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#2B3038]/80">
          {!isCollapsed && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-white tracking-tight truncate">Sandy Digital Hub</h2>
                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Admin Console</div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mx-auto">
              <ShieldCheck size={20} />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#181B21] transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? "Expand Sidebar Menu" : "Collapse Sidebar Menu"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} className="text-violet-400" /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto space-y-6 no-scrollbar pr-1">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && (
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1">
                  {group.title}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={`group relative flex items-center ${
                        isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                      } rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-violet-600/15 text-violet-200 font-extrabold border border-violet-500/30 shadow-xs'
                          : 'text-gray-400 hover:text-slate-100 hover:bg-[#181B21]'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#7C3AED]" />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={18}
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-violet-400' : 'text-gray-400 group-hover:text-slate-200'
                          }`}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && item.badge > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[10px] animate-pulse">
                          🚨 {item.badge}
                        </span>
                      ) : null}

                      {isCollapsed && item.badge && item.badge > 0 ? (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-[#111318]" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Admin User Card */}
        <div className="pt-4 mt-auto border-t border-[#2B3038]/80">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#181B21] border border-[#2B3038]">
              <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-white truncate">{session?.user?.name || 'Admin'}</div>
                <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>Online System Admin</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs mx-auto" title={session?.user?.name || 'Admin'}>
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
