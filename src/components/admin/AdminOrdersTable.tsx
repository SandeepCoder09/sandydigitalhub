'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatOrderId } from '@/lib/utils';
import OrderRow from '@/app/admin/orders/OrderRow';
import { AdminOrderInspectorModal } from './AdminOrderInspectorModal';
import { Search, ShoppingBag } from 'lucide-react';

interface AdminOrdersTableProps {
  initialOrders: any[];
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectingOrder, setInspectingOrder] = useState<any>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const handleOrderUpdate = (updated: any) => {
    setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
  };

  const filteredOrders = orders.filter((order) => {
    const brandedId = formatOrderId(order._id, order.createdAt).toLowerCase();
    const rawId = order._id.toString().toLowerCase();
    const customerName = (order.userId?.name || '').toLowerCase();
    const customerEmail = (order.userId?.email || '').toLowerCase();
    const customerMobile = (order.userId?.mobile || '').toLowerCase();
    const serviceTitles = order.services?.map((s: any) => s.title).join(' ').toLowerCase() || '';

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      brandedId.includes(query) || 
      rawId.includes(query) || 
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
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4500]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (SDH-...), Customer Name, Email, Phone..."
            className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#FF4500] outline-none transition-colors shadow-sm"
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
                  ? 'bg-[#FF4500] text-white shadow-md font-bold'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-400 text-center py-12 flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <ShoppingBag size={32} className="text-gray-300" />
          <p className="text-sm">No orders match your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< md) */}
          <div className="block md:hidden space-y-4">
            {filteredOrders.map((order: any) => (
              <OrderRow 
                key={order._id.toString()} 
                order={order} 
                isMobile 
                onInspect={(ord) => setInspectingOrder(ord)}
              />
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
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
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order: any) => (
                    <OrderRow 
                      key={order._id.toString()} 
                      order={order} 
                      onInspect={(ord) => setInspectingOrder(ord)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Admin Order Inspector Modal */}
      <AdminOrderInspectorModal
        order={inspectingOrder}
        isOpen={!!inspectingOrder}
        onClose={() => setInspectingOrder(null)}
        onOrderUpdate={handleOrderUpdate}
      />
    </>
  );
}
