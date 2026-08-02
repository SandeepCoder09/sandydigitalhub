'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, PackageCheck, Clock, CheckCircle2, AlertCircle, FileText,
  PhoneCall, ShieldCheck, Download, ArrowRight, Loader2, Sparkles,
  MapPin, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackedOrder {
  orderId: string;
  createdAt: string;
  services: { title: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  documentUrl?: string;
  documentName?: string;
  customerName: string;
}

export default function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrders(null);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: searchInput.trim(), phone: searchInput.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.orders) {
        setOrders(data.orders);
      } else {
        setErrorMsg(data.error || 'No matching order found.');
      }
    } catch (err) {
      setErrorMsg('Could not fetch tracking data. Please try again or call +91 8756454282.');
    } finally {
      setLoading(false);
    }
  };

  const STATUS_STEPS = [
    { key: 'PENDING', label: 'Order Received', desc: 'Order logged & awaiting review' },
    { key: 'AWAITING_CUSTOMER_VISIT', label: 'Document Review', desc: 'Verification or awaiting shop visit' },
    { key: 'PROCESSING', label: 'In Processing', desc: 'Active submission at department' },
    { key: 'COMPLETED', label: 'Completed / Ready', desc: 'Certificate ready for download / pickup' },
  ];

  const getStepStatusIndex = (status: string) => {
    if (status === 'COMPLETED') return 3;
    if (status === 'PROCESSING') return 2;
    if (status === 'AWAITING_CUSTOMER_VISIT') return 1;
    return 0; // PENDING
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <PackageCheck size={14} /> Live Application & Project Tracker
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Track Your <span className="text-[#FF4500]">Order Status</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            Enter your Order ID, Razorpay Payment ID, or registered Phone Number to trace the real-time status of your Jan Seva application or web project.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleTrack} className="max-w-xl mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID or Phone Number (e.g. 64b8a... or 9876543210)"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-2xl px-6 text-xs shadow-lg shadow-orange-950 flex items-center gap-2 shrink-0"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Track Status'}
            </Button>
          </form>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <a href="tel:+918756454282" className="text-[#FF4500] underline font-extrabold shrink-0">
              Call Support
            </a>
          </div>
        )}

        {/* Search Results Display */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Found {orders.length} Matching Order(s)
            </h2>

            {orders.map((order) => {
              const currentStepIdx = getStepStatusIndex(order.orderStatus);

              return (
                <div key={order.orderId} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Order ID #{order.orderId}
                      </div>
                      <div className="text-sm font-extrabold text-gray-900 mt-0.5">
                        {order.services.map(s => s.title).join(', ')}
                      </div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">
                        Booked on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        order.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-[#FF4500]'
                      }`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                      <div className="text-sm font-black text-gray-900 mt-1">₹{order.total}</div>
                    </div>
                  </div>

                  {/* Interactive Status Timeline */}
                  <div className="py-4">
                    <div className="text-xs font-bold text-gray-700 mb-6">Application Progress Status:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCurrent
                                ? 'bg-[#FF4500] text-white ring-4 ring-orange-100 shadow-md scale-110'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}>
                              {isDone ? <CheckCircle2 size={18} /> : idx + 1}
                            </div>
                            <div>
                              <div className={`text-xs font-extrabold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                              </div>
                              <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Uploads / Download Ready Certificate */}
                  {order.documentUrl && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-emerald-900">Certificate / Document Ready!</div>
                          <div className="text-[11px] text-emerald-700 font-medium">{order.documentName || 'Download Document'}</div>
                        </div>
                      </div>
                      <a href={order.documentUrl} target="_blank" rel="noreferrer">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                          <Download size={14} /> Download
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Initial Empty State */}
        {!orders && !errorMsg && (
          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF4500] flex items-center justify-center mx-auto">
              <PackageCheck size={28} />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="text-base font-extrabold text-gray-900">Search Your Application</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Enter your Order ID received during checkout or phone number to check live processing status.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
