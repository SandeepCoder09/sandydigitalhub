'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle, Save, RefreshCw, Plus, Trash2, Ban, UploadCloud, Globe, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

const AVAILABLE_PAGES = [
  { path: '/checkout', label: 'Checkout & Payment Gateway', desc: 'Prevent users from placing new service orders or online payments' },
  { path: '/document-checklist', label: 'Jan Seva Document Checklist', desc: 'Block access to government certificate eligibility & checklist' },
  { path: '/calculator', label: 'Service & Project Price Calculator', desc: 'Block access to instant quotation quote builder' },
  { path: '/track-order', label: 'Live Application & Order Tracker', desc: 'Block public order status tracking page' },
  { path: '/portfolio', label: 'Client Portfolio Showcase', desc: 'Block case studies and past web projects showcase' },
  { path: '/reviews', label: 'Customer Reviews & Ratings', desc: 'Block public reviews and testimonials page' },
  { path: '/tools/govt-photo-resizer', label: 'Jan Seva Photo & Signature Resizer', desc: 'Block UP e-District photo resizer tool' },
  { path: '/tools', label: 'Digital Tools Hub', desc: 'Block access to all browser-based image and PDF tools' },
  { path: '/services', label: 'Services Catalog', desc: 'Restrict viewing of available Jan Seva & Cyber services' },
  { path: '/pricing', label: 'Pricing Comparison Page', desc: 'Hide web app & design pricing plans' },
  { path: '/contact', label: 'Contact & Consultation Form', desc: 'Pause new contact message submissions' },
  { path: '/signup', label: 'User Registration & Signup', desc: 'Stop new user accounts from registering' },
  { path: '/login', label: 'User Login & Auth', desc: 'Block users from logging into their accounts' },
  { path: '/profile', label: 'User Profile & Settings', desc: 'Pause access to user account management' },
  { path: '/requests', label: 'My Orders & Tracker', desc: 'Pause client order tracking' },
  { path: '/about', label: 'Company Info', desc: 'Hide company overview page' },
];

export default function AdminSiteControlPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEmergencyLockdown, setIsEmergencyLockdown] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [allowFileUploads, setAllowFileUploads] = useState(true);
  const [blockedPages, setBlockedPages] = useState<string[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [blockedIps, setBlockedIps] = useState<string[]>([]);

  const [emailInput, setEmailInput] = useState('');
  const [ipInput, setIpInput] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site-control');
      if (res.ok) {
        const data = await res.json();
        const s = data.settings || {};
        setIsEmergencyLockdown(!!s.isEmergencyLockdown);
        setMaintenanceMessage(s.maintenanceMessage || '');
        setAllowFileUploads(s.allowFileUploads ?? true);
        setBlockedPages(s.blockedPages || []);
        setBlockedEmails(s.blockedEmails || []);
        setBlockedIps(s.blockedIps || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load site control settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isEmergencyLockdown,
          maintenanceMessage,
          allowFileUploads,
          blockedPages,
          blockedEmails,
          blockedIps,
        }),
      });

      if (res.ok) {
        toast.success('Site & Firewall Control Settings saved successfully!');
      } else {
        toast.error('Failed to update control settings.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const toggleBlockedPage = (path: string) => {
    if (blockedPages.includes(path)) {
      setBlockedPages(blockedPages.filter((p) => p !== path));
    } else {
      setBlockedPages([...blockedPages, path]);
    }
  };

  const addBlockedEmail = () => {
    if (!emailInput.trim()) return;
    const clean = emailInput.trim().toLowerCase();
    if (!blockedEmails.includes(clean)) {
      setBlockedEmails([...blockedEmails, clean]);
    }
    setEmailInput('');
  };

  const removeBlockedEmail = (email: string) => {
    setBlockedEmails(blockedEmails.filter((e) => e !== email));
  };

  const addBlockedIp = () => {
    if (!ipInput.trim()) return;
    const clean = ipInput.trim();
    if (!blockedIps.includes(clean)) {
      setBlockedIps([...blockedIps, clean]);
    }
    setIpInput('');
  };

  const removeBlockedIp = (ip: string) => {
    setBlockedIps(blockedIps.filter((i) => i !== ip));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-violet-600" size={24} />
            Site & Firewall Control Center
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure system lockdown, page access restrictions, file upload firewall, and IP blacklists
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={saving || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs font-bold text-gray-400">
          Loading system control parameters...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Emergency System Lockdown */}
          <div className={`p-6 rounded-3xl border transition-all ${
            isEmergencyLockdown
              ? 'bg-red-50/70 border-red-300 shadow-md'
              : 'bg-white border-gray-200 shadow-2xs'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  isEmergencyLockdown ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 text-gray-700'
                }`}>
                  {isEmergencyLockdown ? <Lock size={20} /> : <Unlock size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Emergency System Maintenance Lockdown</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Instantly restrict customer access across the site and display a custom maintenance message. Admin panel remains accessible.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEmergencyLockdown(!isEmergencyLockdown)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                  isEmergencyLockdown
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {isEmergencyLockdown ? 'Lockdown ACTIVE' : 'Enable Lockdown'}
              </button>
            </div>

            {isEmergencyLockdown && (
              <div className="mt-4 pt-4 border-t border-red-200 space-y-2">
                <label className="text-xs font-bold text-red-900">Public Maintenance Banner Message:</label>
                <input
                  type="text"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="e.g. System is undergoing scheduled Jan Seva server maintenance. Please check back shortly."
                  className="w-full bg-white border border-red-300 rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>

          {/* Section 2: File Uploads Firewall */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Customer File Upload Firewall</h3>
                  <p className="text-xs text-gray-500 font-medium">Control whether users can attach photos & documents during checkout</p>
                </div>
              </div>
              <button
                onClick={() => setAllowFileUploads(!allowFileUploads)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  allowFileUploads
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {allowFileUploads ? 'Uploads ALLOWED' : 'Uploads RESTRICTED'}
              </button>
            </div>
          </div>

          {/* Section 3: Selective Page Access Control */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <EyeOff size={18} className="text-violet-600" />
                Page Access Restrictions ({blockedPages.length} pages restricted)
              </h3>
              <p className="text-xs text-gray-500 font-medium">Toggle off specific pages to block public access temporarily</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {AVAILABLE_PAGES.map((pg) => {
                const isBlocked = blockedPages.includes(pg.path);
                return (
                  <div
                    key={pg.path}
                    onClick={() => toggleBlockedPage(pg.path)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isBlocked
                        ? 'bg-red-50/60 border-red-200 text-red-900'
                        : 'bg-gray-50/60 border-gray-200 hover:border-violet-300 text-gray-900'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-gray-500 font-bold">{pg.path}</span>
                        <span>• {pg.label}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">{pg.desc}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase shrink-0 ${
                      isBlocked ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isBlocked ? 'RESTRICTED' : 'ACTIVE'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Email & IP Blacklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blocked Emails */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Ban size={18} className="text-red-500" />
                Blacklisted Emails ({blockedEmails.length})
              </h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email to block..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-violet-600"
                />
                <button
                  onClick={addBlockedEmail}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 cursor-pointer"
                >
                  Block
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {blockedEmails.map((email) => (
                  <span key={email} className="px-2.5 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5">
                    {email}
                    <button onClick={() => removeBlockedEmail(email)} className="hover:text-red-900 cursor-pointer"><Trash2 size={12} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Blocked IPs */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Globe size={18} className="text-violet-600" />
                Blacklisted IP Addresses ({blockedIps.length})
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  placeholder="Enter IP address (e.g. 192.168.1.1)..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-violet-600"
                />
                <button
                  onClick={addBlockedIp}
                  className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 cursor-pointer"
                >
                  Block
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {blockedIps.map((ip) => (
                  <span key={ip} className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold flex items-center gap-1.5">
                    {ip}
                    <button onClick={() => removeBlockedIp(ip)} className="hover:text-slate-900 cursor-pointer"><Trash2 size={12} /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
