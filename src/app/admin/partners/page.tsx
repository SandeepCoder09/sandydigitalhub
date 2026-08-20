'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Ban,
  Filter,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

interface PartnerItem {
  _id: string;
  partnerId: string;
  slug: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  whatsapp: string;
  city: string;
  state: string;
  plan: string;
  status: string;
  totalOrdersCount: number;
  totalRevenue: number;
  partnerEarnings: number;
  branding: {
    logoUrl?: string;
    primaryColor?: string;
    tagline?: string;
  };
  createdAt: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, active: 0, pending: 0, suspended: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const toast = useToast();

  // Create form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    plan: 'STARTER',
    status: 'ACTIVE',
    primaryColor: '#7C3AED',
    tagline: 'Your Trusted Local Digital Service Center',
    adminPassword: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, [statusFilter, planFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (planFilter !== 'ALL') params.set('plan', planFilter);

      const res = await fetch(`/api/admin/partners?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPartners();
  };

  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug && prev.slug !== generatedSlug ? prev.slug : generatedSlug,
    }));
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.ownerName || !formData.ownerEmail || !formData.ownerPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setCreating(true);
      const res = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          ownerPhone: formData.ownerPhone,
          whatsapp: formData.whatsapp || formData.ownerPhone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          plan: formData.plan,
          status: formData.status,
          adminPassword: formData.adminPassword || 'Partner@2026',
          branding: {
            primaryColor: formData.primaryColor,
            tagline: formData.tagline,
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Partner '${formData.name}' created successfully!`);
        setShowCreateModal(false);
        fetchPartners();
      } else {
        toast.error(data.error || 'Failed to create partner');
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={11} /> Active
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={11} /> Pending
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban size={11} /> Suspended
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Draft
          </span>
        );
      default:
        return <span className="text-xs text-slate-400 font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111318] p-6 rounded-3xl border border-[#2B3038] shadow-xl text-white">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider">
            <Building2 size={13} />
            <span>Multi-Tenant Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            SARA Partner Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Centrally provision and manage independent white-label digital service centers and branches.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => fetchPartners()}
            variant="outline"
            size="sm"
            className="h-11 rounded-2xl border-[#2B3038] bg-[#181B21] hover:bg-[#20242B] text-slate-300 text-xs font-bold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>

          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="h-11 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Plus size={16} className="mr-1.5" />
            <span>Create Partner Center</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] text-white space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Partners</div>
          <div className="text-3xl font-black text-white">{metrics.total}</div>
          <div className="text-[11px] text-slate-500 font-medium">Registered Centers</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] text-white space-y-1">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Active Centers</div>
          <div className="text-3xl font-black text-emerald-400">{metrics.active}</div>
          <div className="text-[11px] text-slate-500 font-medium">Publicly Operational</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] text-white space-y-1">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pending Review</div>
          <div className="text-3xl font-black text-amber-400">{metrics.pending}</div>
          <div className="text-[11px] text-slate-500 font-medium">Awaiting Setup/Approval</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] text-white space-y-1">
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Suspended</div>
          <div className="text-3xl font-black text-rose-400">{metrics.suspended}</div>
          <div className="text-[11px] text-slate-500 font-medium">Paused or Restricted</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-[#111318] p-4 rounded-3xl border border-[#2B3038] flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by center name, ID, slug, city..."
            className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#181B21] border border-[#2B3038] rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold shrink-0">Plan:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-[#181B21] border border-[#2B3038] rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="ALL">All Plans</option>
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="ENTERPRISE">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* Partner Centers Table */}
      <div className="bg-[#111318] rounded-3xl border border-[#2B3038] overflow-hidden shadow-xl text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181B21] border-b border-[#2B3038] text-slate-400 font-black uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 pl-6">Center & Identity</th>
                <th className="p-4">Owner Contact</th>
                <th className="p-4">Public URL</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Requests</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3038]/60 text-slate-300 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline mr-2 text-violet-400" size={16} />
                    Loading partner centers...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center space-y-3">
                    <Building2 size={36} className="mx-auto text-slate-600" />
                    <div className="text-base font-bold text-white">No Partner Centers Found</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click the &quot;Create Partner Center&quot; button above to provision your first multi-tenant partner.
                    </p>
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p._id} className="hover:bg-[#181B21]/50 transition-colors">
                    {/* Center Info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0"
                          style={{ backgroundColor: p.branding?.primaryColor || '#7C3AED' }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-white truncate text-sm flex items-center gap-2">
                            <span>{p.name}</span>
                          </div>
                          <div className="text-[11px] text-violet-400 font-mono font-bold">
                            {p.partnerId} · {p.city || 'India'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner Contact */}
                    <td className="p-4">
                      <div className="text-xs font-bold text-white">{p.ownerName}</div>
                      <div className="text-[11px] text-slate-400">{p.ownerEmail}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.ownerPhone}</div>
                    </td>

                    {/* Public URL */}
                    <td className="p-4">
                      <Link
                        href={`/center/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#181B21] hover:bg-[#20242B] border border-[#2B3038] text-violet-300 font-mono text-[11px] font-bold transition-colors"
                      >
                        <span>/center/{p.slug}</span>
                        <ExternalLink size={11} />
                      </Link>
                    </td>

                    {/* Plan */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-purple-950/60 border border-purple-800 text-purple-300">
                        {p.plan}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">{getStatusBadge(p.status)}</td>

                    {/* Requests Count */}
                    <td className="p-4">
                      <div className="font-extrabold text-white text-sm">{p.totalOrdersCount || 0}</div>
                      <div className="text-[10px] text-slate-400">Total processed</div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <Link href={`/admin/partners/${p._id}`}>
                        <Button
                          size="sm"
                          className="h-8 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-xs"
                        >
                          <span>Manage</span>
                          <ArrowRight size={13} className="ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* [+ Create Partner Modal] */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111318] border border-[#2B3038] rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-[#2B3038] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Provision New Partner Center</h3>
                  <p className="text-xs text-slate-400 font-medium">Create a dedicated white-label multi-tenant digital center</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#181B21] border border-[#2B3038] text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              {/* Center Name & URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Business / Center Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Sharma Digital Seva Kendra"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Public URL Slug <span className="text-violet-400">*</span>
                  </label>
                  <div className="flex items-center bg-[#181B21] border border-[#2B3038] focus-within:border-violet-500 rounded-2xl px-3 py-2.5">
                    <span className="text-[11px] text-slate-500 font-mono mr-1">/center/</span>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="sharma-digital"
                      className="w-full bg-transparent text-xs text-violet-300 font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Center Owner Full Name <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Owner Email (Login ID) <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="sharma.center@gmail.com"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Phone Number <span className="text-violet-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Location (City, State, Address) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">City / District</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Fatehpur"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="212656"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Plan & Branding Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">Partner Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="STARTER">Starter Tier</option>
                    <option value="PROFESSIONAL">Professional Tier</option>
                    <option value="ENTERPRISE">Enterprise Tier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300">Primary Brand Color</label>
                  <div className="flex items-center gap-2 bg-[#181B21] border border-[#2B3038] rounded-2xl px-3 py-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-300">{formData.primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Initial Admin Password */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Initial Partner Admin Password
                </label>
                <input
                  type="text"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  placeholder="Defaults to: Partner@2026"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2B3038]">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="h-11 rounded-2xl border-[#2B3038] text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="h-11 px-6 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-lg cursor-pointer"
                >
                  {creating ? 'Provisioning...' : 'Provision Partner Center'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
