'use client';

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { OrderDetailsModal } from './OrderDetailsModal';
import { OrderTrackingModal } from './OrderTrackingModal';
import { CopyButton } from '@/components/ui/CopyButton';
import { Eye, ShoppingBag, Search, Calendar, Tag, PackageSearch } from 'lucide-react';
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
      <div className="text-gray-400 text-center py-12 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-purple-50 text-[#7C3AED]">
          <ShoppingBag size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Requested Services Yet</h3>
          <p className="text-sm text-gray-500">You haven&apos;t placed any service requests or orders yet.</p>
        </div>
        <Link href="/services" className="bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#6D28D9] transition-colors mt-2 shadow-md shadow-purple-200">
          Browse Services
        </Link>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const brandedId = formatOrderId(order._id, order.createdAt).toLowerCase();
    const serviceTitles = order.services?.map((s: any) => s.title).join(' ').toLowerCase() || '';
    const matchesQuery = brandedId.includes(searchQuery.toLowerCase()) || serviceTitles.includes(searchQuery.toLowerCase());
    
    if (!matchesQuery) return false;
    
    if (statusFilter === 'PAID') return order.paymentStatus === 'PAID';
    if (statusFilter === 'AWAITING_VISIT') return order.orderStatus === 'AWAITING_CUSTOMER_VISIT';
    if (statusFilter === 'PROCESSING') return order.orderStatus === 'PROCESSING';
    if (statusFilter === 'COMPLETED') return order.orderStatus === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return order.orderStatus === 'CANCELLED';
    
    return true;
  });

  const getStatusBadge = (orderStatus: string, paymentStatus: string) => {
    if (orderStatus === 'COMPLETED') {
      return <span className="bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">COMPLETED</span>;
    }
    if (orderStatus === 'PROCESSING') {
      return <span className="bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">PROCESSING</span>;
    }
    if (orderStatus === 'CANCELLED') {
      return <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">CANCELLED</span>;
    }
    if (orderStatus === 'AWAITING_CUSTOMER_VISIT') {
      return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">AWAITING SHOP VISIT</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">PENDING</span>;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C3AED] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (e.g. SDH-20260711) or service name..."
            className="w-full bg-white border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all shadow-xs"
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

        <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'PAID', label: 'Paid' },
            { id: 'AWAITING_VISIT', label: 'Awaiting Visit' },
            { id: 'PROCESSING', label: 'Processing' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#7C3AED] text-gray-800 shadow-md font-bold'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-400 text-center py-8 text-sm">
          No requested services found matching your filters.
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< md) */}
          <div className="block md:hidden space-y-3.5">
            {filteredOrders.map((order) => {
              const brandedId = formatOrderId(order._id, order.createdAt);
              const servicesText = order.services?.map((s: any) => s.title).join(', ') || 'Service Request';

              return (
                <div key={order._id.toString()} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-[#7C3AED]">{brandedId}</span>
                        <CopyButton text={brandedId} />
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                    </div>
                    <div>{getStatusBadge(order.orderStatus, order.paymentStatus)}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1">
                      <Tag size={12} className="text-[#7C3AED]" />
                      Services
                    </div>
                    <div className="text-sm font-medium text-gray-800 line-clamp-2">
                      {servicesText}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-xs text-gray-500 mr-1.5">Total:</span>
                      <span className="text-sm font-bold text-[#7C3AED]">₹{order.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <PackageSearch size={13} />
                        <span>Track</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-bold shadow-md hover:bg-[#6D28D9] transition-all cursor-pointer"
                      >
                        <Eye size={13} />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 shadow-2xs">
            <table className="w-full text-left text-gray-700 border-collapse">
              <thead className="border-b border-gray-200 text-[11px] font-extrabold uppercase tracking-wider text-gray-500 bg-gray-50/90">
                <tr>
                  <th className="px-4 py-3">Order & Date</th>
                  <th className="px-4 py-3">Requested Services</th>
                  <th className="px-3 py-3 text-center">Amount</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
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
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-[#7C3AED] whitespace-nowrap text-xs sm:text-sm">
                        ₹{order.total}
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {getStatusBadge(order.orderStatus, order.paymentStatus)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setTrackingOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white border border-purple-200 hover:border-[#7C3AED] text-xs font-bold transition-all shadow-2xs group cursor-pointer"
                            title="Live Tracking Pipeline"
                          >
                            <PackageSearch size={12} className="text-[#7C3AED] group-hover:text-white transition-colors" />
                            <span>Track</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all shadow-2xs cursor-pointer border border-gray-200"
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
