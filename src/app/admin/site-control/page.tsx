'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldAlert, ShieldCheck, Lock, Unlock, AlertTriangle, Save, RefreshCw, Plus, Trash2, Ban, UploadCloud, Globe, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

const AVAILABLE_PAGES = [
  { path: '/checkout', label: 'Checkout & Payment Gateway', desc: 'Prevent users from placing new service orders or online payments' },
  { path: '/document-checklist', label: 'Jan Seva Document Checklist', desc: 'Block access to government certificate eligibility & checklist' },
  { path: '/calculator', label: 'Service & Project Price Calculator', desc: 'Block access to instant quotation quote builder' },
  { path: '/track-order', label: 'Live Application & Order Tracker', desc: 'Block public order status tracking page' },
  { path: '/portfolio', label: 'Client Portfolio Showcase', desc: 'Block case studies and past web projects showcase' },
  { path: '/tools', label: 'Digital Tools Hub', desc: 'Block access to all browser-based image and PDF tools' },
  { path: '/services', label: 'Services Catalog', desc: 'Restrict viewing of available Jan Seva & Cyber services' },
  { path: '/pricing', label: 'Pricing Comparison Page', desc: 'Hide web app & design pricing plans' },
  { path: '/contact', label: 'Contact & Consultation Form', desc: 'Pause new contact message submissions' },
  { path: '/signup', label: 'User Registration & Signup', desc: 'Stop new user accounts from registering' },
  { path: '/login', label: 'User Login & Auth', desc: 'Block users from logging into their accounts' },
  { path: '/profile', label: 'User Profile & Settings', desc: 'Pause access to user account management' },
  { path: '/requests', label: 'My Orders & Tracker', desc: 'Pause client order tracking' },
  { path: '/about', label: 'About Us & Company Info', desc: 'Hide company overview page' },
  { path: '/image-tools/passport-photo', label: 'Passport Photo Generator', desc: 'Block passport photo maker tool' },
  { path: '/image-tools/convert', label: 'Image Format Converter', desc: 'Block PNG/JPG/WebP image converter' },
  { path: '/image-tools/resize', label: 'Image Resizer Tool', desc: 'Block image dimension resizer' },
  { path: '/image-tools/crop', label: 'Image Cropper Tool', desc: 'Block image crop tool' },
  { path: '/image-tools/watermark', label: 'Watermark Tool', desc: 'Block image watermark tool' },
  { path: '/image-tools/qr-generator', label: 'QR Code Generator', desc: 'Block QR code generator tool' },
  { path: '/image-tools/image-to-pdf', label: 'Image to PDF Tool', desc: 'Block JPG to PDF converter' },
  { path: '/tools/word-counter', label: 'Word & Character Counter', desc: 'Block word counter tool' },
  { path: '/tools/password-generator', label: 'Password Generator', desc: 'Block strong password generator' },
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

  const [customPageInput, setCustomPageInput] = useState('');
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
      } else {
        toast.error('Failed to load site control settings.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
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
        method: 'PUT',
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
        toast.success('Site security & page control settings saved successfully!', 'Firewall Updated');
      } else {
        toast.error('Failed to update site settings.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const togglePageBlock = (path: string) => {
    if (blockedPages.includes(path)) {
      setBlockedPages(blockedPages.filter((p) => p !== path));
      toast.info(`Unblocked ${path} route.`);
    } else {
      setBlockedPages([...blockedPages, path]);
      toast.success(`Blocked ${path} route.`);
    }
  };

  const addCustomPage = () => {
    let clean = customPageInput.trim();
    if (!clean) return;
    if (!clean.startsWith('/')) clean = '/' + clean;
    if (!blockedPages.includes(clean)) {
      setBlockedPages([...blockedPages, clean]);
      setCustomPageInput('');
      toast.success(`Added ${clean} to blocked pages list.`);
    }
  };

  const addBlockedEmail = () => {
    const clean = emailInput.trim().toLowerCase();
    if (!clean) return;
    if (!blockedEmails.includes(clean)) {
      setBlockedEmails([...blockedEmails, clean]);
      setEmailInput('');
      toast.success(`Added ${clean} to blocked email list.`);
    }
  };

  const addBlockedIp = () => {
    const clean = ipInput.trim();
    if (!clean) return;
    if (!blockedIps.includes(clean)) {
      setBlockedIps([...blockedIps, clean]);
      setIpInput('');
      toast.success(`Added ${clean} to blocked IP list.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-8">
          {/* Top Banner Header */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                <ShieldAlert className="text-[#FF4500]" /> Website Security & Page Control Center
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Full site-wide controls: block specific pages, toggle emergency maintenance lockdown, and block scammers/spammers.
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving || loading}
              className="px-6 py-3 rounded-2xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Save size={18} />
              <span>{saving ? 'Saving Changes...' : 'Save All Control Settings'}</span>
            </button>
          </div>

          {/* Section 1: Emergency Lockdown Switch */}
          <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            isEmergencyLockdown
              ? 'bg-red-50/90 border-red-300 shadow-xl shadow-red-500/10'
              : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-black text-lg text-gray-900">
                  {isEmergencyLockdown ? (
                    <span className="flex items-center gap-2 text-red-600">
                      <ShieldAlert size={24} /> Emergency Site Lockdown IS ACTIVE
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-emerald-600">
                      <ShieldCheck size={24} /> Site Normal & Secure
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium max-w-xl">
                  1-Click Emergency Lockdown immediately blocks all public user pages and displays a high-security maintenance broadcast screen during DDoS attacks or cyber threats.
                </p>
              </div>

              <button
                onClick={() => {
                  const nextState = !isEmergencyLockdown;
                  setIsEmergencyLockdown(nextState);
                  if (nextState) toast.error('Emergency Lockdown Mode Activated!');
                  else toast.success('Emergency Lockdown Mode Disabled.');
                }}
                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer shrink-0 ${
                  isEmergencyLockdown
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isEmergencyLockdown ? <Unlock size={18} /> : <Lock size={18} />}
                <span>{isEmergencyLockdown ? 'Disable Emergency Lockdown' : 'ACTIVATE SITE LOCKDOWN'}</span>
              </button>
            </div>

            {/* Broadcast Message Input */}
            <div className="pt-5 space-y-2">
              <label className="block text-xs font-extrabold uppercase text-gray-700 tracking-wider">
                Broadcast Maintenance & Security Message
              </label>
              <input
                type="text"
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                placeholder="Sandy Digital Hub is currently undergoing scheduled maintenance..."
                className="w-full bg-gray-50 text-gray-900 p-3.5 rounded-2xl border border-gray-200 focus:border-[#FF4500] focus:bg-white outline-none text-sm font-semibold transition-all"
              />
            </div>
          </div>

          {/* Section 2: Page Route Blocker (Block Any Page) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <EyeOff className="text-[#FF4500]" /> Page Access & Route Blocker ({AVAILABLE_PAGES.length} Pre-configured Routes)
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Toggle ON/OFF to instantly block or unblock specific website pages from public users. Blocked pages display an admin pause screen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_PAGES.map((page) => {
                const isBlocked = blockedPages.includes(page.path);
                return (
                  <div
                    key={page.path}
                    onClick={() => togglePageBlock(page.path)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                      isBlocked
                        ? 'border-red-500 bg-red-50/60 shadow-sm'
                        : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isBlocked ? (
                        <Ban className="text-red-600 shrink-0" size={18} />
                      ) : (
                        <Globe className="text-emerald-600 shrink-0" size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{page.label}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isBlocked
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {isBlocked ? 'BLOCKED' : 'ACTIVE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 font-mono font-semibold">{page.path}</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-snug line-clamp-2">{page.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Route Blocker Input */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-extrabold uppercase text-gray-700">
                Block Custom URL Route (e.g. /privacy or /terms)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPageInput}
                  onChange={(e) => setCustomPageInput(e.target.value)}
                  placeholder="/privacy"
                  className="flex-1 bg-gray-50 text-gray-900 p-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:border-[#FF4500]"
                />
                <button
                  onClick={addCustomPage}
                  className="px-4 py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Plus size={16} /> Add Route Block
                </button>
              </div>

              {/* Active Blocked Pages Chips */}
              {blockedPages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {blockedPages.map((path) => (
                    <span
                      key={path}
                      className="px-3 py-1.5 rounded-xl bg-red-100 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2"
                    >
                      <span className="font-mono">{path}</span>
                      <button
                        onClick={() => togglePageBlock(path)}
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Anti-Spam Firewall & File Upload Switch */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <ShieldCheck className="text-[#FF4500]" /> Anti-Spam Firewall & User Upload Switch
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Protect your forms and server bandwidth from malicious file attachments and spam email submissions.
              </p>
            </div>

            {/* File Upload Global Switch */}
            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <UploadCloud size={18} className="text-[#FF4500]" /> User Document & Photo Uploads
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Allow or restrict users from attaching PDF/Image files during checkout or contact forms.
                </p>
              </div>

              <button
                onClick={() => {
                  const nextState = !allowFileUploads;
                  setAllowFileUploads(nextState);
                  if (nextState) toast.success('File uploads enabled.');
                  else toast.error('File uploads restricted.');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer border ${
                  allowFileUploads
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}
              >
                {allowFileUploads ? 'ALLOW UPLOADS' : 'UPLOADS RESTRICTED'}
              </button>
            </div>

            {/* Blocked Emails Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase text-gray-700">
                  Block Spammer Email Addresses
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="spammer@example.com"
                    className="flex-1 bg-gray-50 text-gray-900 p-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:border-[#FF4500]"
                  />
                  <button
                    onClick={addBlockedEmail}
                    className="px-3.5 py-3 rounded-xl bg-gray-900 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Block Email
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {blockedEmails.map((email) => (
                    <span key={email} className="px-2.5 py-1 rounded-lg bg-gray-100 border text-xs text-gray-800 font-semibold flex items-center gap-1.5">
                      <span>{email}</span>
                      <button onClick={() => setBlockedEmails(blockedEmails.filter((e) => e !== email))} className="text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase text-gray-700">
                  Block Malicious IP Addresses
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="192.168.1.100"
                    className="flex-1 bg-gray-50 text-gray-900 p-3 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:border-[#FF4500]"
                  />
                  <button
                    onClick={addBlockedIp}
                    className="px-3.5 py-3 rounded-xl bg-gray-900 text-white font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Block IP
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {blockedIps.map((ip) => (
                    <span key={ip} className="px-2.5 py-1 rounded-lg bg-gray-100 border text-xs text-gray-800 font-mono font-semibold flex items-center gap-1.5">
                      <span>{ip}</span>
                      <button onClick={() => setBlockedIps(blockedIps.filter((i) => i !== ip))} className="text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
