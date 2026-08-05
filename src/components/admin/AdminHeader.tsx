'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Shield, Bell, User, LogOut, Search, ChevronRight, CheckCircle2,
  ExternalLink, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminCommandPalette } from './AdminCommandPalette';
import { AdminNotificationCenter } from './AdminNotificationCenter';

export function AdminHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getBreadcrumbTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard Overview';
    if (path.startsWith('/admin/orders')) return 'Manage Customer Orders';
    if (path.startsWith('/admin/users')) return 'Manage Registered Users';
    if (path.startsWith('/admin/services')) return 'Manage Services Catalog';
    if (path.startsWith('/admin/uploads')) return 'User Uploads Inspector';
    if (path.startsWith('/admin/site-control')) return 'Site & Page Control';
    if (path.startsWith('/admin/security-logs')) return 'Security Audit Logs';
    if (path.startsWith('/admin/analytics')) return 'Visitor Analytics & Metrics';
    if (path.startsWith('/admin/chat')) return 'Live Customer Support Chat';
    return 'Admin Control Center';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-2xs h-[60px] flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        {/* Breadcrumb / Page Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
            <Shield size={14} className="text-violet-600" />
            <span>Admin</span>
            <ChevronRight size={13} className="text-gray-400" />
          </div>
          <h1 className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
            {getBreadcrumbTitle(pathname || '/admin')}
          </h1>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Command Palette (⌘K) */}
          <AdminCommandPalette />

          {/* Admin Notification Center Drawer */}
          <AdminNotificationCenter />
          {/* Public Website Preview Link */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-violet-50 text-gray-600 hover:text-violet-700 text-xs font-bold transition-all border border-gray-200"
            title="View Public Website"
          >
            <span>Live Website</span>
            <ExternalLink size={13} />
          </Link>

          {/* System Health Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Active</span>
          </div>

          {/* Admin Profile Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {session?.user?.name || 'Administrator'}
                </div>
                <div className="text-[10px] font-black text-violet-600 uppercase tracking-wider">
                  {session?.user?.role || 'ADMIN'}
                </div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50 animate-in fade-in duration-150 space-y-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-xs font-extrabold text-gray-900 truncate">
                    {session?.user?.name || 'Super Admin'}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium truncate">
                    {session?.user?.email || 'admin@sandydigitalhub.com'}
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  <User size={15} />
                  <span>My Admin Profile</span>
                </Link>

                <Link
                  href="/admin/site-control"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  <Shield size={15} />
                  <span>Security & Control</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out of Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
