'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Ban,
  Save,
  Users,
  Layers,
  ShoppingBag,
  Palette,
  DollarSign,
  History,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  Trash2,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export default function AdminPartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const partnerId = resolvedParams.id;
  const router = useRouter();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'requests' | 'staff' | 'branding' | 'commission' | 'audit'>('overview');
  const [partner, setPartner] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchPartnerDetails();
    fetchServices();
  }, [partnerId]);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/partners/${partnerId}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data.partner);
        setStaff(data.staff || []);
        setRecentOrders(data.recentOrders || []);
        setAuditLogs(data.auditLogs || []);
        setEditForm({
          name: data.partner.name,
          ownerName: data.partner.ownerName,
          ownerEmail: data.partner.ownerEmail,
          ownerPhone: data.partner.ownerPhone,
          whatsapp: data.partner.whatsapp,
          address: data.partner.address,
          city: data.partner.city,
          state: data.partner.state,
          pincode: data.partner.pincode,
          status: data.partner.status,
          statusReason: data.partner.statusReason || '',
          plan: data.partner.plan,
          branding: { ...data.partner.branding },
          commission: { ...data.partner.commission },
        });
      } else {
        toast.error('Partner not found');
        router.push('/admin/partners');
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`/api/admin/partners/${partnerId}/services`);
      if (res.ok) {
        const data = await res.json();
        setAvailableServices(data.services || []);
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok) {
        setPartner(data.partner);
        toast.success('Partner settings updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update partner');
      }
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleService = async (serviceId: string, currentEnabled: boolean) => {
    const updatedServices = availableServices.map((s) =>
      s.serviceId === serviceId ? { ...s, enabled: !currentEnabled } : s
    );
    setAvailableServices(updatedServices);

    try {
      const res = await fetch(`/api/admin/partners/${partnerId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedServices: updatedServices }),
      });
      if (res.ok) {
        toast.success('Service availability updated');
      }
    } catch {
      toast.error('Failed to save service state');
    }
  };

  if (loading || !partner) {
    return (
      <div className="bg-[#111318] p-12 rounded-3xl border border-[#2B3038] text-center text-white space-y-4">
        <RefreshCw className="animate-spin mx-auto text-violet-400" size={28} />
        <div className="text-sm font-bold text-slate-300">Loading Partner Console...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#111318] p-6 rounded-3xl border border-[#2B3038] shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/partners"
              className="w-10 h-10 rounded-2xl bg-[#181B21] border border-[#2B3038] hover:border-violet-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-md shrink-0"
              style={{ backgroundColor: partner.branding?.primaryColor || '#7C3AED' }}
            >
              {partner.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{partner.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-950 border border-violet-800 text-violet-300">
                  {partner.partnerId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                <span>Owner: <strong>{partner.ownerName}</strong></span>
                <span>·</span>
                <Link
                  href={`/center/${partner.slug}`}
                  target="_blank"
                  className="text-violet-400 hover:underline inline-flex items-center gap-1 font-mono font-bold"
                >
                  <span>/center/{partner.slug}</span>
                  <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleSaveChanges}
              disabled={saving}
              className="h-11 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-lg cursor-pointer"
            >
              <Save size={15} className="mr-1.5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-[#2B3038] mt-6 pt-4 overflow-x-auto no-scrollbar">
          {[
            { key: 'overview', label: 'Overview', icon: Building2 },
            { key: 'services', label: `Services (${availableServices.filter((s) => s.enabled).length})`, icon: Layers },
            { key: 'requests', label: `Requests (${recentOrders.length})`, icon: ShoppingBag },
            { key: 'staff', label: `Staff (${staff.length})`, icon: Users },
            { key: 'branding', label: 'Branding & Theme', icon: Palette },
            { key: 'commission', label: 'Plan & Commission', icon: DollarSign },
            { key: 'audit', label: 'Audit Trail', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-200 border border-violet-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-[#181B21]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-violet-400' : 'text-slate-500'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
          {/* Main Details Form */}
          <div className="lg:col-span-2 bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-6">
            <h3 className="text-base font-black text-white">Center Business Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Center Name</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Owner Name</label>
                <input
                  type="text"
                  value={editForm.ownerName || ''}
                  onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Owner Email</label>
                <input
                  type="email"
                  value={editForm.ownerEmail || ''}
                  onChange={(e) => setEditForm({ ...editForm, ownerEmail: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Phone Number</label>
                <input
                  type="text"
                  value={editForm.ownerPhone || ''}
                  onChange={(e) => setEditForm({ ...editForm, ownerPhone: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">WhatsApp Number</label>
                <input
                  type="text"
                  value={editForm.whatsapp || ''}
                  onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">City / District</label>
                <input
                  type="text"
                  value={editForm.city || ''}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400">Full Physical Address</label>
              <textarea
                rows={2}
                value={editForm.address || ''}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl p-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Status & Plan Panel */}
          <div className="space-y-6">
            <div className="bg-[#111318] p-6 rounded-3xl border border-[#2B3038] space-y-4">
              <h3 className="text-base font-black text-white">Status & Access Control</h3>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Center Status</label>
                <select
                  value={editForm.status || 'ACTIVE'}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Publicly Live)</option>
                  <option value="PENDING">PENDING (Awaiting Review)</option>
                  <option value="SUSPENDED">SUSPENDED (Restricted)</option>
                  <option value="DRAFT">DRAFT (Configuration Mode)</option>
                  <option value="CANCELLED">CANCELLED (Deactivated)</option>
                </select>
              </div>

              {editForm.status === 'SUSPENDED' && (
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-rose-400">Suspension Notice</label>
                  <textarea
                    rows={2}
                    value={editForm.statusReason || ''}
                    onChange={(e) => setEditForm({ ...editForm, statusReason: e.target.value })}
                    placeholder="e.g. Center undergoing compliance review."
                    className="w-full bg-[#181B21] border border-rose-500/40 rounded-2xl p-3 text-xs text-white outline-none"
                  />
                </div>
              )}

              <div className="space-y-1 pt-2">
                <label className="text-xs font-black uppercase text-slate-400">Platform Plan</label>
                <select
                  value={editForm.plan || 'STARTER'}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-bold"
                >
                  <option value="STARTER">STARTER TIER</option>
                  <option value="PROFESSIONAL">PROFESSIONAL TIER</option>
                  <option value="ENTERPRISE">ENTERPRISE TIER</option>
                </select>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-[#111318] p-6 rounded-3xl border border-[#2B3038] space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Metrics Snapshot</h4>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-[#181B21] border border-[#2B3038]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Orders</div>
                  <div className="text-xl font-black text-white mt-0.5">{partner.totalOrdersCount || 0}</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#181B21] border border-[#2B3038]">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Staff Count</div>
                  <div className="text-xl font-black text-white mt-0.5">{staff.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SERVICES ASSIGNMENT */}
      {activeTab === 'services' && (
        <div className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-white">Assigned Service Catalog</h3>
              <p className="text-xs text-slate-400">
                Toggle which central platform services are enabled for <strong>{partner.name}</strong> public center.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-950 border border-violet-800 text-violet-300 text-xs font-black">
              {availableServices.filter((s) => s.enabled).length} of {availableServices.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map((srv) => (
              <div
                key={srv.serviceId}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  srv.enabled
                    ? 'bg-[#181B21] border-violet-500/40 shadow-xs'
                    : 'bg-[#14161C] border-[#2B3038] opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider">
                      {srv.category}
                    </span>
                    <span className="text-xs font-black text-emerald-400">₹{srv.basePrice}</span>
                  </div>
                  <h4 className="text-sm font-black text-white">{srv.title}</h4>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#2B3038]">
                  <span className="text-[11px] font-medium text-slate-400">
                    Status: <strong className={srv.enabled ? 'text-emerald-400' : 'text-slate-500'}>{srv.enabled ? 'Enabled' : 'Disabled'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleService(srv.serviceId, srv.enabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                      srv.enabled
                        ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {srv.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: REQUESTS / ORDERS */}
      {activeTab === 'requests' && (
        <div className="bg-[#111318] rounded-3xl border border-[#2B3038] overflow-hidden text-white">
          <div className="p-6 border-b border-[#2B3038]">
            <h3 className="text-base font-black text-white">Orders from {partner.name}</h3>
            <p className="text-xs text-slate-400">All customer requests originating from this center tenant.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181B21] border-b border-[#2B3038] text-slate-400 font-black uppercase text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Services</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B3038]/60 text-slate-300 font-medium">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No service requests submitted through this partner yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-[#181B21]/50">
                      <td className="p-4 pl-6 font-mono font-bold text-violet-400">
                        #{ord._id.toString().substring(0, 8)}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {ord.customerName || ord.userId?.name || 'Customer'}
                      </td>
                      <td className="p-4">
                        {ord.services?.map((s: any) => s.title).join(', ') || 'Service'}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-950 text-violet-300 border border-violet-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">₹{ord.total}</td>
                      <td className="p-4 text-[11px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: STAFF */}
      {activeTab === 'staff' && (
        <div className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Center Staff Accounts</h3>
              <p className="text-xs text-slate-400">Team members with authorized administrative or counter access to this center.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div key={member._id} className="p-5 rounded-2xl bg-[#181B21] border border-[#2B3038] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs">{member.name}</div>
                    <div className="text-[10px] text-slate-400">{member.email}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#2B3038] flex items-center justify-between text-[11px]">
                  <span className="text-violet-400 font-bold uppercase">{member.role}</span>
                  <span className="text-emerald-400 font-bold">{member.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: BRANDING */}
      {activeTab === 'branding' && (
        <div className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-6 text-white max-w-3xl">
          <h3 className="text-base font-black text-white">White-Label Branding & Theme</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400">Primary Brand Color</label>
              <div className="flex items-center gap-2 bg-[#181B21] border border-[#2B3038] rounded-2xl px-3 py-2">
                <input
                  type="color"
                  value={editForm.branding?.primaryColor || '#7C3AED'}
                  onChange={(e) => setEditForm({ ...editForm, branding: { ...editForm.branding, primaryColor: e.target.value } })}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono">{editForm.branding?.primaryColor || '#7C3AED'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400">Accent Color</label>
              <div className="flex items-center gap-2 bg-[#181B21] border border-[#2B3038] rounded-2xl px-3 py-2">
                <input
                  type="color"
                  value={editForm.branding?.accentColor || '#6D28D9'}
                  onChange={(e) => setEditForm({ ...editForm, branding: { ...editForm.branding, accentColor: e.target.value } })}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono">{editForm.branding?.accentColor || '#6D28D9'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Logo Image URL</label>
            <input
              type="text"
              value={editForm.branding?.logoUrl || ''}
              onChange={(e) => setEditForm({ ...editForm, branding: { ...editForm.branding, logoUrl: e.target.value } })}
              placeholder="https://... or /logo.png"
              className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Custom Tagline</label>
            <input
              type="text"
              value={editForm.branding?.tagline || ''}
              onChange={(e) => setEditForm({ ...editForm, branding: { ...editForm.branding, tagline: e.target.value } })}
              className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400">Business Hours</label>
            <input
              type="text"
              value={editForm.branding?.businessHours || ''}
              onChange={(e) => setEditForm({ ...editForm, branding: { ...editForm.branding, businessHours: e.target.value } })}
              placeholder="e.g. Mon – Sat: 9:00 AM – 8:00 PM"
              className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 6: COMMISSION & PLAN */}
      {activeTab === 'commission' && (
        <div className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-6 text-white max-w-2xl">
          <h3 className="text-base font-black text-white">Revenue Share & Commission Model</h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-slate-400">Commission Model</label>
              <select
                value={editForm.commission?.model || 'PERCENTAGE'}
                onChange={(e) => setEditForm({ ...editForm, commission: { ...editForm.commission, model: e.target.value } })}
                className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-bold"
              >
                <option value="PERCENTAGE">Percentage Share (%)</option>
                <option value="FIXED">Fixed Platform Fee per Request (₹)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Partner Share (%)</label>
                <input
                  type="number"
                  value={editForm.commission?.partnerShare ?? 80}
                  onChange={(e) => setEditForm({ ...editForm, commission: { ...editForm.commission, partnerShare: Number(e.target.value) } })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Platform Share (%)</label>
                <input
                  type="number"
                  value={editForm.commission?.platformShare ?? 20}
                  onChange={(e) => setEditForm({ ...editForm, commission: { ...editForm.commission, platformShare: Number(e.target.value) } })}
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-[#111318] p-6 sm:p-8 rounded-3xl border border-[#2B3038] space-y-4 text-white">
          <h3 className="text-base font-black text-white">Partner Security & Modification Log</h3>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-xs text-slate-400 py-4">No audit actions recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="p-3.5 rounded-2xl bg-[#181B21] border border-[#2B3038] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-violet-400 font-mono">[{log.action}]</span>{' '}
                    <span className="text-slate-300">by {log.actorName} ({log.actorRole})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
