'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { CopyButton } from '@/components/ui/CopyButton';
import { 
  Eye, 
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
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface RequestsTableProps {
  orders: any[];
  user: any;
}

export function RequestsTable({ orders, user }: RequestsTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-2xs">
        <div className="w-16 h-16 rounded-3xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs">
          <ShoppingBag size={30} />
        </div>
        <div className="max-w-md space-y-1">
          <h3 className="text-lg font-black text-gray-900">No Requested Services Yet</h3>
          <p className="text-xs text-gray-500 font-medium">
            You haven&apos;t placed any service requests or orders yet. Explore our wide catalog of citizen & digital services.
          </p>
        </div>
        <Link 
          href="/services" 
          className="bg-violet-600 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-violet-700 transition-all shadow-md active:scale-95"
        >
          Browse Citizen Services
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
    PAID: orders.filter((o) => o.paymentStatus === 'PAID').length,
    AWAITING_VISIT: orders.filter((o) => o.orderStatus === 'AWAITING_CUSTOMER_VISIT').length,
    PROCESSING: orders.filter((o) => o.orderStatus === 'PROCESSING').length,
    COMPLETED: orders.filter((o) => o.orderStatus === 'COMPLETED').length,
    CANCELLED: orders.filter((o) => o.orderStatus === 'CANCELLED').length,
  };

  const getStatusBadge = (orderStatus: string, paymentStatus: string) => {
    if (orderStatus === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
          <CheckCircle2 size={11} className="text-emerald-600" />
          <span>COMPLETED</span>
        </span>
      );
    }
    if (orderStatus === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-violet-50 text-violet-700 border border-violet-200/80 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
          <span>PROCESSING</span>
        </span>
      );
    }
    if (orderStatus === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
          <XCircle size={11} className="text-rose-600" />
          <span>CANCELLED</span>
        </span>
      );
    }
    if (orderStatus === 'AWAITING_CUSTOMER_VISIT') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
          <Store size={11} className="text-amber-700" />
          <span>AWAITING VISIT</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
        <Clock size={11} className="text-slate-500" />
        <span>PENDING</span>
      </span>
    );
  };

  const filterTabs = [
    { id: 'ALL', label: 'All', count: counts.ALL },
    { id: 'COMPLETED', label: 'Completed', count: counts.COMPLETED },
    { id: 'PROCESSING', label: 'Processing', count: counts.PROCESSING },
    { id: 'AWAITING_VISIT', label: 'Awaiting Visit', count: counts.AWAITING_VISIT },
    { id: 'PAID', label: 'Paid', count: counts.PAID },
    { id: 'CANCELLED', label: 'Cancelled', count: counts.CANCELLED },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search & Filter Header */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID or service name..."
            className="w-full bg-white border-2 border-slate-200 hover:border-violet-200 focus:border-violet-600 rounded-2xl pl-10 pr-9 py-2.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-violet-600/10 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-violet-600 rounded-full w-4.5 h-4.5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Modern Horizontal Scroll Filter Chips (App-Grade UX) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {filterTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/90'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-2 shadow-2xs">
          <PackageSearch size={36} className="mx-auto text-gray-300" />
          <h4 className="text-xs font-black text-gray-900">No Orders Found</h4>
          <p className="text-[11px] text-gray-500 font-medium">No service requests match your search or selected filter.</p>
        </div>
      ) : (
        <>
          {/* Mobile & Tablet App-Grade Cards View (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const brandedId = formatOrderId(order._id, order.createdAt);
              const servicesText = order.services?.map((s: any) => s.title).join(', ') || 'Service Request';
              const isPaid = order.paymentStatus === 'PAID';

              return (
                <div 
                  key={order._id.toString()} 
                  className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-2xs space-y-3 hover:border-violet-300 transition-all"
                >
                  {/* Top Bar: Order ID + Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-violet-700 bg-violet-50/90 px-2.5 py-1 rounded-xl border border-violet-100">
                        {brandedId}
                      </span>
                      <CopyButton text={brandedId} />
                    </div>
                    <div>{getStatusBadge(order.orderStatus, order.paymentStatus)}</div>
                  </div>

                  {/* Service Details & Date */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Layers size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-gray-900 leading-snug line-clamp-2">
                          {servicesText}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                          <Calendar size={11} />
                          <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attached Document Pill if available */}
                    {order.documentUrl && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold">
                        <Paperclip size={10} className="text-violet-600" />
                        <span className="truncate max-w-[200px]">{order.documentName || 'Document Attached'}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Amount + Dual Action Buttons */}
                  <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-gray-900 flex items-baseline gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">Total:</span>
                        <span className="text-sm font-black text-violet-700">₹{order.total}</span>
                      </div>
                      <div className="text-[10px] font-bold mt-0.5">
                        {isPaid ? (
                          <span className="text-emerald-600">● Paid Online</span>
                        ) : (
                          <span className="text-amber-600">● Pay at Shop</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border border-violet-200 hover:border-violet-600 text-xs font-extrabold transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <PackageSearch size={13} />
                        <span>Track</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs border border-gray-200 active:scale-95 cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 shadow-2xs">
            <table className="w-full text-left text-gray-700 border-collapse">
              <thead className="border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 bg-gray-50/90">
                <tr>
                  <th className="px-4 py-3.5">Order & Date</th>
                  <th className="px-4 py-3.5">Requested Services</th>
                  <th className="px-3 py-3.5 text-center">Amount</th>
                  <th className="px-3 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-xs">
                {filteredOrders.map((order) => {
                  const brandedId = formatOrderId(order._id, order.createdAt);
                  const servicesText = order.services?.map((s: any) => s.title).join(', ') || 'Service Request';

                  return (
                    <tr key={order._id.toString()} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-gray-900 text-xs">
                          <span>{brandedId}</span>
                          <CopyButton text={brandedId} />
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                          <Calendar size={11} className="text-gray-400" />
                          <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="truncate font-semibold text-gray-800 max-w-[180px] lg:max-w-[280px]" title={servicesText}>
                          {servicesText}
                        </div>
                        {order.documentUrl && (
                          <div className="text-[10px] text-violet-600 mt-0.5 flex items-center gap-1">
                            <Paperclip size={10} />
                            <span className="truncate max-w-[160px]">{order.documentName || 'Attachment'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-violet-700 whitespace-nowrap text-xs sm:text-sm">
                        ₹{order.total}
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {getStatusBadge(order.orderStatus, order.paymentStatus)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-600 text-violet-700 hover:text-white border border-violet-200 hover:border-violet-600 text-xs font-bold transition-all shadow-2xs group cursor-pointer active:scale-95"
                            title="Live Tracking Pipeline"
                          >
                            <PackageSearch size={12} className="text-violet-600 group-hover:text-white transition-colors" />
                            <span>Track</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs cursor-pointer border border-gray-200 active:scale-95"
                            title="View Invoice & Attachments"
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Inspector */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          user={user}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* In-Page Live Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
}
