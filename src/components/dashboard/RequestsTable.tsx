'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { OrderReviewModal } from './OrderReviewModal';
import { CopyButton } from '@/components/ui/CopyButton';
import { useCartStore } from '@/store/cartStore';
import { toast } from '@/components/ui/Toast';
import { 
  ShoppingBag, 
  Search, 
  Calendar, 
  PackageSearch, 
  Paperclip,
  CheckCircle2,
  Clock,
  RotateCw,
  XCircle,
  Store,
  ChevronRight,
  Download,
  Star,
  Sparkles,
  MessageCircle,
  FileText,
  CreditCard,
  Plus
} from 'lucide-react';

interface RequestsTableProps {
  orders: any[];
  user: any;
}

// Service image mapping helper
const getServiceImage = (title: string, defaultImg?: string) => {
  if (defaultImg) return defaultImg;
  const t = title?.toLowerCase() || '';
  if (t.includes('pan') && t.includes('correction')) return '/services/pan-correction.webp';
  if (t.includes('pan')) return '/services/pan-new-application.webp';
  if (t.includes('resume') || t.includes('cv') || t.includes('cover')) return '/services/resume-cover-letter.webp';
  if (t.includes('aadhaar')) return '/services/aadhaar-download-print.webp';
  if (t.includes('passport') && t.includes('photo')) return '/services/passport-photo-printing.webp';
  if (t.includes('passport')) return '/services/passport-application.webp';
  if (t.includes('income') || t.includes('aay')) return '/services/income-certificate.webp';
  if (t.includes('caste') || t.includes('jati')) return '/services/caste-certificate.webp';
  if (t.includes('domicile') || t.includes('niwas') || t.includes('residence')) return '/services/residence-certificate.webp';
  if (t.includes('khasra') || t.includes('bhulekh') || t.includes('land')) return '/services/khasra-khatauni-bhulekh.webp';
  if (t.includes('ration')) return '/services/ration-card.webp';
  if (t.includes('voter')) return '/services/voter-id.webp';
  if (t.includes('scholarship')) return '/services/up-scholarship.webp';
  if (t.includes('pf') || t.includes('epfo')) return '/services/pf-epfo-kyc.webp';
  if (t.includes('driving') || t.includes('dl')) return '/services/driving-license.webp';
  if (t.includes('print') && t.includes('color')) return '/services/document-printing-color.webp';
  if (t.includes('print')) return '/services/document-printing-bw.webp';
  if (t.includes('photocopy') && t.includes('color')) return '/services/photocopy-color.webp';
  if (t.includes('photocopy')) return '/services/photocopy-bw.webp';
  if (t.includes('web') || t.includes('app')) return '/services/website-development.webp';
  return '/services/resume-cover-letter.webp';
};

export function RequestsTable({ orders: initialOrders, user }: RequestsTableProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [reviewOrder, setReviewOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const addItem = useCartStore((state) => state.addItem);

  const handleReorder = (service: any) => {
    addItem({
      serviceId: service.serviceId || `reorder-${Date.now()}`,
      title: service.title,
      price: service.price || 199,
      quantity: 1,
      image: getServiceImage(service.title, service.image),
    });
    toast.success(`"${service.title}" added to your cart!`, 'Added to Cart');
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-14 text-center flex flex-col items-center gap-4 shadow-2xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shadow-xs">
          <ShoppingBag size={34} />
        </div>
        <div className="max-w-md space-y-1.5">
          <h3 className="text-lg sm:text-xl font-black text-gray-900">You have no orders yet</h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Explore our wide catalog of Jan Seva Kendra, government certificates, and digital services.
          </p>
        </div>
        <Link 
          href="/services" 
          className="mt-2 bg-[#7C3AED] text-white px-7 py-3 rounded-2xl text-xs sm:text-sm font-black hover:bg-[#6D28D9] transition-all shadow-md active:scale-95 flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Explore Services</span>
        </Link>
      </div>
    );
  }

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const brandedId = formatOrderId(order._id, order.createdAt).toLowerCase();
    const serviceTitles = order.services?.map((s: any) => s.title).join(' ').toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || brandedId.includes(query) || serviceTitles.includes(query);
    
    if (!matchesQuery) return false;
    
    if (statusFilter === 'PAID') return order.paymentStatus === 'PAID';
    if (statusFilter === 'AWAITING_VISIT') return order.orderStatus === 'AWAITING_CUSTOMER_VISIT';
    if (statusFilter === 'PROCESSING') return order.orderStatus === 'PROCESSING';
    if (statusFilter === 'COMPLETED') return order.orderStatus === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return order.orderStatus === 'CANCELLED';
    
    return true;
  });

  // Calculate live counts for filter chips
  const counts = {
    ALL: orders.length,
    COMPLETED: orders.filter((o) => o.orderStatus === 'COMPLETED').length,
    PROCESSING: orders.filter((o) => o.orderStatus === 'PROCESSING').length,
    AWAITING_VISIT: orders.filter((o) => o.orderStatus === 'AWAITING_CUSTOMER_VISIT').length,
    PAID: orders.filter((o) => o.paymentStatus === 'PAID').length,
    CANCELLED: orders.filter((o) => o.orderStatus === 'CANCELLED').length,
  };

  const getStatusIndicator = (orderStatus: string, dateStr: string) => {
    const formattedDate = new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    if (orderStatus === 'COMPLETED') {
      return (
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2 sm:p-2.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>Delivered / Completed on {formattedDate}</span>
          </div>
          <p className="text-[10.5px] text-emerald-700/90 font-medium pl-3.5 leading-tight">
            Your certificate & document processing is ready for download
          </p>
        </div>
      );
    }
    if (orderStatus === 'PROCESSING') {
      return (
        <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-2 sm:p-2.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-800">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-ping shrink-0" />
            <span>In Processing</span>
          </div>
          <p className="text-[10.5px] text-purple-700/90 font-medium pl-3.5 leading-tight">
            Submitted to department · Expected within 24–48 hrs
          </p>
        </div>
      );
    }
    if (orderStatus === 'AWAITING_CUSTOMER_VISIT') {
      return (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 sm:p-2.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Shop Visit Required</span>
          </div>
          <p className="text-[10.5px] text-amber-800 font-medium pl-3.5 leading-tight">
            Please visit center for biometric or physical verification
          </p>
        </div>
      );
    }
    if (orderStatus === 'CANCELLED') {
      return (
        <div className="bg-rose-50/70 border border-rose-200/70 rounded-xl p-2 sm:p-2.5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>Order Cancelled</span>
          </div>
          <p className="text-[10.5px] text-rose-700/90 font-medium pl-3.5 leading-tight">
            This request has been cancelled or refunded
          </p>
        </div>
      );
    }
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-2.5 space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
          <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
          <span>Order Confirmed</span>
        </div>
        <p className="text-[10.5px] text-slate-600 font-medium pl-3.5 leading-tight">
          Under verification by facilitation team
        </p>
      </div>
    );
  };

  const filterTabs = [
    { id: 'ALL', label: 'All Orders', count: counts.ALL },
    { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
    { id: 'PROCESSING', label: 'In Progress', count: counts.PROCESSING },
    { id: 'AWAITING_VISIT', label: 'Awaiting Visit', count: counts.AWAITING_VISIT },
    { id: 'PAID', label: 'Paid Online', count: counts.PAID },
    { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED },
  ];

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* ─────────────────────────────────────────────────────────────
          1. E-COMMERCE SEARCH & HORIZONTAL FILTER TABS
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-2xs space-y-2.5 sm:space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in orders by Order ID or service name..."
            className="w-full bg-slate-50/70 hover:bg-white focus:bg-white border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] rounded-xl sm:rounded-2xl pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-purple-600/10 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-4.5 h-4.5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Flipkart-Style Horizontal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#7C3AED] text-white shadow-xs scale-[1.01]'
                    : 'bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] border border-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. FLIPKART-STYLE ORDER CARDS LIST (Unified for Mobile & Desktop)
      ───────────────────────────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center space-y-2.5 shadow-2xs">
          <PackageSearch size={40} className="mx-auto text-gray-300" />
          <h4 className="text-sm font-black text-gray-900">No Orders Found</h4>
          <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">
            We couldn't find any orders matching "{searchQuery}". Try searching with another keyword or change your filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="mt-2 text-xs font-black text-[#7C3AED] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {filteredOrders.map((order) => {
            const brandedId = formatOrderId(order._id, order.createdAt);
            const isPaid = order.paymentStatus === 'PAID';
            const primaryService = order.services?.[0] || { title: 'Digital Service Request', price: order.total, quantity: 1 };
            const extraServicesCount = (order.services?.length || 1) - 1;
            const itemImage = getServiceImage(primaryService.title, primaryService.image);

            return (
              <div 
                key={order._id.toString()} 
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden group"
              >
                {/* ── Order Top Meta Header (Flipkart / Amazon Style) ── */}
                <div className="bg-slate-50/90 px-3.5 sm:px-5 py-2.5 border-b border-slate-200/70 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:justify-between text-xs">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded-md sm:rounded-lg border border-slate-200/80 shadow-2xs text-[11px] sm:text-xs">
                      <span className="text-[#7C3AED]">{brandedId}</span>
                      <CopyButton text={brandedId} />
                    </div>

                    <div className="sm:hidden flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">₹{order.total}</span>
                      <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border ${
                        isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isPaid ? 'Paid' : 'Pay at Shop'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 text-slate-500 font-medium text-[10.5px] sm:text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-slate-400" />
                      <span>Placed on {formatDateTime(order.createdAt)}</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-slate-900">₹{order.total}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                        isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isPaid ? '● Paid Online' : '● Pay at Shop'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Order Content Body ── */}
                <div className="p-3 sm:p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                    
                    {/* Left & Center: Service Thumbnail + Details (lg:col-span-7) */}
                    <div className="lg:col-span-7 flex items-start gap-3 sm:gap-3.5">
                      {/* Product / Service Thumbnail */}
                      <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                        <Image
                          src={itemImage}
                          alt={primaryService.title}
                          fill
                          sizes="72px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {extraServicesCount > 0 && (
                          <div className="absolute bottom-0 right-0 left-0 bg-slate-900/80 backdrop-blur-xs text-white text-[8.5px] font-black text-center py-0.5">
                            +{extraServicesCount} more
                          </div>
                        )}
                      </div>

                      {/* Service Info */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                          {primaryService.title}
                          {extraServicesCount > 0 && (
                            <span className="text-slate-500 font-medium text-[11px] ml-1">
                              (+{extraServicesCount} other {extraServicesCount === 1 ? 'service' : 'services'})
                            </span>
                          )}
                        </h3>

                        <div className="text-[10.5px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                          <span>Qty: {primaryService.quantity || 1}</span>
                          <span>·</span>
                          <span>₹{primaryService.price || order.total}</span>
                          <span>·</span>
                          <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded text-[10px] border border-purple-100">
                            Digital Token
                          </span>
                        </div>

                        {/* Document Attachment Pill if ready */}
                        {order.documentUrl && (
                          <div className="pt-0.5">
                            <a
                              href={order.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] sm:text-[11px] font-bold transition-colors shadow-2xs"
                            >
                              <Paperclip size={11} className="text-emerald-600" />
                              <span className="truncate max-w-[200px]">
                                {order.documentName || 'Download Certificate'}
                              </span>
                              <Download size={10} className="text-emerald-700" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Flipkart-Style Delivery Status Pipeline (lg:col-span-5) */}
                    <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-2.5 lg:pt-0 lg:pl-5">
                      {getStatusIndicator(order.orderStatus, order.createdAt)}

                      {/* Star Rating Display or Prompt */}
                      {order.orderStatus === 'COMPLETED' && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {order.rating ? (
                            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-[11px]">
                              <Star size={11} className="fill-amber-400" />
                              <span>Rated {order.rating}/5</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReviewOrder(order)}
                              className="text-[10.5px] font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Star size={11} />
                              <span>Rate & Review this Service</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Order Bottom Action Footer (Flipkart Style Action Strip) ── */}
                <div className="bg-slate-50/50 px-3 sm:px-5 py-2 sm:py-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10.5px] text-slate-500 font-semibold flex items-center gap-1">
                    <MessageCircle size={12} className="text-slate-400" />
                    <span>Need help?</span>
                    <a 
                      href={`https://wa.me/+919118269278?text=${encodeURIComponent(`Hi Sandy Digital Hub! Need update on Order ${brandedId}`)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#7C3AED] hover:underline font-bold"
                    >
                      WhatsApp
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
                    <button
                      onClick={() => handleReorder(primaryService)}
                      className="inline-flex items-center justify-center gap-1 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] border border-slate-200 hover:border-purple-200 text-[11px] sm:text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                      title="Add to cart again"
                    >
                      <RotateCw size={11} />
                      <span>Reorder</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center gap-1 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-bold transition-all shadow-2xs border border-slate-200 active:scale-95 cursor-pointer"
                      title="View full order details & invoice"
                    >
                      <FileText size={11} />
                      <span>Invoice</span>
                    </button>

                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="inline-flex items-center justify-center gap-1 h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg sm:rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] sm:text-xs font-extrabold transition-all shadow-xs shadow-purple-600/20 active:scale-95 cursor-pointer"
                      title="Live Tracking Pipeline"
                    >
                      <PackageSearch size={12} />
                      <span>Track</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MODAL INSPECTORS (Details, Tracking, Review)
      ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          user={user}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {reviewOrder && (
        <OrderReviewModal
          order={reviewOrder}
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={(updatedOrder) => {
            setOrders((prev) =>
              prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
            );
          }}
        />
      )}
    </div>
  );
}
