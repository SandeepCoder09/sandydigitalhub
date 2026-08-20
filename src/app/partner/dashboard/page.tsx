'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  DollarSign,
  Plus,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Phone,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export default function PartnerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [creatingWalkin, setCreatingWalkin] = useState(false);
  const toast = useToast();

  const [walkinForm, setWalkinForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceTitle: 'Online Application Assistance',
    price: 100,
    notes: '',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/partner/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load partner dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinForm.customerName || !walkinForm.customerPhone || !walkinForm.serviceTitle) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setCreatingWalkin(true);
      const res = await fetch('/api/partner/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walkinForm),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Walk-in request created successfully!');
        setShowWalkinModal(false);
        setWalkinForm({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          serviceTitle: 'Online Application Assistance',
          price: 100,
          notes: '',
        });
        fetchDashboard();
      } else {
        toast.error(data.error || 'Failed to create request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error');
    } finally {
      setCreatingWalkin(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111318] p-12 rounded-3xl border border-[#2B3038] text-center text-white space-y-3">
        <RefreshCw className="animate-spin mx-auto text-violet-400" size={26} />
        <div className="text-sm font-bold text-slate-300">Loading Partner Dashboard...</div>
      </div>
    );
  }

  const partner = dashboardData?.partner;
  const metrics = dashboardData?.metrics || {};
  const onboarding = dashboardData?.onboarding || [];
  const recentOrders = dashboardData?.recentOrders || [];

  if (dashboardData?.isSuspended) {
    return (
      <div className="bg-[#111318] p-8 sm:p-12 rounded-3xl border border-rose-500/40 text-center text-white space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <ShieldAlert size={36} />
        </div>
        <h2 className="text-2xl font-black text-white">Center Access Suspended</h2>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">
          {dashboardData.suspensionReason}
        </p>
        <p className="text-xs text-slate-400">
          Please contact SARA Central Support at <strong>+91 8756454282</strong> or email <strong>info@sandydigitalhub.com</strong>.
        </p>
      </div>
    );
  }

  // Calculate onboarding progress
  const completedSteps = onboarding.filter((s: any) => s.completed).length;
  const onboardingProgress = Math.round((completedSteps / Math.max(1, onboarding.length)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-[#111318] p-6 sm:p-7 rounded-3xl border border-[#2B3038] shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-950 border border-violet-800 text-violet-300">
              {partner?.partnerId || 'PARTNER'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{partner?.city || 'India'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {partner?.name || 'Partner Center'}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Welcome to your digital service center operations console.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={() => setShowWalkinModal(true)}
            className="h-11 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs shadow-lg cursor-pointer"
          >
            <Plus size={16} className="mr-1.5" />
            <span>Log Walk-in Request</span>
          </Button>

          {partner?.slug && (
            <Link href={`/center/${partner.slug}`} target="_blank">
              <Button
                variant="outline"
                className="h-11 px-4 rounded-2xl border-[#2B3038] bg-[#181B21] hover:bg-[#20242B] text-violet-300 font-bold text-xs"
              >
                <span>Live Center</span>
                <ExternalLink size={13} className="ml-1.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-white">
        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today&apos;s Requests</span>
            <ShoppingBag size={16} className="text-violet-400" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.todayOrders || 0}</div>
          <div className="text-[10px] text-slate-500 font-medium">Logged today</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Action</span>
            <Clock size={16} />
          </div>
          <div className="text-3xl font-black text-amber-400">{metrics.pendingOrders || 0}</div>
          <div className="text-[10px] text-slate-500 font-medium">In processing or visit</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 size={16} />
          </div>
          <div className="text-3xl font-black text-emerald-400">{metrics.completedOrders || 0}</div>
          <div className="text-[10px] text-slate-500 font-medium">Successfully finished</div>
        </div>

        <div className="bg-[#111318] p-5 rounded-3xl border border-[#2B3038] space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Center Earnings</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">₹{metrics.partnerEarnings || 0}</div>
          <div className="text-[10px] text-slate-500 font-medium">Estimated commission share</div>
        </div>
      </div>

      {/* Onboarding Checklist Widget */}
      {onboardingProgress < 100 && (
        <div className="bg-gradient-to-r from-violet-950/40 via-[#111318] to-indigo-950/40 p-6 rounded-3xl border border-violet-500/30 text-white space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Center Onboarding Checklist</h3>
                <p className="text-[11px] text-slate-400 font-medium">Complete these steps to optimize your public center presence</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-violet-300">{onboardingProgress}% Complete</span>
          </div>

          <div className="w-full bg-[#181B21] h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${onboardingProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {onboarding.map((step: any) => (
              <div
                key={step.step}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
                  step.completed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-[#181B21] border-[#2B3038] text-slate-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-[#20242B] text-slate-500'
                  }`}
                >
                  {step.completed ? '✓' : '○'}
                </div>
                <span className="truncate">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Requests Section */}
      <div className="bg-[#111318] rounded-3xl border border-[#2B3038] overflow-hidden text-white shadow-xl">
        <div className="p-6 border-b border-[#2B3038] flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Recent Service Requests</h3>
            <p className="text-xs text-slate-400">Applications and forms submitted for your center.</p>
          </div>

          <Link href="/partner/requests">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-violet-400 hover:text-violet-300">
              <span>View All Requests</span>
              <ArrowRight size={13} className="ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181B21] border-b border-[#2B3038] text-slate-400 font-black uppercase text-[10px]">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Total</th>
                <th className="p-4 pr-6 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3038]/60 text-slate-300 font-medium">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No requests received yet. Share your public center link or click &quot;Log Walk-in Request&quot; above.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord: any) => (
                  <tr key={ord._id} className="hover:bg-[#181B21]/50">
                    <td className="p-4 pl-6 font-mono font-bold text-violet-400">
                      #{ord._id.toString().substring(0, 8)}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {ord.customerName || 'Customer'}
                    </td>
                    <td className="p-4">
                      {ord.services?.map((s: any) => s.title).join(', ') || 'Service'}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-violet-950 text-violet-300 border border-violet-800">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">₹{ord.total}</td>
                    <td className="p-4 pr-6 text-right text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* [+ Log Walk-in Request Modal] */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111318] border border-[#2B3038] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2B3038] pb-4">
              <h3 className="text-base font-black text-white">Log Walk-in Customer Request</h3>
              <button
                onClick={() => setShowWalkinModal(false)}
                className="w-7 h-7 rounded-full bg-[#181B21] text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.customerName}
                  onChange={(e) => setWalkinForm({ ...walkinForm, customerName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-300">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={walkinForm.customerPhone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, customerPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-slate-300">Service Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={walkinForm.price}
                    onChange={(e) => setWalkinForm({ ...walkinForm, price: Number(e.target.value) })}
                    className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Service Description *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.serviceTitle}
                  onChange={(e) => setWalkinForm({ ...walkinForm, serviceTitle: e.target.value })}
                  placeholder="e.g. PAN Card Correction / UP Scholarship"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Internal Counter Notes</label>
                <textarea
                  rows={2}
                  value={walkinForm.notes}
                  onChange={(e) => setWalkinForm({ ...walkinForm, notes: e.target.value })}
                  placeholder="e.g. Original Aadhaar submitted, receipt given."
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl p-3 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2B3038]">
                <Button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  variant="outline"
                  className="h-10 rounded-2xl border-[#2B3038] text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creatingWalkin}
                  className="h-10 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs cursor-pointer"
                >
                  {creatingWalkin ? 'Logging...' : 'Save Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
