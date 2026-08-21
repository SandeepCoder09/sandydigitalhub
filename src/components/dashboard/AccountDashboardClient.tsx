'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, ShieldCheck, ShoppingBag, PackageCheck, FileCheck,
  Lock, KeyRound, Bell, Globe, Headphones, MapPin, ExternalLink, ArrowRight,
  CheckCircle2, Clock, AlertCircle, Sparkles, MessageCircle, Star, LogOut,
  ChevronRight, RefreshCw, Layers, Wrench, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditProfileForm } from '@/components/dashboard/EditProfileForm';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { toast } from '@/components/ui/Toast';

interface AccountDashboardClientProps {
  user: {
    name: string;
    email: string;
    mobile?: string;
    role?: string;
    createdAt?: string;
  };
  stats: {
    totalOrders: number;
    processingOrders: number;
    completedOrders: number;
  };
}

export function AccountDashboardClient({ user, stats }: AccountDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'security' | 'preferences' | 'help'>('overview');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Preferences state
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [languagePref, setLanguagePref] = useState<'en' | 'hi'>('en');

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long', 'Password Too Short');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation password do not match', 'Password Mismatch');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Your account password has been updated securely.', 'Password Changed');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Failed to update password', 'Error');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred', 'Error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. USER PROFILE TELEMETRY BANNER (Modern App Header)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-0 pointer-events-none opacity-70" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div className="flex items-center gap-3.5 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 truncate">{user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-purple-100 text-[#7C3AED] border border-purple-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {isAdmin ? 'Super Admin' : 'Verified Customer'}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-y-1 gap-x-3">
                <span className="flex items-center gap-1"><Mail size={13} className="text-slate-400" /> {user.email}</span>
                {user.mobile && (
                  <span className="flex items-center gap-1"><Phone size={13} className="text-slate-400" /> {user.mobile}</span>
                )}
                {user.createdAt && (
                  <span className="text-slate-400 font-normal">· Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Link to Admin / Requests */}
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <Link href="/admin">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-10 px-4 shadow-sm shadow-purple-200 flex items-center gap-1.5 cursor-pointer">
                  <Shield size={14} /> Admin Console
                </Button>
              </Link>
            )}
            <Link href="/requests">
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50 text-xs font-bold rounded-xl h-10 px-4 flex items-center gap-1.5 cursor-pointer">
                <ShoppingBag size={14} /> My Requests ({stats.totalOrders})
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-5 border-t border-slate-100">
          <div className="bg-slate-50/90 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#7C3AED] flex items-center justify-center font-bold shrink-0">
              <ShoppingBag size={16} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">{stats.totalOrders}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Bookings</div>
            </div>
          </div>

          <div className="bg-slate-50/90 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">{stats.processingOrders}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">In Processing</div>
            </div>
          </div>

          <div className="bg-slate-50/90 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">{stats.completedOrders}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Ready / Done</div>
            </div>
          </div>

          <div className="bg-slate-50/90 border border-slate-200/80 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">Protected</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">256-Bit SSL</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION PILLS / TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Account Hub', icon: User },
          { id: 'services', label: 'My Services & Orders', icon: ShoppingBag, badge: stats.totalOrders > 0 ? `${stats.totalOrders}` : undefined },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'preferences', label: 'Preferences & Alerts', icon: Bell },
          { id: 'help', label: 'Help Desk & Support', icon: Headphones },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-[#7C3AED]'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TAB CONTENT PANELS
      ───────────────────────────────────────────────────────────── */}

      {/* TAB A: OVERVIEW / PROFILE */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Personal Information Box */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <User size={18} className="text-[#7C3AED]" /> Personal Profile
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Profile Settings</span>
            </div>

            <EditProfileForm user={{ name: user.name, email: user.email, mobile: user.mobile }} />
          </div>

          {/* Quick Services Shortcut Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">My Requested Services</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  Track ongoing government applications, download completed certificates, and inspect payment receipts.
                </p>
              </div>
              <Link href="/requests" className="block pt-1">
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-10 flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Requests Dashboard</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <PackageCheck size={20} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Track Any Order ID</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  Instant lookup for Branded Order IDs (e.g. SDH-2026...) without logging in.
                </p>
              </div>
              <Link href="/track-order" className="block pt-1">
                <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:text-[#7C3AED] hover:bg-purple-50 text-xs font-bold rounded-xl h-10 flex items-center justify-center gap-1.5">
                  <span>Launch Order Tracker</span>
                  <ExternalLink size={13} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: SERVICES & ORDERS */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">My Service Requests</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                View all your active & completed Jan Seva, Cyber, and Studio orders.
              </p>
            </div>
            <Link href="/requests">
              <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-9">
                View All ({stats.totalOrders})
              </Button>
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Document Checklist</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check mandatory documents required for PAN, Passport, Income, and Domicile.
              </p>
            </div>
            <Link href="/document-checklist">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 text-xs font-bold rounded-xl h-9 hover:text-[#7C3AED]">
                Explore Checklist
              </Button>
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <Wrench size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Free Tools Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant online image compressor, photo resizer, and PDF converter.
              </p>
            </div>
            <Link href="/tools">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 text-xs font-bold rounded-xl h-9 hover:text-[#7C3AED]">
                Launch Tools
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* TAB C: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Change Password Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <KeyRound size={18} className="text-[#7C3AED]" /> Change Account Password
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Ensure your account uses a strong, secure password.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 6 Characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-10 px-5 shadow-xs"
                >
                  {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Overview Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-600" /> Account Security Status
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>SSL Encryption</span>
                  <span className="font-bold text-emerald-600">256-Bit Active</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Customer Document Confidentiality</span>
                  <span className="font-bold text-emerald-600">Restricted Access</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span>Active Session</span>
                  <span className="font-bold text-[#7C3AED]">Signed In</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-5">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}

      {/* TAB D: PREFERENCES & NOTIFICATIONS */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Bell size={18} className="text-[#7C3AED]" /> Notification & Communication Settings
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Customize how and when you receive order notifications.</p>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between pt-3 first:pt-0">
              <div>
                <div className="font-bold text-slate-900 text-sm">WhatsApp Order Progress Updates</div>
                <div className="text-slate-500 mt-0.5">Receive instant WhatsApp alerts when your government certificate is ready.</div>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#7C3AED] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="font-bold text-slate-900 text-sm">Email Invoices & Transaction Receipts</div>
                <div className="text-slate-500 mt-0.5">Send a PDF receipt to your email address on successful payment.</div>
              </div>
              <input
                type="checkbox"
                checked={emailInvoices}
                onChange={(e) => setEmailInvoices(e.target.checked)}
                className="w-5 h-5 accent-[#7C3AED] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="font-bold text-slate-900 text-sm">Default Language Display</div>
                <div className="text-slate-500 mt-0.5">Choose your preferred portal language.</div>
              </div>
              <select
                value={languagePref}
                onChange={(e) => setLanguagePref(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
              >
                <option value="en">English (Default)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB E: HELP & SUPPORT */}
      {activeTab === 'help' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Direct WhatsApp Help Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect instantly with our support team for any document queries.
              </p>
            </div>
            <a href="https://wa.me/918756454282?text=Hello%20Sandy%20Digital%20Hub,%20I%20need%20help%20with%20my%20service." target="_blank" rel="noreferrer">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9 flex items-center justify-center gap-1.5">
                <MessageCircle size={14} /> Open WhatsApp
              </Button>
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Walk-in Center</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bairi, Khakhreru, Fatehpur, Uttar Pradesh - 212656 (Mon–Sat, 10am–8pm).
              </p>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 text-xs font-bold rounded-xl h-9 hover:text-[#7C3AED]">
                View Map & Contact
              </Button>
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <Star size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Leave Customer Feedback</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Share your experience using Sandy Digital Hub services.
              </p>
            </div>
            <Link href="/reviews">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 text-xs font-bold rounded-xl h-9 hover:text-[#7C3AED]">
                Submit Review
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
