'use client';

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Eye, ShoppingBag, Search, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

interface RequestsTableProps {
  orders: any[];
  user: any;
}

export function RequestsTable({ orders, user }: RequestsTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (!orders || orders.length === 0) {
    return (
      <div className="text-white/50 text-center py-12 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-white/5 text-white/40">
          <ShoppingBag size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">No Requested Services Yet</h3>
          <p className="text-sm">You haven&apos;t placed any service requests or orders yet.</p>
        </div>
        <Link href="/services" className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#FF7A00]/90 transition-colors mt-2">
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
    if (statusFilter === 'COMPLETED') return order.orderStatus === 'COMPLETED';
    
    return true;
  });

  return (
    <>
      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (SDH-...) or Service..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#FF7A00] outline-none transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'PAID', label: 'Paid' },
            { id: 'AWAITING_VISIT', label: 'Awaiting Visit' },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#FF7A00] text-white shadow-md'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-white/50 text-center py-8 text-sm">
          No requested services match your search or filter.
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.map((order) => {
              const brandedId = formatOrderId(order._id, order.createdAt);
              const dateTimeStr = formatDateTime(order.createdAt);
              const servicesText = order.services?.map((s: any) => s.title).join(', ') || 'Service Request';

              return (
                <div key={order._id.toString()} className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-start gap-2 border-b border-white/5 pb-2">
                    <div>
                      <div className="text-xs text-[#FF7A00] font-mono font-bold">{brandedId}</div>
                      <div className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        <span>{dateTimeStr}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                      order.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-white/40 font-semibold uppercase flex items-center gap-1">
                      <Tag size={12} className="text-[#FF7A00]" />
                      Requested Services
                    </div>
                    <div className="text-sm font-medium text-white line-clamp-2">
                      {servicesText}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div>
                      <span className="text-xs text-white/50 mr-1.5">Total:</span>
                      <span className="text-base font-bold text-[#FF7A00]">₹{order.total}</span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF7A00] text-white text-xs font-bold shadow-md hover:bg-[#FF7A00]/90 transition-all"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-xl">
            <table className="w-full text-left text-white/80 border-collapse">
              <thead className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-white/50 bg-white/5">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Services</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredOrders.map((order) => {
                  const brandedId = formatOrderId(order._id, order.createdAt);
                  const dateTimeStr = formatDateTime(order.createdAt);
                  
                  return (
                    <tr key={order._id.toString()} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-white whitespace-nowrap">
                        {brandedId}
                      </td>
                      <td className="px-6 py-4 text-white/70 whitespace-nowrap text-xs">
                        {dateTimeStr}
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="truncate font-medium text-white">
                          {order.services?.map((s: any) => s.title).join(', ') || 'Service Request'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.paymentMethod === 'online' ? 'Pay Online' : 'Pay at Shop'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          order.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white/70">
                        {order.orderStatus === 'AWAITING_CUSTOMER_VISIT' ? 'Awaiting Visit' : order.orderStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-[#FF7A00]">
                        ₹{order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#FF7A00] text-white text-xs font-semibold transition-all group"
                        >
                          <Eye size={14} className="group-hover:scale-110 transition-transform" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Full Request Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        user={user}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}
