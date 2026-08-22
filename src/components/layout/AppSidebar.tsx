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
  ShoppingBag,
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

const hubMainNavItems: NavItem[] = [
  { key: 'Home', label: 'Hub Home', path: '/', icon: Home },
  { key: 'Services', label: 'Services Catalog', path: '/services', icon: Zap },
  { key: 'My Requests', label: 'My Requests', path: '/requests', icon: ShoppingBag },
  { key: 'Track Order', label: 'Track Request', path: '/track-order', icon: PackageCheck, badge: { text: 'LIVE', variant: 'green' } },
  { key: 'Tools', label: 'Free Digital Tools', path: '/tools', icon: Wrench },
  { key: 'Checklist', label: 'Doc Checklist', path: '/document-checklist', icon: FileCheck },
  { key: 'Calculator', label: 'Price Calculator', path: '/calculator', icon: Calculator },
];

const hubSecondaryNavItems: NavItem[] = [
  { key: 'Studio', label: 'Sandy Digital Studio', path: '/studio', icon: Briefcase },
  { key: 'Partners', label: 'Partner Network', path: '/partners', icon: Compass },
  { key: 'Support', label: 'Support & Help', path: '/support', icon: PhoneCall },
  { key: 'Reviews', label: 'Verified Reviews', path: '/reviews', icon: Star },
];

const studioMainNavItems: NavItem[] = [
  { key: 'Studio Home', label: 'Studio Overview', path: '/studio', icon: Briefcase },
  { key: 'Studio Services', label: 'Tech & App Services', path: '/studio#services', icon: Zap },
  { key: 'Portfolio', label: 'Featured Portfolio', path: '/portfolio', icon: Layers },
  { key: 'Pricing', label: 'Studio Packages', path: '/pricing', icon: Tag },
  { key: 'Calculator', label: 'Project Calculator', path: '/calculator', icon: Calculator },
  { key: 'Start Project', label: 'Start a Project', path: '/studio#quote', icon: FileCheck, badge: { text: 'QUOTE', variant: 'green' } },
];

const studioSecondaryNavItems: NavItem[] = [
  { key: 'Sara Hub', label: '← SARA Digital Hub', path: '/', icon: Home },
  { key: 'Support', label: 'Support Ticket Center', path: '/support', icon: PhoneCall },
  { key: 'Status', label: 'Platform Status', path: '/status', icon: Zap },
  { key: 'Contact', label: 'Contact Studio Team', path: '/contact', icon: PhoneCall },
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

  const isStudio = pathname?.startsWith('/studio');

  const renderNavList = (items: NavItem[]) => {
    return (
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
          const translatedLabel = t(item.key, item.label);

          if (isCollapsed) {
            return (
              <li key={item.path} className="flex justify-center">
                <Link
                  href={item.path}
                  title={translatedLabel}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative ${
                    isActive
                      ? 'bg-purple-50 text-[#7C3AED] border border-purple-200/80 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={18} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />

                  {/* Active dot indicator */}
                  {item.badge?.variant === 'green' && !isActive && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
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
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] transition-all ${
                  isActive
                    ? 'bg-purple-50/90 text-[#7C3AED] font-semibold border-l-[3px] border-[#7C3AED] pl-2.5 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/90 font-medium'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={17}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-[#7C3AED] stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-700 stroke-[1.8]'
                    }`}
                  />
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
                      className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        item.badge.variant === 'purple'
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : item.badge.variant === 'green'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-amber-50 text-amber-800 border border-amber-200/80'
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
        isCollapsed ? 'w-[72px]' : 'w-[272px]'
      } bg-white border-r border-slate-200/80 shadow-[1px_0_3px_rgba(0,0,0,0.02)] z-40 flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out select-none`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP BRAND HEADER & COLLAPSE TOGGLE BUTTON
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`h-[72px] px-4 border-b border-slate-100 bg-white flex items-center ${
          isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'
        } shrink-0`}
      >
        {isCollapsed ? (
          <>
            <Link
              href="/"
              className="w-9 h-9 rounded-xl overflow-hidden hover:scale-105 transition-transform shrink-0 flex items-center justify-center"
              aria-label="Sandy Digital Hub"
              title="Sandy Digital Hub"
            >
              <Image src="/icon.svg" alt="SDH" width={36} height={36} className="w-full h-full object-contain" />
            </Link>
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Expand Sidebar"
              title="Expand Sidebar"
            >
              <PanelLeftOpen size={15} />
            </button>
          </>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image src="/icon.svg" alt="SDH" width={36} height={36} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-black tracking-tight text-slate-900 leading-none">
                  SANDY
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#7C3AED] leading-tight mt-0.5">
                  DIGITAL HUB
                </span>
              </div>
            </Link>
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Collapse Sidebar"
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. WORKSPACE CONTEXT & SCROLLABLE NAVIGATION
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
        {/* Workspace Context Selector */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/70 text-left">
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-slate-400">
              CURRENT WORKSPACE
            </div>
            <div className="text-[12.5px] font-bold text-slate-800 truncate mt-0.5">
              {isStudio ? 'SANDY DIGITAL STUDIO' : 'SARA DIGITAL HUB'}
            </div>
            <div className="text-[10.5px] text-slate-500 truncate">
              {isStudio ? 'Web, App & Tech Solutions' : 'Citizen & Document Services'}
            </div>
          </div>
        )}

        {/* Primary Navigation Group */}
        <div>
          {!isCollapsed && (
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              {isStudio ? 'Studio Services' : 'Hub Services'}
            </div>
          )}
          {renderNavList(isStudio ? studioMainNavItems : hubMainNavItems)}
        </div>

        {/* Secondary / Ecosystem Switch Group */}
        <div>
          {!isCollapsed ? (
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              {isStudio ? 'Citizen Portal' : 'Technology Studio'}
            </div>
          ) : (
            <div className="w-6 h-px bg-slate-200 mx-auto my-2" />
          )}
          {renderNavList(isStudio ? studioSecondaryNavItems : hubSecondaryNavItems)}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM UTILITY ACTIONS & USER PROFILE
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`p-3 border-t border-slate-100 bg-white shrink-0 ${
          isCollapsed ? 'flex flex-col items-center gap-2.5' : 'space-y-2'
        }`}
      >
        {/* Compact Utility Row (Language, Notifications, Cart) */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-slate-50/90 border border-slate-200/70">
            <LanguageNavToggle placement="up" />
            <div className="h-3.5 w-px bg-slate-200" />
            <NotificationBell placement="up" />
            <div className="h-3.5 w-px bg-slate-200" />
            <CartDrawer />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
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
              title="My Account"
              className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shadow-xs hover:scale-105 transition-transform"
            >
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          ) : (
            <UserNavMenu user={session.user} placement="up" fullWidth={true} />
          )
        ) : isCollapsed ? (
          <Link
            href="/login"
            title="Login"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] flex items-center justify-center text-xs font-semibold transition-colors"
            aria-label="Login"
          >
            <LogIn size={15} />
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Link href="/login" className="w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all h-8.5"
              >
                <LogIn size={13} className="mr-1" /> Login
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button
                size="sm"
                className="w-full text-xs font-semibold rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs transition-all h-8.5"
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
