'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Home,
  Zap,
  PackageCheck,
  Wrench,
  FileCheck,
  Calculator,
  Briefcase,
  Star,
  Tag,
  PhoneCall,
  LogIn,
  UserPlus,
  Compass,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSidebar } from '@/context/SidebarContext';
import { LanguageNavToggle } from '@/components/layout/LanguageNavToggle';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { UserNavMenu } from '@/components/layout/UserNavMenu';
import { Button } from '@/components/ui/button';

interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: any;
  badge?: {
    text: string;
    variant: 'purple' | 'green' | 'amber';
  };
}

const mainNavItems: NavItem[] = [
  { key: 'Home', label: 'Home', path: '/', icon: Home },
  { key: 'Services', label: 'Services', path: '/services', icon: Zap, badge: { text: 'FAST', variant: 'purple' } },
  { key: 'Track Order', label: 'Track Order', path: '/track-order', icon: PackageCheck, badge: { text: 'LIVE', variant: 'green' } },
  { key: 'Tools', label: 'Free Digital Tools', path: '/tools', icon: Wrench, badge: { text: 'FREE', variant: 'purple' } },
  { key: 'Checklist', label: 'Doc Checklist', path: '/document-checklist', icon: FileCheck },
  { key: 'Calculator', label: 'Price Calculator', path: '/calculator', icon: Calculator },
];

const secondaryNavItems: NavItem[] = [
  { key: 'Portfolio', label: 'Portfolio', path: '/portfolio', icon: Briefcase },
  { key: 'Reviews', label: 'Reviews', path: '/reviews', icon: Star, badge: { text: '4.9★', variant: 'amber' } },
  { key: 'Pricing', label: 'Pricing Plans', path: '/pricing', icon: Tag },
  { key: 'Contact', label: 'Contact & Support', path: '/contact', icon: PhoneCall },
];

interface AppSidebarProps {
  initialSession?: any;
}

export function AppSidebar({ initialSession }: AppSidebarProps = {}) {
  const pathname = usePathname();
  const { data: clientSession } = useSession();
  const session = clientSession || initialSession;
  const { t } = useLanguage();
  const { isCollapsed, toggleCollapse } = useSidebar();

  // Don't render public sidebar on /admin routes (admin has its own dedicated sidebar)
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const renderNavList = (items: NavItem[]) => {
    return (
      <ul className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
          const translatedLabel = t(item.key, item.label);

          if (isCollapsed) {
            return (
              <li key={item.path} className="flex justify-center">
                <Link
                  href={item.path}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all relative ${
                    isActive
                      ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-md shadow-purple-500/25 scale-105'
                      : 'bg-white text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50/70 border border-slate-200/90 hover:border-purple-300 shadow-2xs'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />

                  {/* Indicator Dot */}
                  {item.badge?.variant === 'green' && !isActive && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-50/90 text-[#7C3AED] border-2 border-[#7C3AED] shadow-xs'
                    : 'bg-white text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50/50 border border-slate-200/80 hover:border-purple-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                      isActive
                        ? 'bg-[#7C3AED] text-white shadow-xs'
                        : 'bg-slate-100 border border-slate-200/70 text-slate-600 group-hover:bg-purple-100 group-hover:text-[#7C3AED] group-hover:border-purple-200'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  <span className="truncate">{translatedLabel}</span>
                </div>

                {/* Badges */}
                {item.badge && (
                  <div className="flex items-center gap-1 shrink-0 ml-1.5">
                    {item.badge.variant === 'green' && (
                      <span className="relative flex h-2 w-2 mr-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        item.badge.variant === 'purple'
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : item.badge.variant === 'green'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge.text}
                    </span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside
      className={`hidden lg:flex fixed top-0 left-0 bottom-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-slate-50/70 backdrop-blur-2xl border-r border-slate-200/90 shadow-sm z-40 flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out select-none`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BRANDING & COLLAPSE TOGGLE BUTTON (Bordered)
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-4 border-b border-slate-200/80 bg-white flex items-center ${isCollapsed ? 'justify-center flex-col gap-2.5' : 'justify-between'} shrink-0`}>
        {isCollapsed ? (
          <>
            <Link href="/" className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/20 hover:scale-105 transition-transform shrink-0 flex items-center justify-center" aria-label="Sandy Digital Hub">
              <Image src="/icon.svg" alt="SDH" width={40} height={40} className="w-full h-full object-contain" />
            </Link>
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] transition-colors cursor-pointer border border-slate-200 hover:border-purple-200 shadow-2xs"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen size={16} />
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="flex items-center transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt="Sandy Digital Hub"
                width={180}
                height={52}
                className="h-10 sm:h-11 w-auto object-contain max-h-12"
                priority
              />
            </Link>
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] transition-colors cursor-pointer border border-slate-200 hover:border-purple-200 shadow-2xs"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose size={17} />
            </button>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CENTER SCROLLABLE NAVIGATION (Bordered Items)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5 custom-scrollbar">
        {/* Main Services Group */}
        <div>
          {!isCollapsed && (
            <div className="flex items-center justify-between px-2.5 py-1 mb-2 rounded-xl bg-slate-100/80 border border-slate-200/70">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers size={12} className="text-[#7C3AED]" />
                Main Services
              </span>
            </div>
          )}
          {renderNavList(mainNavItems)}
        </div>

        {/* Secondary / Explore Group */}
        <div>
          {!isCollapsed ? (
            <div className="flex items-center justify-between px-2.5 py-1 mb-2 rounded-xl bg-slate-100/80 border border-slate-200/70">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Compass size={12} className="text-[#7C3AED]" />
                Explore & More
              </span>
            </div>
          ) : (
            <div className="w-8 h-px bg-slate-200 mx-auto my-2" />
          )}
          {renderNavList(secondaryNavItems)}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM UTILITY & USER PROFILE CARD (Bordered)
      ───────────────────────────────────────────────────────────── */}
      <div className={`p-3 border-t border-slate-200/80 bg-white shrink-0 ${isCollapsed ? 'flex flex-col items-center gap-2.5' : 'space-y-2.5'}`}>
        {/* Utility Tools Row */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs">
            <LanguageNavToggle placement="up" />
            <div className="h-4 w-px bg-slate-200" />
            <NotificationBell placement="up" />
            <div className="h-4 w-px bg-slate-200" />
            <CartDrawer />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <LanguageNavToggle placement="up" compact={true} />
            <NotificationBell placement="up" />
            <CartDrawer />
          </div>
        )}

        {/* User Profile / Auth State */}
        {session?.user ? (
          isCollapsed ? (
            <Link
              href="/account"
              className="w-10 h-10 rounded-2xl bg-[#7C3AED] border border-purple-400 text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/20 hover:scale-105 transition-transform"
            >
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <UserNavMenu user={session.user} placement="up" fullWidth={true} />
          )
        ) : isCollapsed ? (
          <Link
            href="/login"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-[#7C3AED] hover:bg-purple-50 flex items-center justify-center text-xs font-black shadow-2xs transition-colors"
            aria-label="Login"
          >
            <LogIn size={16} />
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold rounded-xl border-slate-200 hover:bg-purple-50 hover:text-[#7C3AED] hover:border-purple-200 transition-all h-9"
              >
                <LogIn size={13} className="mr-1" /> Login
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button
                size="sm"
                className="w-full text-xs font-bold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-200 transition-all hover:scale-[1.02] h-9 border border-purple-500"
              >
                <UserPlus size={13} className="mr-1" /> Join
              </Button>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
