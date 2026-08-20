'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Palette,
  ExternalLink,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  LogOut,
  Building2,
  PhoneCall,
  Lock
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export function PartnerSidebar({ partner }: { partner?: any }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const centerName = partner?.name || 'Partner Center';
  const partnerSlug = partner?.slug || '';
  const primaryColor = partner?.branding?.primaryColor || '#7C3AED';

  const navItems = [
    { href: '/partner/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/partner/requests', label: 'Service Requests', icon: ShoppingBag },
    { href: '/partner/staff', label: 'Center Staff', icon: Users },
    { href: '/partner/branding', label: 'Branding & Profile', icon: Palette },
  ];

  return (
    <>
      {/* Mobile Top Bar (< lg) */}
      <div className="block lg:hidden mb-6">
        <div className="bg-[#111318] p-4 rounded-2xl border border-[#2B3038] shadow-lg flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              {centerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight truncate max-w-[180px]">{centerName}</div>
              <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Partner Dashboard</div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#181B21] border border-[#2B3038] text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Slide Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 bg-[#111318] border border-[#2B3038] rounded-2xl p-4 space-y-2 shadow-2xl animate-in fade-in duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-200 border border-violet-500/40 font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#181B21]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-violet-400' : 'text-gray-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {partnerSlug && (
              <Link
                href={`/center/${partnerSlug}`}
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-violet-300 bg-violet-950/40 border border-violet-800"
              >
                <span>View Public Center</span>
                <ExternalLink size={13} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop Vertical Sidebar (>= lg) */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111318] border-r border-[#2B3038] min-h-screen text-slate-300 transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-20 p-3' : 'w-[260px] p-5'
        }`}
      >
        {/* Sidebar Header: Center Identity */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-[#2B3038]/80">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                {centerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-white tracking-tight truncate">{centerName}</h2>
                <div className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Partner Console</div>
              </div>
            </div>
          ) : (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs mx-auto shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              {centerName.charAt(0).toUpperCase()}
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#181B21] transition-colors cursor-pointer ml-auto"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <PanelLeftOpen size={18} className="text-violet-400" /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
          {navItems.map((item) => {
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
                {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#7C3AED]" />}

                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-violet-400' : 'text-gray-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}

          {/* Public Link Shortcut */}
          {partnerSlug && !isCollapsed && (
            <div className="pt-4">
              <Link
                href={`/center/${partnerSlug}`}
                target="_blank"
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-800/60 text-xs font-black text-violet-300 hover:text-white transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink size={14} />
                  <span>View Public Center</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900 text-white font-bold">LIVE</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer User & Logout */}
        <div className="pt-4 mt-auto border-t border-[#2B3038]/80 space-y-2">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#181B21] border border-[#2B3038]">
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white truncate">
                  {session?.user?.name || 'Partner Admin'}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold truncate">{session?.user?.email}</div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#20242B] transition-colors"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-8 h-8 rounded-lg bg-[#181B21] text-slate-400 hover:text-rose-400 flex items-center justify-center mx-auto"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
