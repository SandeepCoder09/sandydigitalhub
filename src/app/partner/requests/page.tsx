'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  RefreshCw,
  Edit,
  FileText,
  User,
  Phone,
  Calendar,
  Save,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export default function PartnerRequestsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const [updateForm, setUpdateForm] = useState({
    orderStatus: '',
    statusNote: '',
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/partner/requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpdate = (ord: any) => {
    setSelectedOrder(ord);
    setUpdateForm({
      orderStatus: ord.orderStatus,
      statusNote: '',
      notes: ord.notes || '',
    });
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await fetch(`/api/partner/requests/${selectedOrder._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Request status updated successfully!');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to update request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={11} /> Completed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <RefreshCw size={11} className="animate-spin" /> Processing
          </span>
        );
      case 'AWAITING_CUSTOMER_VISIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={11} /> Awaiting Visit
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock size={11} /> Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Ban size={11} /> Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-slate-400 font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#111318] p-6 sm:p-7 rounded-3xl border border-[#2B3038] shadow-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Center Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Manage customer applications, update processing milestones, and view document history.
          </p>
        </div>

        <Button
          onClick={() => fetchOrders()}
          variant="outline"
          className="h-10 px-4 rounded-2xl border-[#2B3038] bg-[#181B21] hover:bg-[#20242B] text-slate-300 text-xs font-bold shrink-0"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin mr-1.5' : 'mr-1.5'} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#111318] p-4 rounded-3xl border border-[#2B3038] flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrders();
          }}
          className="relative w-full md:w-96"
        >
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or service..."
            className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-bold shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181B21] border border-[#2B3038] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="AWAITING_CUSTOMER_VISIT">Awaiting Visit</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-[#111318] rounded-3xl border border-[#2B3038] overflow-hidden text-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181B21] border-b border-[#2B3038] text-slate-400 font-black uppercase text-[10px]">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer Info</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Fee / Earning</th>
                <th className="p-4">Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2B3038]/60 text-slate-300 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <RefreshCw className="animate-spin inline mr-2 text-violet-400" size={16} />
                    Loading requests...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 space-y-2">
                    <ShoppingBag size={32} className="mx-auto text-slate-600" />
                    <div className="text-sm font-bold text-white">No Service Requests Found</div>
                    <p className="text-xs">Incoming customer submissions will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#181B21]/50">
                    <td className="p-4 pl-6 font-mono font-bold text-violet-400">
                      #{ord._id.toString().substring(0, 8)}
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-white text-xs">
                        {ord.customerName || 'Customer'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {ord.customerPhone || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">
                        {ord.services?.map((s: any) => s.title).join(', ') || 'General Service'}
                      </div>
                      {ord.notes && (
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{ord.notes}</div>
                      )}
                    </td>
                    <td className="p-4">{getStatusBadge(ord.orderStatus)}</td>
                    <td className="p-4">
                      <div className="font-bold text-emerald-400">₹{ord.total}</div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Share: ₹{ord.commission?.partnerEarnings || Math.round(ord.total * 0.8)}
                      </div>
                    </td>
                    <td className="p-4 text-[11px] text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenUpdate(ord)}
                        className="h-8 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        <Edit size={12} className="mr-1" />
                        <span>Update</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* [Update Status Modal] */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111318] border border-[#2B3038] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#2B3038] pb-4">
              <div>
                <h3 className="text-base font-black text-white">
                  Update Request #{selectedOrder._id.toString().substring(0, 8)}
                </h3>
                <p className="text-xs text-slate-400">{selectedOrder.customerName} · {selectedOrder.customerPhone}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-[#181B21] text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Processing Status</label>
                <select
                  value={updateForm.orderStatus}
                  onChange={(e) => setUpdateForm({ ...updateForm, orderStatus: e.target.value })}
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none font-bold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="AWAITING_CUSTOMER_VISIT">AWAITING CUSTOMER VISIT</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="COMPLETED">COMPLETED (Finished)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Milestone / Timeline Note</label>
                <input
                  type="text"
                  value={updateForm.statusNote}
                  onChange={(e) => setUpdateForm({ ...updateForm, statusNote: e.target.value })}
                  placeholder="e.g. Application submitted on portal, ACK# generated"
                  className="w-full bg-[#181B21] border border-[#2B3038] focus:border-violet-500 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-300">Internal Counter Notes</label>
                <textarea
                  rows={2}
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                  placeholder="Notes visible only to your center staff..."
                  className="w-full bg-[#181B21] border border-[#2B3038] rounded-2xl p-3 text-xs text-white outline-none"
                />
              </div>

              {/* Order Timeline Preview */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#2B3038]">
                  <span className="text-[11px] font-black uppercase text-slate-400 block">Activity History</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {selectedOrder.timeline.map((item: any, idx: number) => (
                      <div key={idx} className="text-[11px] p-2 rounded-xl bg-[#181B21] border border-[#2B3038] text-slate-300 flex items-center justify-between">
                        <div>
                          <strong className="text-violet-400">[{item.status}]</strong> {item.note}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2B3038]">
                <Button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="h-10 rounded-2xl border-[#2B3038] text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="h-10 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Updates'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
