'use client';

import { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  RefreshCw,
  ExternalLink,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';
import Link from 'next/link';

export default function PartnerBrandingPage() {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partner/branding');
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          ownerPhone: data.ownerPhone || '',
          whatsapp: data.whatsapp || '',
          address: data.address || '',
          city: data.city || '',
          primaryColor: data.branding?.primaryColor || '#7C3AED',
          accentColor: data.branding?.accentColor || '#6D28D9',
          logoUrl: data.branding?.logoUrl || '',
          tagline: data.branding?.tagline || '',
          description: data.branding?.description || '',
          businessHours: data.branding?.businessHours || 'Mon – Sat: 9:00 AM – 8:00 PM',
        });
      }
    } catch (error) {
      console.error('Failed to load branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/partner/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          ownerPhone: formData.ownerPhone,
          whatsapp: formData.whatsapp,
          address: formData.address,
          city: formData.city,
          branding: {
            primaryColor: formData.primaryColor,
            accentColor: formData.accentColor,
            logoUrl: formData.logoUrl,
            tagline: formData.tagline,
            description: formData.description,
            businessHours: formData.businessHours,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Branding and profile saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save');
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="bg-[#111318] p-12 rounded-3xl border border-[#2B3038] text-center text-white space-y-3">
        <RefreshCw className="animate-spin mx-auto text-violet-400" size={26} />
        <div className="text-sm font-bold text-slate-300">Loading Branding Configuration...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-4xl">
      {/* Header */}
      <div className="bg-[#111318] p-6 sm:p-7 rounded-3xl border border-[#2B3038] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Branding & Public Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Customize your center name, theme colors, contact numbers, and public landing page.
          </p>
        </div>

        {formData.slug && (
          <Link href={`/center/${formData.slug}`} target="_blank">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-2xl border-[#2B3038] bg-[#181B21] hover:bg-[#20242B] text-violet-300 text-xs font-bold shrink-0"
            >
              <span>Preview Live Page</span>
              <ExternalLink size={13} className="ml-1.5" />
            </Button>
          </Link>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] shadow-xl space-y-6">
        {/* Business Identity */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-violet-400">Center Identity</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Center Business Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Custom Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Your Trusted Local Digital Service Center"
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">Short Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl p-3 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Brand Theme Colors */}
        <div className="space-y-4 pt-4 border-t border-[#2B3038]">
          <h3 className="text-sm font-black uppercase tracking-wider text-violet-400">Theme Colors & Logo</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Primary Color</label>
              <div className="flex items-center gap-2 bg-[#181B21] border border-[#2B3038] rounded-2xl px-3 py-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono">{formData.primaryColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Accent Color</label>
              <div className="flex items-center gap-2 bg-[#181B21] border border-[#2B3038] rounded-2xl px-3 py-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono">{formData.accentColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">Logo Image URL</label>
            <input
              type="text"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://... or /logo.png"
              className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-4 pt-4 border-t border-[#2B3038]">
          <h3 className="text-sm font-black uppercase tracking-wider text-violet-400">Contact & Hours</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Phone Number</label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">City / District</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-300">Business Hours</label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-300">Center Address</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl p-3 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#2B3038] flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-lg cursor-pointer"
          >
            <Save size={15} className="mr-1.5" />
            <span>{saving ? 'Saving...' : 'Save Branding'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
