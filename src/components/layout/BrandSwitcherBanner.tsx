'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Code2 } from 'lucide-react';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function BrandSwitcherBanner() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio') || pathname === '/portfolio';
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <nav aria-label="Brand Ecosystem Switcher" className="w-full bg-slate-950 text-slate-300 text-xs border-b border-slate-800/90 py-2 px-3.5 sm:px-6 relative z-30 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        {/* Left: Ecosystem Indicator & Explainer */}
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 text-center sm:text-left">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse shrink-0" />
          <span className="font-black text-white uppercase tracking-wider text-[10px]">
            SANDY DIGITAL ECOSYSTEM:
          </span>
          <span className="hidden sm:inline text-slate-400">
            Switch between Citizen Service Hub and Technology Studio
          </span>
        </div>

        {/* Right: Dual Brand Segmented Switcher, Notifications & Cart */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0 shadow-inner">
            <Link
              href="/"
              className={`px-3 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all duration-200 ${
                !isStudio
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-900/40 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <ShieldCheck size={13} className={!isStudio ? 'text-white' : 'text-purple-400'} />
              <span>SANDY DIGITAL HUB</span>
            </Link>

            <Link
              href="/studio"
              className={`px-3 py-1 rounded-xl text-[11px] font-black flex items-center gap-1.5 transition-all duration-200 ${
                isStudio
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-900/40 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Code2 size={13} className={isStudio ? 'text-white' : 'text-indigo-400'} />
              <span>SARA DIGITAL STUDIO</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/20 text-white font-black uppercase tracking-wider">
                TECH
              </span>
            </Link>
          </div>

          {/* Top-Right Notification Center Bell & Cart Drawer (Desktop only - Mobile has them in the top navbar) */}
          <div className="hidden lg:flex items-center gap-2">
            <NotificationBell placement="down" align="right" theme="dark" />
            <CartDrawer theme="dark" />
          </div>
        </div>
      </div>
    </nav>
  );
}
