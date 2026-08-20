'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowUpRight, ShieldCheck, Code2 } from 'lucide-react';

export function BrandSwitcherBanner() {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio') || pathname === '/portfolio';
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80 py-2 px-4 sm:px-6 relative z-30 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Ecosystem Label */}
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
          <span className="hidden sm:inline font-bold text-white uppercase tracking-wider text-[10px]">
            Sandy Digital Ecosystem:
          </span>
          <span>Switch between our Citizen Service Hub and Technology Studio</span>
        </div>

        {/* Right: Dual Brand Quick Toggles */}
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-900 rounded-full border border-slate-800 shrink-0">
          <Link
            href="/"
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-all ${
              !isStudio
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck size={12} className={!isStudio ? 'text-white' : 'text-purple-400'} />
            <span>SARA DIGITAL HUB</span>
          </Link>

          <Link
            href="/studio"
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-all ${
              isStudio
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 size={12} className={isStudio ? 'text-white' : 'text-indigo-400'} />
            <span>SANDY DIGITAL STUDIO</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-white/20 text-white font-black uppercase">
              Tech
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
