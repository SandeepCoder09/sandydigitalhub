'use client';

import { useState } from 'react';
import { formatOrderId } from '@/lib/utils';
import OrderRow from '@/app/admin/orders/OrderRow';
import { Search, ShoppingBag } from 'lucide-react';

interface AdminOrdersTableProps {
  initialOrders: any[];
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredOrders = orders.filter((order) => {
    const brandedId = formatOrderId(order._id, order.createdAt).toLowerCase();
    const customerName = (order.userId?.name || '').toLowerCase();
    const customerEmail = (order.userId?.email || '').toLowerCase();
    const customerMobile = (order.userId?.mobile || '').toLowerCase();
    const serviceTitles = order.services?.map((s: any) => s.title).join(' ').toLowerCase() || '';

    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      brandedId.includes(query) || 
      customerName.includes(query) || 
      customerEmail.includes(query) || 
      customerMobile.includes(query) || 
      serviceTitles.includes(query);

    if (!matchesQuery) return false;

    if (statusFilter === 'PAID') return order.paymentStatus === 'PAID';
    if (statusFilter === 'AWAITING_VISIT') return order.orderStatus === 'AWAITING_CUSTOMER_VISIT';
    if (statusFilter === 'PROCESSING') return order.orderStatus === 'PROCESSING';
    if (statusFilter === 'COMPLETED') return order.orderStatus === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return order.orderStatus === 'CANCELLED';

    return true;
  });

  return (
    <>
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (SDH-...), Name, Email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#FF7A00] outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'PAID', label: 'Paid' },
            { id: 'AWAITING_VISIT', label: 'Awaiting Visit' },
            { id: 'PROCESSING', label: 'Processing' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
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
        <div className="text-white/50 text-center py-12 flex flex-col items-center gap-4 bg-[#111111] rounded-2xl border border-white/10">
          <ShoppingBag size={32} className="text-white/30" />
          <p className="text-sm">No orders match your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.map((order: any) => (
              <OrderRow key={order._id.toString()} order={order} isMobile />
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-[#111111] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-white/80">
                <thead className="bg-white/5 border-b border-white/10 text-xs text-white/60 uppercase">
                  <tr>
                    <th className="p-4">Branded Order ID</th>
                    <th className="p-4">Customer Info</th>
                    <th className="p-4">Requested Services</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order: any) => (
                    <OrderRow key={order._id.toString()} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
