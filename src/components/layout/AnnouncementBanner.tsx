'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  X, Wrench, ShieldAlert, Zap, Megaphone, AlertTriangle,
  Package, ChevronRight, ChevronLeft, Sparkles,
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';

interface ActiveAnnouncement {
  id: string;
  _id?: string;
  title: string;
  body: string;
  type: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  pinned: boolean;
}

const DISMISSED_KEY = 'sdh_dismissed_announcements';

function getDismissed(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]'); }
  catch { return []; }
}
function saveDismissed(ids: string[]) {
  try { localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids)); } catch {}
}

// ── Per-type configuration — icons only, no emojis ──────────────────────────
const TYPE_CONFIG: Record<string, {
  icon: React.ElementType;
  badgeIcon: React.ElementType;
  bg: string;
  text: string;
  badgeBg: string;
  label: string;
}> = {
  SECURITY_NOTICE: {
    icon: ShieldAlert, badgeIcon: ShieldAlert,
    bg: 'from-red-700 to-red-600', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'SECURITY',
  },
  MAINTENANCE: {
    icon: Wrench, badgeIcon: Wrench,
    bg: 'from-amber-600 to-amber-500', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'MAINTENANCE',
  },
  NEW_FEATURE: {
    icon: Sparkles, badgeIcon: Sparkles,
    bg: 'from-violet-700 to-violet-500', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'NEW FEATURE',
  },
  PLATFORM_UPDATE: {
    icon: Zap, badgeIcon: Zap,
    bg: 'from-indigo-700 to-indigo-500', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'UPDATE',
  },
  NEW_SERVICE: {
    icon: Package, badgeIcon: Package,
    bg: 'from-emerald-700 to-emerald-500', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'NEW SERVICE',
  },
  URGENT: {
    icon: AlertTriangle, badgeIcon: AlertTriangle,
    bg: 'from-red-700 to-rose-600', text: 'text-white',
    badgeBg: 'bg-white/20', label: 'URGENT',
  },
  GENERAL: {
    icon: Megaphone, badgeIcon: Megaphone,
    bg: 'from-slate-800 to-slate-700', text: 'text-white',
    badgeBg: 'bg-white/15', label: 'NOTICE',
  },
};

function getConf(type: string, priority: string) {
  if (priority === 'URGENT') return TYPE_CONFIG.URGENT;
  return TYPE_CONFIG[type] || TYPE_CONFIG.GENERAL;
}

// ── Marquee CSS injected once ────────────────────────────────────────────────
const MARQUEE_STYLE = `
@keyframes sdh-marquee {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.sdh-marquee-track {
  display: flex;
  white-space: nowrap;
  animation: sdh-marquee 18s linear infinite;
  will-change: transform;
}
.sdh-marquee-track:hover {
  animation-play-state: paused;
}
.sdh-marquee-wrap {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
}
`;

function injectMarqueeStyle() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('sdh-marquee-style')) return;
  const tag = document.createElement('style');
  tag.id = 'sdh-marquee-style';
  tag.textContent = MARQUEE_STYLE;
  document.head.appendChild(tag);
}

// ── Component ────────────────────────────────────────────────────────────────

export function AnnouncementBanner() {
  const { data: session } = useSession();
  const { isCollapsed } = useSidebar();
  const [banners, setBanners] = useState<ActiveAnnouncement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    injectMarqueeStyle();
    setDismissed(getDismissed());
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    const load = async () => {
      try {
        const res = await fetch('/api/notifications?limit=10');
        if (!res.ok) return;
        const data = await res.json();
        const pinned = (data.notifications || [])
          .filter((n: any) => n.isAnnouncement && n.pinned && !n.isRead)
          .map((n: any) => ({
            id: n.id,
            _id: n.id.replace('ann-', ''),
            title: n.title,
            body: n.body,
            type: n.type || n.category || 'GENERAL',
            priority: n.priority || 'NORMAL',
            pinned: true,
          }));
        setBanners(pinned);
        setCurrentIdx(0);
      } catch {}
    };
    load();
  }, [session]);

  const dismiss = async (id: string) => {
    const updated = [...dismissed, id, `ann-${id}`, id.replace('ann-', '')];
    setDismissed(updated);
    saveDismissed(updated);
    setBanners((prev) => {
      const next = prev.filter(
        (b) => b.id !== id && b._id !== id && b.id !== `ann-${id}` && `ann-${b._id}` !== id
      );
      setCurrentIdx((i) => (next.length > 0 ? Math.min(i, next.length - 1) : 0));
      return next;
    });
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id.startsWith('ann-') ? id : `ann-${id}`] }),
      });
    } catch {}
  };

  const visible = banners.filter(
    (b) =>
      !dismissed.includes(b.id) &&
      !dismissed.includes(`ann-${b._id}`) &&
      !dismissed.includes(b._id || '')
  );

  if (visible.length === 0) return null;

  const idx = Math.min(currentIdx, visible.length - 1);
  const top = visible[idx];
  const conf = getConf(top.type, top.priority);
  const BadgeIcon = conf.badgeIcon;

  // Full ticker text: title — body (repeated for seamless loop)
  const tickerText = top.body
    ? `${top.title}   —   ${top.body}   ·   ·   ·   `
    : `${top.title}   ·   ·   ·   `;

  const sidebarLeft = isCollapsed ? 'lg:left-20' : 'lg:left-72';

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 ${sidebarLeft} z-50
          bg-gradient-to-r ${conf.bg} ${conf.text}
          transition-[left] duration-300 ease-in-out
          shadow-lg`}
        role="alert"
        aria-live="polite"
      >
        {/* ── Multi-banner nav (if more than 1) ── */}
        {visible.length > 1 && (
          <div className="flex items-center justify-between px-3 pt-1 gap-2">
            <span className="text-[10px] font-black opacity-60 tracking-widest uppercase">
              {idx + 1} / {visible.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentIdx((i) => (i - 1 + visible.length) % visible.length)}
                className="p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Previous announcement"
              >
                <ChevronLeft size={12} />
              </button>
              <div className="flex gap-1">
                {visible.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                    }`}
                    aria-label={`Go to announcement ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentIdx((i) => (i + 1) % visible.length)}
                className="p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Next announcement"
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── Main Banner Row ── */}
        <div className="flex items-center gap-0 pr-1">

          {/* Type Badge — always visible, fixed left */}
          <div className={`flex items-center gap-1.5 px-3 py-2.5 shrink-0 ${conf.badgeBg} border-r border-white/15`}>
            <BadgeIcon size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-black tracking-widest uppercase hidden sm:block">
              {conf.label}
            </span>
          </div>

          {/* Marquee ticker — full text scrolls right-to-left */}
          <div className="sdh-marquee-wrap flex-1 py-2.5 cursor-default">
            <div className="sdh-marquee-track">
              {/* Repeated 3× so the scroll feels seamless */}
              <span className="text-[12px] sm:text-[13px] font-bold px-8">
                {tickerText}
              </span>
              <span className="text-[12px] sm:text-[13px] font-bold px-8">
                {tickerText}
              </span>
              <span className="text-[12px] sm:text-[13px] font-bold px-8">
                {tickerText}
              </span>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => dismiss(top.id)}
            className="p-2 m-0.5 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer shrink-0 flex items-center justify-center"
            aria-label="Dismiss announcement"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Spacer — pushes page content below the fixed banner */}
      <div
        className={`shrink-0 ${visible.length > 1 ? 'h-14 sm:h-12' : 'h-10'}`}
        aria-hidden="true"
      />
    </>
  );
}
