'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatOrderId } from '@/lib/utils';
import OrderRow from '@/app/admin/orders/OrderRow';
import { AdminOrderInspectorModal } from './AdminOrderInspectorModal';
import { Search, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminOrdersTableProps {
  initialOrders: any[];
}

export function AdminOrdersTable({ initialOrders }: AdminOrdersTableProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectingOrder, setInspectingOrder] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const searchParams = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

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

  // Calculate pagination
  const totalOrders = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalOrders);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 w-full max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-600 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (SDH-...), Customer Name, Email, Phone..."
            className="w-full bg-white border-2 border-slate-200 hover:border-violet-200 focus:border-violet-600 rounded-xl pl-10 pr-9 py-2 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-violet-600/10 outline-none transition-all shadow-2xs"
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
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-gray-400 text-center py-12 flex flex-col items-center gap-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
          <ShoppingBag size={36} className="text-gray-300" />
          <p className="text-xs font-bold text-gray-500">No customer orders match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile & Tablet Responsive Cards View (< xl) */}
          <div className="block xl:hidden space-y-4">
            {paginatedOrders.map((order: any) => (
              <OrderRow 
                key={order._id.toString()} 
                order={order} 
                isMobile 
                onInspect={(ord) => setInspectingOrder(ord)}
              />
            ))}
          </div>

          {/* Large Screen Desktop Table View (>= xl) */}
          <div className="hidden xl:block bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-gray-700 border-collapse min-w-[960px]">
                <thead className="bg-gray-50/90 border-b border-gray-200 text-[11px] text-gray-600 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Order ID</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Customer Info</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">Requested Service</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[100px]">Amount</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[140px]">Payment</th>
                    <th className="py-3.5 px-4 whitespace-nowrap min-w-[160px]">Order Status</th>
                    <th className="py-3.5 px-4 whitespace-nowrap text-center min-w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {paginatedOrders.map((order: any) => (
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

          {/* Professional Admin Pagination Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-gray-600 font-semibold">
              <span>
                Showing <span className="font-extrabold text-gray-900">{totalOrders > 0 ? startIndex + 1 : 0}</span> to{' '}
                <span className="font-extrabold text-gray-900">{endIndex}</span> of{' '}
                <span className="font-extrabold text-gray-900">{totalOrders}</span> Orders
              </span>

              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-gray-400">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-xs font-extrabold text-gray-900 outline-none cursor-pointer"
                >
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Page Buttons: Previous, Page 1, Page 2 ..., Next */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Display first, last, and pages around current page
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="text-gray-400 text-xs px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Order Inspector Modal */}
      <AdminOrderInspectorModal
        order={inspectingOrder}
        isOpen={!!inspectingOrder}
        onClose={() => setInspectingOrder(null)}
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}
