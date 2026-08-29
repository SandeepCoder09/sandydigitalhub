'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, Wrench, PackageCheck, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';

interface MobileBottomNavProps {
  session: any;
}

export function MobileBottomNav({ session }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hide mobile bottom nav on /admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Zap, isBadge: true },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Track', path: '/track-order', icon: PackageCheck, isLive: true },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          MOBILE BOTTOM NAVIGATION DOCK (lg:hidden)
      ───────────────────────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-5 gap-1.5 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-50/95 border border-[#7C3AED] text-[#7C3AED] shadow-2xs'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:text-[#7C3AED] hover:border-purple-200 shadow-2xs active:scale-95'
                }`}
              >
                <div className="relative">
                  <Icon size={17} className={isActive ? 'stroke-[2.5] text-[#7C3AED]' : 'stroke-[2] text-slate-600'} />

                  {/* Live Pulse Dot for Track */}
                  {item.isLive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 border border-white"></span>
                    </span>
                  )}
                </div>

                <span className={`text-[9.5px] tracking-tight mt-0.5 leading-none ${isActive ? 'font-black text-[#7C3AED]' : 'font-bold text-slate-700'}`}>
                  {item.label === 'Track Order' ? 'Track' : t(item.label, item.label)}
                </span>
              </Link>
            );
          })}

          {/* ☰ Menu Button to Open Full Mobile Navigation Drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:text-[#7C3AED] hover:border-purple-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
            aria-label="Open Full Menu"
          >
            <Menu size={17} className="stroke-[2] text-slate-700" />
            <span className="text-[9.5px] font-bold text-slate-700 tracking-tight mt-0.5 leading-none">
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Controlled or Triggered) */}
      <MobileNavDrawer
        session={session}
        controlledOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        hideTrigger={true}
      />
    </>
  );
}
