'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Search, PackageCheck, Clock, CheckCircle2, AlertCircle, FileText,
  Download, ArrowRight, Loader2, Sparkles, Copy, Check,
  FileDigit, ImageIcon, Code, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatOrderId } from '@/lib/utils';

interface TrackedOrder {
  orderId?: string;
  _id?: string;
  createdAt: string;
  services: { title: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  documentUrl?: string;
  documentName?: string;
  customerName?: string;
}

const FEATURED_SERVICES = [
  {
    title: "PAN Card Application",
    category: "Government Services",
    icon: FileDigit,
    desc: "Track new PAN card & correction application processing",
    keywords: ["pan", "aadhaar", "gov", "card"],
  },
  {
    title: "Govt Job Photo Resizer",
    category: "Instant Online Tool",
    icon: ImageIcon,
    desc: "Check UPSC, SSC, IBPS photo & signature specifications",
    keywords: ["photo", "passport", "print", "image"],
  },
  {
    title: "Income & Caste Certificate",
    category: "Jan Seva Kendra",
    icon: FileText,
    desc: "Trace UP Jan Seva E-District application status",
    keywords: ["income", "caste", "certificate", "license", "dl", "epfo", "pf"],
  },
  {
    title: "Website & App Development",
    category: "Digital Project",
    icon: Code,
    desc: "Live design, development & deployment milestone tracking",
    keywords: ["web", "app", "website", "resume", "design", "development"],
  },
];

export default function TrackOrderPage() {
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<TrackedOrder[]>([]);
  const [recentOrderChips, setRecentOrderChips] = useState<{ id: string; brandedId: string }[]>([]);

  // Fetch user's orders if logged in
  useEffect(() => {
    if (session?.user) {
      fetchUserOrders();
    }
  }, [session]);

  const fetchUserOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.orders && data.orders.length > 0) {
        setUserOrders(data.orders);
        const chips = data.orders.map((o: any) => ({
          id: o._id,
          brandedId: formatOrderId(o._id, o.createdAt),
        }));
        setRecentOrderChips(chips.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    }
  };

  const handleTrack = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();

    const query = customQuery || searchInput.trim();
    
    if (!query) {
      // If empty search input but user has recent orders, pick top order
      if (recentOrderChips.length > 0) {
        const topBrandedId = recentOrderChips[0].brandedId;
        setSearchInput(topBrandedId);
        return handleTrack(undefined, topBrandedId);
      }

      setErrorMsg('Please enter your Branded Order ID (SDH-...) or Phone Number above.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOrders(null);
    setActiveQuery(query);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: query, phone: query }),
      });

      const data = await res.json();

      if (res.ok && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        setErrorMsg(data.error || 'No matching order found. Check your Order ID or Phone Number.');
      }
    } catch (err) {
      setErrorMsg('Could not fetch tracking data. Please try again or call +91 8756454282.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardTrackClick = (service: typeof FEATURED_SERVICES[0]) => {
    // 1. If user typed something in search box, use that
    if (searchInput.trim()) {
      handleTrack(undefined, searchInput.trim());
      return;
    }

    // 2. Search in user's actual orders for a matching service title/keyword
    if (userOrders.length > 0) {
      const matchedOrder = userOrders.find((o) =>
        o.services.some((s) =>
          service.keywords.some((kw) => s.title.toLowerCase().includes(kw))
        )
      );

      if (matchedOrder) {
        const brandedId = formatOrderId(matchedOrder._id || matchedOrder.orderId || '', matchedOrder.createdAt);
        setSearchInput(brandedId);
        handleTrack(undefined, brandedId);
        return;
      }

      // If no keyword match, use top recent order ID
      const topOrder = userOrders[0];
      const brandedId = formatOrderId(topOrder._id || topOrder.orderId || '', topOrder.createdAt);
      setSearchInput(brandedId);
      handleTrack(undefined, brandedId);
      return;
    }

    // 3. If guest user with no orders, prompt and focus input field
    inputRef.current?.focus();
    setErrorMsg(`Please enter your Branded Order ID (SDH-...) or Phone Number above to track your ${service.title}.`);
  };

  const handleChipClick = (brandedId: string) => {
    setSearchInput(brandedId);
    handleTrack(undefined, brandedId);
  };

  const clearSearch = () => {
    setSearchInput('');
    setOrders(null);
    setActiveQuery(null);
    setErrorMsg('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
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

  const renderOrderCard = (order: TrackedOrder) => {
    const id = order.orderId || order._id || '';
    const brandedId = formatOrderId(id, order.createdAt);
    const currentStepIdx = getStepStatusIndex(order.orderStatus);

    return (
      <div key={id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 transition-all hover:shadow-md">
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 tracking-wider">
                {brandedId}
              </span>
              <button
                onClick={() => copyToClipboard(brandedId)}
                className="text-gray-400 hover:text-[#7C3AED] transition-colors p-1.5 rounded-md hover:bg-slate-100 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Copy Branded Order ID"
              >
                {copiedId === brandedId ? (
                  <span className="text-emerald-600 flex items-center gap-1"><Check size={13} /> Copied!</span>
                ) : (
                  <span className="text-gray-500 flex items-center gap-1"><Copy size={13} /> Copy</span>
                )}
              </button>
            </div>
            <div className="text-base font-extrabold text-gray-900 mt-2">
              {order.services.map((s) => s.title).join(', ')}
            </div>
            <div className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
              <Clock size={13} className="text-gray-400" />
              <span>Booked on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                order.orderStatus === 'COMPLETED'
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-purple-100 text-[#7C3AED] border border-purple-200'
              }`}
            >
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
            <div className="text-base font-black text-gray-900 mt-1">₹{order.total}</div>
          </div>
        </div>

        {/* Interactive Status Timeline */}
        <div className="py-2">
          <div className="text-xs font-bold text-gray-700 mb-5 flex items-center gap-2">
            <span>Application Progress Status:</span>
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
              Step {currentStepIdx + 1} of 4
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {STATUS_STEPS.map((step, idx) => {
              const isDone = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#7C3AED] text-white ring-4 ring-purple-100 shadow-md scale-110'
                        : isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
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
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm">
                <Download size={14} /> Download
              </Button>
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-10 sm:pt-14 pb-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-purple-50 rounded-full blur-3xl opacity-80" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <PackageCheck size={14} /> Live Application & Service Tracker
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
            Track Your <span className="text-[#7C3AED]">Order Status</span>
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Enter your Branded Order ID (SDH-...), Payment ID, or registered Phone Number to check real-time processing updates.
          </p>

          {/* Search Bar Form */}
          <form onSubmit={(e) => handleTrack(e)} className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order ID or Phone Number (e.g. SDH-2026... or 9876543210)"
                className="w-full h-14 pl-12 pr-11 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold focus:outline-none border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/15 shadow-lg shadow-purple-900/5 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-5 h-5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-sm sm:text-base rounded-2xl px-8 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Search size={18} />
                  <span>Track Status</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick-select Order ID Chips for Logged-In User */}
          {recentOrderChips.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
              <span className="text-slate-600 font-bold">Your Recent Orders:</span>
              {recentOrderChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleChipClick(chip.brandedId)}
                  className="font-mono bg-purple-50 hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white border border-purple-200 hover:border-[#7C3AED] px-3 py-1 rounded-xl transition-all cursor-pointer text-[11px] font-extrabold shadow-2xs hover:shadow-sm active:scale-95"
                >
                  {chip.brandedId}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
            <a href="tel:+918756454282" className="text-[#7C3AED] underline font-extrabold shrink-0">
              Call Support
            </a>
          </div>
        )}

        {/* Display Clicked / Searched Requested Service Status Result Only */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <PackageCheck size={16} className="text-[#7C3AED]" />
                Track Result for: <span className="font-mono font-extrabold text-gray-900">{activeQuery}</span> ({orders.length})
              </h2>
              <button
                onClick={clearSearch}
                className="text-xs font-bold text-gray-500 hover:text-[#7C3AED] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} /> Clear & Track Another
              </button>
            </div>
            <div className="space-y-6">
              {orders.map((order) => renderOrderCard(order))}
            </div>
          </div>
        )}

        {/* Common Requested Services Cards for Manual 1-Click Track */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles size={18} className="text-[#7C3AED]" />
                Common Requested Services & Tracking Options
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Click "Track Status" on any service below to view its live processing status
              </p>
            </div>
            <Link href="/services" className="text-xs font-extrabold text-[#7C3AED] hover:underline flex items-center gap-1">
              View All Services <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURED_SERVICES.map((srv) => {
              const ServiceIcon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs hover:shadow-md transition-all flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                    <ServiceIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 inline-block px-2 py-0.5 rounded-md mb-1">
                      {srv.category}
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 truncate">{srv.title}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5 line-clamp-2">
                      {srv.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleCardTrackClick(srv)}
                        className="text-xs font-extrabold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 cursor-pointer"
                      >
                        Track Status <ArrowRight size={12} />
                      </button>
                      <span className="text-gray-300">•</span>
                      <Link href="/services" className="text-xs font-bold text-gray-500 hover:text-gray-900">
                        Apply Online
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Initial Empty State when no search executed */}
        {!orders && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto">
              <PackageCheck size={26} />
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-gray-900">Track Any Application Instantly</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Enter your Branded Order ID (e.g. SDH-20260805-8CC84C) or registered Phone Number, or click "Track Status" on any service above.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
