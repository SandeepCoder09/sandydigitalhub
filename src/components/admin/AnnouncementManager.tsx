'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Megaphone, Plus, Send, Archive, Trash2, X, ChevronDown,
  AlertTriangle, Bell, Wrench, ShieldAlert, Zap, Package,
  RefreshCw, Users, CheckCircle2, Clock, Filter, Eye
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnnouncementType =
  | 'NEW_SERVICE' | 'NEW_FEATURE' | 'PARTNER_APPROVED' | 'PARTNER_SUSPENDED'
  | 'REQUEST_STATUS_CHANGED' | 'ACTION_REQUIRED' | 'PLAN_UPDATE'
  | 'MAINTENANCE' | 'SECURITY_NOTICE' | 'PLATFORM_UPDATE' | 'GENERAL';

type AudienceType = 'ALL' | 'CUSTOMER' | 'PARTNER' | 'ADMIN';
type PriorityType = 'NORMAL' | 'HIGH' | 'URGENT';
type StatusType = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';

interface Announcement {
  _id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  targetAudience: AudienceType;
  priority: PriorityType;
  status: StatusType;
  pinned: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  expiresAt?: string;
  readBy: string[];
  createdAt: string;
}

// ─── Config Maps ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<AnnouncementType, { label: string; icon: any; color: string }> = {
  GENERAL: { label: 'General', icon: Bell, color: 'text-slate-500 bg-slate-100' },
  NEW_SERVICE: { label: 'New Service', icon: Package, color: 'text-emerald-600 bg-emerald-50' },
  NEW_FEATURE: { label: 'New Feature', icon: Zap, color: 'text-violet-600 bg-violet-50' },
  PARTNER_APPROVED: { label: 'Partner Approved', icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  PARTNER_SUSPENDED: { label: 'Partner Suspended', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
  REQUEST_STATUS_CHANGED: { label: 'Request Update', icon: RefreshCw, color: 'text-blue-500 bg-blue-50' },
  ACTION_REQUIRED: { label: 'Action Required', icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  PLAN_UPDATE: { label: 'Plan Update', icon: Users, color: 'text-purple-600 bg-purple-50' },
  MAINTENANCE: { label: 'Maintenance', icon: Wrench, color: 'text-amber-500 bg-amber-50' },
  SECURITY_NOTICE: { label: 'Security Notice', icon: ShieldAlert, color: 'text-red-700 bg-red-50' },
  PLATFORM_UPDATE: { label: 'Platform Update', icon: Zap, color: 'text-indigo-500 bg-indigo-50' },
};

const PRIORITY_CONFIG: Record<PriorityType, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-slate-100 text-slate-600' },
  HIGH: { label: 'High', color: 'bg-amber-100 text-amber-700' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-700 font-extrabold' },
};

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; icon: any }> = {
  DRAFT: { label: 'Draft', color: 'bg-slate-100 text-slate-600', icon: Clock },
  SCHEDULED: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700', icon: Clock },
  PUBLISHED: { label: 'Published', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-500', icon: Archive },
};

function formatDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Empty Form ───────────────────────────────────────────────────────────────

const emptyForm = {
  title: '',
  body: '',
  type: 'GENERAL' as AnnouncementType,
  targetAudience: 'ALL' as AudienceType,
  priority: 'NORMAL' as PriorityType,
  pinned: false,
  scheduledAt: '',
  expiresAt: '',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<StatusType | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const q = filterStatus !== 'ALL' ? `?status=${filterStatus}` : '';
      const res = await fetch(`/api/admin/announcements${q}`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Open create form
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  // Open edit form
  const openEdit = (a: Announcement) => {
    setEditTarget(a);
    setForm({
      title: a.title,
      body: a.body,
      type: a.type,
      targetAudience: a.targetAudience,
      priority: a.priority,
      pinned: a.pinned,
      scheduledAt: a.scheduledAt ? a.scheduledAt.slice(0, 16) : '',
      expiresAt: a.expiresAt ? a.expiresAt.slice(0, 16) : '',
    });
    setShowForm(true);
  };

  // Save (create or edit)
  const handleSave = async (statusOverride?: StatusType) => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        status: statusOverride || (editTarget?.status ?? 'DRAFT'),
        scheduledAt: form.scheduledAt || null,
        expiresAt: form.expiresAt || null,
      };

      let res;
      if (editTarget) {
        res = await fetch(`/api/admin/announcements/${editTarget._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowForm(false);
        fetchAnnouncements();
      }
    } finally {
      setSaving(false);
    }
  };

  // Change status
  const changeStatus = async (id: string, newStatus: StatusType) => {
    const payload: any = { status: newStatus };
    if (newStatus === 'PUBLISHED') payload.publishedAt = new Date().toISOString();
    await fetch(`/api/admin/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    fetchAnnouncements();
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement permanently?')) return;
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
    fetchAnnouncements();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-violet-100 text-violet-700">
              <Megaphone size={22} />
            </span>
            Announcements & Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Create, schedule, target and publish platform-wide announcements. Total: {total}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {(['ALL', 'DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              filterStatus === s
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s as StatusType].label}
          </button>
        ))}
        <button
          onClick={fetchAnnouncements}
          className="ml-auto p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors cursor-pointer"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && announcements.length === 0 ? (
          <div className="p-16 text-center text-sm text-gray-400 font-semibold animate-pulse">
            Loading announcements…
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-16 text-center">
            <Megaphone size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No announcements yet.</p>
            <button
              onClick={openCreate}
              className="mt-4 text-xs font-bold text-violet-600 hover:underline cursor-pointer"
            >
              Create your first announcement →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-black text-gray-500 uppercase tracking-wider">Title / Type</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Audience</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Priority</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Published</th>
                  <th className="text-left px-4 py-3 font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reads</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {announcements.map((a) => {
                  const typeConf = TYPE_CONFIG[a.type] || TYPE_CONFIG.GENERAL;
                  const TypeIcon = typeConf.icon;
                  const statusConf = STATUS_CONFIG[a.status];
                  const StatusIcon = statusConf.icon;
                  const priorityConf = PRIORITY_CONFIG[a.priority];

                  return (
                    <tr key={a._id} className="hover:bg-violet-50/30 transition-colors group">
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <span className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${typeConf.color}`}>
                            <TypeIcon size={12} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                              {a.pinned && <span className="text-amber-500 text-[10px] font-black shrink-0">📌</span>}
                              {a.title}
                            </div>
                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">{typeConf.label}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                          {a.targetAudience}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${priorityConf.color}`}>
                          {priorityConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${statusConf.color}`}>
                          <StatusIcon size={10} />
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 hidden lg:table-cell font-mono text-[10px]">
                        {formatDate(a.publishedAt)}
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                          <Eye size={10} />
                          {a.readBy?.length || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {a.status === 'DRAFT' && (
                            <button
                              onClick={() => changeStatus(a._id, 'PUBLISHED')}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer transition-colors"
                              title="Publish Now"
                            >
                              <Send size={12} />
                            </button>
                          )}
                          {a.status === 'PUBLISHED' && (
                            <button
                              onClick={() => changeStatus(a._id, 'ARCHIVED')}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors"
                              title="Archive"
                            >
                              <Archive size={12} />
                            </button>
                          )}
                          {a.status === 'ARCHIVED' && (
                            <button
                              onClick={() => changeStatus(a._id, 'PUBLISHED')}
                              className="p-1.5 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 cursor-pointer transition-colors"
                              title="Re-publish"
                            >
                              <Send size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(a)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer transition-colors"
                            title="Edit"
                          >
                            <Filter size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowForm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Megaphone size={18} className="text-violet-600" />
                  {editTarget ? 'Edit Announcement' : 'New Announcement'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Brief, clear headline…"
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-black text-gray-700 mb-1.5">Body Message *</label>
                  <textarea
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    placeholder="Full announcement message…"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 transition resize-none"
                  />
                </div>

                {/* Type + Audience Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Announcement Type</label>
                    <div className="relative">
                      <select
                        value={form.type}
                        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AnnouncementType }))}
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none bg-white cursor-pointer"
                      >
                        {(Object.keys(TYPE_CONFIG) as AnnouncementType[]).map((t) => (
                          <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Target Audience</label>
                    <div className="relative">
                      <select
                        value={form.targetAudience}
                        onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value as AudienceType }))}
                        className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none bg-white cursor-pointer"
                      >
                        <option value="ALL">Everyone (All Roles)</option>
                        <option value="CUSTOMER">Customers Only</option>
                        <option value="PARTNER">Partners Only</option>
                        <option value="ADMIN">Admin Only</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Priority + Pinned Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Priority</label>
                    <div className="flex gap-2">
                      {(['NORMAL', 'HIGH', 'URGENT'] as PriorityType[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setForm((f) => ({ ...f, priority: p }))}
                          className={`flex-1 py-2 rounded-xl text-[11px] font-bold cursor-pointer border transition-all ${
                            form.priority === p
                              ? p === 'URGENT' ? 'bg-red-600 text-white border-red-600'
                              : p === 'HIGH' ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Pinned Banner</label>
                    <button
                      onClick={() => setForm((f) => ({ ...f, pinned: !f.pinned }))}
                      className={`w-full py-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                        form.pinned
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {form.pinned ? '📌 Pinned — Shows as Banner' : '📌 Pin as Top Banner'}
                    </button>
                  </div>
                </div>

                {/* Schedule + Expiry Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Schedule Publish (optional)</label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">Expires At (optional)</label>
                    <input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave('DRAFT')}
                  disabled={saving || !form.title || !form.body}
                  className="px-5 py-2.5 rounded-2xl bg-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSave('PUBLISHED')}
                  disabled={saving || !form.title || !form.body}
                  className="px-5 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 cursor-pointer transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={14} />
                  {saving ? 'Publishing…' : 'Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
