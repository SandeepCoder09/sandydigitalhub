'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  RefreshCw,
  Lock,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export default function PartnerStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    permissions: ['create_request', 'view_requests', 'update_requests'],
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partner/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setAdding(true);
      const res = await fetch('/api/partner/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Staff member '${formData.name}' created!`);
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: '',
          permissions: ['create_request', 'view_requests', 'update_requests'],
        });
        fetchStaff();
      } else {
        toast.error(data.error || 'Failed to add staff');
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="bg-[#111318] p-6 sm:p-7 rounded-3xl border border-[#2B3038] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Center Staff & Operators
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Manage your counter operators, technicians, and assign access permissions.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="h-11 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-lg cursor-pointer"
        >
          <Plus size={16} className="mr-1.5" />
          <span>Add Staff Member</span>
        </Button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 bg-[#111318] p-8 text-center rounded-3xl border border-[#2B3038] text-slate-400">
            <RefreshCw className="animate-spin inline mr-2 text-violet-400" size={16} />
            Loading staff...
          </div>
        ) : staff.length === 0 ? (
          <div className="col-span-3 bg-[#111318] p-12 text-center rounded-3xl border border-[#2B3038] text-slate-400 space-y-2">
            <Users size={32} className="mx-auto text-slate-600" />
            <div className="text-sm font-bold text-white">No Staff Accounts Yet</div>
            <p className="text-xs">Add counter operators to help process customer applications.</p>
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member._id}
              className="p-6 rounded-3xl bg-[#111318] border border-[#2B3038] flex flex-col justify-between space-y-4 shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-black text-sm">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950 border border-purple-800 text-purple-300">
                    {member.role === 'PARTNER_ADMIN' ? 'Admin' : 'Operator'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{member.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">{member.email}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{member.mobile}</div>
                </div>

                {member.permissions && member.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {member.permissions.map((p: string) => (
                      <span key={p} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#181B21] text-slate-400 border border-[#2B3038]">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#2B3038] flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Active
                </span>
                <span className="text-slate-500 text-[11px]">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* [+ Add Staff Modal] */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111318] border border-[#2B3038] rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2B3038] pb-4">
              <h3 className="text-base font-black text-white">Add Center Staff Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-[#181B21] text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Suresh Verma"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Login Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@partner.com"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set login password"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2B3038]">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="h-10 rounded-2xl border-[#2B3038] text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={adding}
                  className="h-10 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs cursor-pointer"
                >
                  {adding ? 'Adding...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
