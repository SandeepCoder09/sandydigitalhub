'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, AlertTriangle, Wrench, ShieldAlert, Zap, Megaphone } from 'lucide-react';

interface ActiveAnnouncement {
  _id: string;
  title: string;
  body: string;
  type: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  pinned: boolean;
}

const DISMISSED_KEY = 'sdh_dismissed_announcements';

function getDismissed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveDismissed(ids: string[]) {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(ids));
  } catch {}
}

function getBannerStyle(type: string, priority: string) {
  if (priority === 'URGENT' || type === 'SECURITY_NOTICE') {
    return {
      bg: 'bg-red-600',
      text: 'text-white',
      icon: ShieldAlert,
      label: '🔴 URGENT',
    };
  }
  if (type === 'MAINTENANCE') {
    return {
      bg: 'bg-amber-500',
      text: 'text-white',
      icon: Wrench,
      label: '🔧 Maintenance',
    };
  }
  if (priority === 'HIGH') {
    return {
      bg: 'bg-orange-500',
      text: 'text-white',
      icon: AlertTriangle,
      label: '⚠️ Important',
    };
  }
  if (type === 'NEW_FEATURE' || type === 'PLATFORM_UPDATE') {
    return {
      bg: 'bg-violet-600',
      text: 'text-white',
      icon: Zap,
      label: '✨ New',
    };
  }
  return {
    bg: 'bg-slate-800',
    text: 'text-white',
    icon: Megaphone,
    label: '📢 Notice',
  };
}

export function AnnouncementBanner() {
  const { data: session } = useSession();
  const [banners, setBanners] = useState<ActiveAnnouncement[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    setDismissed(getDismissed());
  }, []);

  useEffect(() => {
    if (!session?.user) return;

    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/notifications?limit=5');
        if (res.ok) {
          const data = await res.json();
          const pinned = (data.notifications || []).filter(
            (n: any) => n.isAnnouncement && n.pinned && !n.isRead
          );
          setBanners(pinned);
        }
      } catch {}
    };

    fetchBanners();
  }, [session]);

  const dismiss = async (id: string) => {
    const rawId = id.replace('ann-', '');
    const updated = [...dismissed, id];
    setDismissed(updated);
    saveDismissed(updated);
    setBanners((prev) => prev.filter((b) => `ann-${b._id}` !== id && b._id !== rawId));

    // Mark as read on server
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id.startsWith('ann-') ? id : `ann-${id}`] }),
      });
    } catch {}
  };

  const visible = banners.filter((b) => !dismissed.includes(`ann-${b._id}`) && !dismissed.includes(b._id));

  if (visible.length === 0) return null;

  // Show the highest priority banner only (avoid stacking)
  const top = visible[0];
  const style = getBannerStyle(top.type, top.priority);
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.text} w-full px-4 py-2.5 flex items-center justify-between gap-4 text-sm shadow-sm`}
      role="alert"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <Icon size={15} className="shrink-0" />
          <span className="text-[11px] font-black uppercase tracking-wider opacity-90">{style.label}</span>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-xs">{top.title}</span>
          {top.body && (
            <span className="text-[11px] opacity-80 ml-2 hidden sm:inline truncate">— {top.body}</span>
          )}
        </div>
      </div>

      {visible.length > 1 && (
        <span className="text-[10px] font-bold opacity-70 shrink-0 hidden sm:block">
          +{visible.length - 1} more
        </span>
      )}

      <button
        onClick={() => dismiss(top._id)}
        className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss announcement"
      >
        <X size={15} />
      </button>
    </div>
  );
}
