'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldAlert, Lock, AlertTriangle, RefreshCw, Home, PhoneCall, Eye, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface SiteSettings {
  isEmergencyLockdown: boolean;
  maintenanceMessage: string;
  allowFileUploads: boolean;
  blockedPages: string[];
}

interface PageGuardProps {
  children: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
  liveChat: ReactNode;
}

export function PageGuard({ children, navbar, footer, liveChat }: PageGuardProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false); // Default to false for instant non-blocking page renders
  const [refreshing, setRefreshing] = useState(false);
  const [previewAsUser, setPreviewAsUser] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'admin';

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/site-control', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        return data.settings;
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.warn('Site control fetch info:', error?.message || error);
      }
    } finally {
      setLoading(false);
    }
    return null;
  };

  useEffect(() => {
    fetchSettings();
  }, [pathname, isAdmin]);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    const updatedSettings = await fetchSettings();
    setRefreshing(false);

    if (updatedSettings && !updatedSettings.isEmergencyLockdown) {
      window.location.reload();
    }
  };

  const renderNormalPageLayout = (content: ReactNode) => (
    <>
      {navbar}
      <main className="flex-1">
        {content}
      </main>
      {footer}
      {liveChat}
    </>
  );

  // 1. Premium Branded High-Trust Loading Screen (Prevents any unstyled content flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Backlight Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-sm w-full bg-gray-900/80 border border-white/10 p-8 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-xl">
          {/* Logo & Animated Loader Ring */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#2563EB]/20 border-t-[#2563EB] animate-spin"></div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShieldCheck size={28} className="text-white" />
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-1.5">
            <div className="text-xs font-black uppercase text-[#2563EB] tracking-widest flex items-center justify-center gap-1.5">
              <span>SANDY DIGITAL HUB</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Verifying System Integrity</h2>
            <p className="text-xs text-gray-400 font-medium">Securing connection & checking firewall protocols...</p>
          </div>

          {/* Progress Indicator Bar */}
          <div className="space-y-2 pt-2">
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden border border-gray-700/50">
              <div className="bg-gradient-to-r from-[#2563EB] via-blue-400 to-amber-400 h-full rounded-full w-2/3 animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Security Check</span>
              <span className="text-[#2563EB]">256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If settings failed to load, fallback to normal page layout
  if (!settings) {
    return renderNormalPageLayout(children);
  }

  // Admin users on /admin routes can always access their dashboard
  if (isAdmin && pathname?.startsWith('/admin')) {
    return renderNormalPageLayout(children);
  }

  const isCurrentPageBlocked = Array.isArray(settings.blockedPages) && settings.blockedPages.some((blockedPath) => {
    if (!blockedPath || typeof blockedPath !== 'string') return false;
    const clean = blockedPath.trim();
    if (!clean) return false;
    if (clean === '/') return pathname === '/';
    return pathname === clean || pathname?.startsWith(clean + '/');
  });

  const shouldBlockAccess = (settings.isEmergencyLockdown || isCurrentPageBlocked);

  // If Admin is viewing public page while Lockdown or Route Block is active (and not previewing as user)
  if (isAdmin && shouldBlockAccess && !previewAsUser) {
    return (
      <>
        {/* Top Admin Security Notice Bar */}
        <div className="bg-red-600 text-white text-xs font-bold py-2.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md z-[99999] relative">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-yellow-300 animate-pulse shrink-0" />
            <span>
              <strong>ADMIN SECURITY NOTICE:</strong> {settings.isEmergencyLockdown ? 'Emergency Lockdown Mode IS ACTIVE' : `Page Route (${pathname}) IS BLOCKED`}. Regular visitors see the blocked screen without Navbar/Footer.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPreviewAsUser(true)}
              className="px-3 py-1 rounded-lg bg-white text-red-700 hover:bg-gray-100 font-extrabold text-xs inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Eye size={13} /> Preview Blocked Screen as User
            </button>
            <Link
              href="/admin/site-control"
              className="px-3 py-1 rounded-lg bg-red-950 hover:bg-black text-white font-extrabold text-xs inline-flex items-center gap-1 transition-all"
            >
              Manage Firewall Settings ↗
            </Link>
          </div>
        </div>
        {renderNormalPageLayout(children)}
      </>
    );
  }

  // 2. Emergency Lockdown Mode (Hides Navbar, Footer, and LiveChatWidget completely with smooth refresh)
  if (settings.isEmergencyLockdown) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 py-20 relative">
        {isAdmin && previewAsUser && (
          <button
            onClick={() => setPreviewAsUser(false)}
            className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold shadow-lg cursor-pointer z-[9999]"
          >
            Exit User Preview Mode
          </button>
        )}

        <div className="max-w-xl w-full bg-gray-800/90 border border-blue-500/30 p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl backdrop-blur-md">
          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-[#2563EB] border border-[#2563EB]/30 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10 animate-pulse">
            <ShieldAlert size={44} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider border border-red-500/30">
              🚨 Security Lockdown Mode
            </div>
            <h1 className="text-3xl font-black text-white">System Under Maintenance</h1>
            <p className="text-sm text-gray-300 leading-relaxed font-medium pt-2">
              {settings.maintenanceMessage || 'Sandy Digital Hub is currently undergoing critical security updates. Services will resume shortly.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-700 text-xs text-gray-400 space-y-1 text-left">
            <div className="font-bold text-gray-200">Need Urgent Assistance?</div>
            <p>Call Store Support: +91 8756454282 (Mon-Sat 10:00 AM - 8:00 PM)</p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRefreshStatus}
              disabled={refreshing}
              className="px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-extrabold text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Checking Status...' : 'Refresh Status'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Individual Page Route Block (Hides Navbar, Footer, and LiveChatWidget for blocked route)
  if (isCurrentPageBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20 relative">
        {isAdmin && previewAsUser && (
          <button
            onClick={() => setPreviewAsUser(false)}
            className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-extrabold shadow-lg cursor-pointer z-[9999]"
          >
            Exit User Preview Mode
          </button>
        )}

        <div className="max-w-lg w-full bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-[#2563EB] border border-blue-200 flex items-center justify-center mx-auto shadow-md">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <AlertTriangle size={14} className="text-amber-600" /> Page Restricted by Admin
            </div>
            <h1 className="text-2xl font-black text-gray-900">This Feature is Temporarily Paused</h1>
            <p className="text-sm text-gray-600 leading-relaxed font-medium pt-1">
              Access to this page (<span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">{pathname}</span>) has been temporarily disabled by Sandy Digital Hub administrators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-extrabold text-xs inline-flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all"
            >
              <Home size={15} /> Return to Home
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all border border-gray-300"
            >
              <PhoneCall size={15} /> Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return renderNormalPageLayout(children);
}
