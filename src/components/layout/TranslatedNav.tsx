'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Home, Zap, Briefcase, Tag, PhoneCall, Wrench, FileCheck, Calculator, PackageCheck, Star, ChevronDown, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type NavRoute = {
  key: string;
  path: string;
  icon: any;
  highlight?: 'blue' | 'green' | 'indigo';
};

// Primary routes on desktop (Services, Tools & Track Order are side-by-side next to each other!)
const primaryRoutes: NavRoute[] = [
  { key: 'Home',        path: '/',                         icon: Home },
  { key: 'Services',   path: '/services',                  icon: Zap, highlight: 'blue' },
  { key: 'Tools',      path: '/tools',                     icon: Wrench, highlight: 'indigo' },
  { key: 'Track Order',path: '/track-order',               icon: PackageCheck, highlight: 'green' },
];

// More dropdown routes (Checklist, Calculator, Portfolio, Reviews, Pricing, Contact)
const moreRoutes: NavRoute[] = [
  { key: 'Checklist',  path: '/document-checklist',        icon: FileCheck },
  { key: 'Calculator', path: '/calculator',                icon: Calculator },
  { key: 'Portfolio',  path: '/portfolio',                  icon: Briefcase },
  { key: 'Reviews',    path: '/reviews',                    icon: Star },
  { key: 'Pricing',    path: '/pricing',                   icon: Tag },
  { key: 'Contact',    path: '/contact',                   icon: PhoneCall },
];

const allRoutes: NavRoute[] = [...primaryRoutes, ...moreRoutes];

function MoreDropdown() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 whitespace-nowrap text-slate-700 hover:text-[#2563EB] transition-colors font-semibold cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-100"
      >
        <span>{t('More', 'More')}</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {moreRoutes.map((route) => {
            const RouteIcon = route.icon;
            return (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 transition-colors font-semibold"
              >
                <RouteIcon size={15} className="text-[#2563EB] shrink-0" />
                {t(route.key)}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Desktop nav links — primary items + highlighted key conversion items + "More" dropdown */
export function TranslatedNav({ mode }: { mode: 'desktop' | 'mobile' }) {
  const { t } = useLanguage();

  if (mode === 'desktop') {
    return (
      <>
        {primaryRoutes.map((route) => {
          const RouteIcon = route.icon;

          // ⚡ Highlighted: Services (Blue Pill)
          if (route.highlight === 'blue') {
            return (
              <Link
                key={route.path}
                href={route.path}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/80 hover:bg-blue-100 hover:border-[#2563EB] font-bold transition-all hover:scale-105 shadow-2xs shrink-0"
              >
                <Zap size={14} className="text-[#2563EB] fill-[#2563EB]/20 shrink-0 animate-pulse" />
                <span>{t(route.key)}</span>
              </Link>
            );
          }

          // 🛠️ Highlighted: Tools (Indigo Pill + FREE Badge)
          if (route.highlight === 'indigo') {
            return (
              <Link
                key={route.path}
                href={route.path}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 hover:border-indigo-300 font-bold transition-all hover:scale-105 shadow-2xs shrink-0"
              >
                <Sparkles size={14} className="text-indigo-600 shrink-0" />
                <span>{t(route.key)}</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-indigo-600 text-white rounded-md tracking-wider">
                  Free
                </span>
              </Link>
            );
          }

          // 📦 Highlighted: Track Order (Green Live Pulse Pill)
          if (route.highlight === 'green') {
            return (
              <Link
                key={route.path}
                href={route.path}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 hover:border-emerald-300 font-bold transition-all hover:scale-105 shadow-2xs shrink-0"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <PackageCheck size={14} className="text-emerald-600 shrink-0" />
                <span>{t(route.key)}</span>
              </Link>
            );
          }

          // Standard links (Home)
          return (
            <Link
              key={route.path}
              href={route.path}
              className="flex items-center gap-1 whitespace-nowrap transition-colors hover:text-[#2563EB] shrink-0 font-semibold text-slate-700"
            >
              <RouteIcon size={13} className="text-[#2563EB] shrink-0" />
              <span>{t(route.key)}</span>
            </Link>
          );
        })}
        <MoreDropdown />
      </>
    );
  }

  // Mobile mode — grid layout with key highlights
  return (
    <>
      {allRoutes.map((route) => {
        const RouteIcon = route.icon;

        let badgeStyle = "text-slate-800 bg-slate-50 hover:bg-blue-50 border-slate-100";
        if (route.highlight === 'blue') {
          badgeStyle = "text-[#2563EB] bg-blue-50/80 border-blue-200 font-extrabold";
        } else if (route.highlight === 'green') {
          badgeStyle = "text-emerald-700 bg-emerald-50/80 border-emerald-200 font-extrabold";
        } else if (route.highlight === 'indigo') {
          badgeStyle = "text-indigo-700 bg-indigo-50/80 border-indigo-200 font-extrabold";
        }

        return (
          <Link
            key={route.path}
            href={route.path}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all border shadow-sm ${badgeStyle}`}
          >
            {route.highlight === 'green' ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <RouteIcon size={16} className={route.highlight === 'indigo' ? "text-indigo-600" : route.highlight === 'blue' ? "text-[#2563EB]" : "text-[#2563EB]"} />
            )}
            <span>{t(route.key)}</span>
            {route.highlight === 'indigo' && (
              <span className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.5 bg-indigo-600 text-white rounded-md">
                Free
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}
