'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { FileText, Calendar, User, Tag, Paperclip, Printer, Eye, CheckCircle2, Clock, RefreshCw, XCircle, Store } from 'lucide-react';

export default function OrderRow({ order, isMobile = false, onInspect }: { order: any; isMobile?: boolean; onInspect?: (order: any) => void }) {
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (type: 'payment' | 'order', value: string) => {
    setLoading(true);
    try {
      const payload = type === 'payment' 
        ? { paymentStatus: value, orderStatus } 
        : { paymentStatus, orderStatus: value };

      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (type === 'payment') setPaymentStatus(value);
        if (type === 'order') setOrderStatus(value);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const brandedId = formatOrderId(order._id, order.createdAt);
  const dateTimeStr = formatDateTime(order.createdAt);
  const servicesText = order.services?.map((s: any) => s.title).join(', ') || 'Service Request';

  const handlePrintWorkOrder = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Work Order - ${brandedId}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #111; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 4px; color: #000; border-bottom: 2px solid #7C3AED; padding-bottom: 8px; }
            .meta { margin-top: 16px; margin-bottom: 20px; font-size: 14px; }
            .meta p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 16px; font-size: 13px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background: #f4f4f4; font-weight: bold; }
            .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 12px; }
            .notes { background: #fff8f0; border: 1px solid #ffe0c2; padding: 12px; border-radius: 8px; margin-top: 16px; font-size: 13px; }
            .footer { margin-top: 32px; font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>SANDY DIGITAL HUB — WORK ORDER RECEIPT</h1>
          <div class="meta">
            <p><strong>Work Order ID:</strong> ${brandedId}</p>
            <p><strong>Date & Time:</strong> ${dateTimeStr}</p>
            <p><strong>Customer Name:</strong> ${order.userId?.name || 'Customer'}</p>
            <p><strong>Email:</strong> ${order.userId?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> ${order.userId?.mobile || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Shop'} (${order.paymentStatus})</p>
          </div>

          <h3>Requested Services Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.services?.map((s: any) => `
                <tr>
                  <td>${s.title}</td>
                  <td style="text-align: center;">${s.quantity}</td>
                  <td style="text-align: right;">₹${s.price}</td>
                  <td style="text-align: right;">₹${(s.price * s.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            Total Amount: ₹${order.total}
          </div>

          ${order.notes ? `
            <div class="notes">
              <strong>Client Instructions / Notes:</strong>
              <p style="margin-top: 4px; white-space: pre-wrap;">${order.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            Sandy Digital Hub • Bairi, Khakhreru, Fatehpur, Uttar Pradesh, India - 212656 • Phone: +91 8756454282
          </div>
        </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  // Get status icon for Payment
  const getPaymentIcon = (status: string) => {
    if (status === 'PAID') return <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />;
    if (status === 'FAILED') return <XCircle size={13} className="text-red-600 shrink-0" />;
    return <Clock size={13} className="text-amber-600 shrink-0" />;
  };

  // Get status icon for Order Status
  const getOrderIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />;
    if (status === 'PROCESSING') return <RefreshCw size={13} className="text-violet-600 shrink-0 animate-spin-slow" />;
    if (status === 'CANCELLED') return <XCircle size={13} className="text-red-600 shrink-0" />;
    if (status === 'AWAITING_CUSTOMER_VISIT') return <Store size={13} className="text-purple-600 shrink-0" />;
    return <Clock size={13} className="text-amber-600 shrink-0" />;
  };

  if (isMobile) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex justify-between items-start border-b border-gray-100 pb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-violet-700 font-mono font-black">{brandedId}</span>
              <CopyButton text={brandedId} />
            </div>
            <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-0.5">
              <Calendar size={12} />
              <span>{dateTimeStr}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 font-medium">Total: </span>
            <span className="text-sm font-black text-gray-900">₹{order.total}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
            <User size={13} className="text-violet-600" />
            <span>{order.userId?.name || 'Customer'}</span>
          </div>
          <div className="text-xs text-gray-500 font-medium pl-5">{order.userId?.email} {order.userId?.mobile && `• ${order.userId.mobile}`}</div>
        </div>

        <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
          <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Tag size={11} className="text-violet-600" />
            Services
          </div>
          <div className="text-xs font-bold text-gray-900 line-clamp-2">{servicesText}</div>
          {order.notes && (
            <div className="mt-1 text-xs text-violet-700 flex items-center gap-1 font-semibold">
              <FileText size={12} />
              <span className="line-clamp-1">Note: {order.notes}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-extrabold mb-1">Payment Status</label>
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none">
                {getPaymentIcon(paymentStatus)}
              </div>
              <select 
                disabled={loading}
                className={`w-full pl-7 pr-2 py-1.5 text-xs font-black rounded-xl outline-none cursor-pointer border ${
                  paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
                value={paymentStatus}
                onChange={(e) => handleUpdate('payment', e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-extrabold mb-1">Order Status</label>
            <div className="relative flex items-center">
              <div className="absolute left-2.5 pointer-events-none">
                {getOrderIcon(orderStatus)}
              </div>
              <select 
                disabled={loading}
                className="w-full pl-7 pr-2 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none text-xs font-bold"
                value={orderStatus}
                onChange={(e) => handleUpdate('order', e.target.value)}
              >
                <option value="PENDING">PENDING</option>
                <option value="AWAITING_CUSTOMER_VISIT">AWAITING VISIT</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center gap-2 border-t border-gray-100">
          {onInspect && (
            <button
              onClick={() => onInspect(order)}
              className="flex-1 py-2 rounded-xl bg-violet-600 text-white text-xs font-extrabold shadow-xs hover:bg-violet-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Eye size={14} />
              <span>Inspect Order</span>
            </button>
          )}
          <button
            onClick={handlePrintWorkOrder}
            className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer border border-gray-200 flex items-center justify-center gap-1.5"
          >
            <Printer size={14} />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr className="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
      {/* Branded Order ID */}
      <td className="py-3 px-4 font-mono font-black text-violet-700 text-xs">
        <div className="flex items-center gap-1.5">
          <span>{brandedId}</span>
          <CopyButton text={brandedId} />
        </div>
      </td>

      {/* Customer Info */}
      <td className="py-3 px-4">
        <div className="text-xs font-extrabold text-gray-900 truncate">{order.userId?.name || 'Customer'}</div>
        <div className="text-[11px] text-gray-500 font-medium truncate">{order.userId?.email || 'N/A'}</div>
      </td>

      {/* Requested Services */}
      <td className="py-3 px-4">
        <div className="text-xs font-bold text-gray-900 truncate max-w-[220px]" title={servicesText}>
          {servicesText}
        </div>
        {order.documentUrl && (
          <div className="text-[11px] text-violet-600 mt-0.5">
            <a href={order.documentUrl} download={order.documentName || 'attachment'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline font-bold truncate">
              <Paperclip size={11} />
              <span className="truncate max-w-[160px]">{order.documentName || 'File'}</span>
            </a>
          </div>
        )}
      </td>

      {/* Total Amount */}
      <td className="py-3 px-4 font-black text-gray-900 text-xs">
        ₹{order.total}
      </td>

      {/* Payment Status Dropdown with SVG Icon */}
      <td className="py-3 px-4">
        <div className="relative flex items-center">
          <div className="absolute left-2.5 pointer-events-none">
            {getPaymentIcon(paymentStatus)}
          </div>
          <select 
            disabled={loading}
            className={`pl-7 pr-2 py-1 text-[11px] font-extrabold rounded-xl outline-none cursor-pointer border shadow-2xs transition-colors appearance-none ${
              paymentStatus === 'PAID'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : paymentStatus === 'FAILED'
                ? 'bg-red-50 text-red-900 border-red-300 hover:bg-red-100'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
            value={paymentStatus}
            onChange={(e) => handleUpdate('payment', e.target.value)}
          >
            <option value="PENDING" className="bg-white text-gray-900 font-bold">PENDING</option>
            <option value="PAID" className="bg-white text-gray-900 font-bold">PAID</option>
            <option value="FAILED" className="bg-white text-gray-900 font-bold">FAILED</option>
          </select>
        </div>
      </td>

      {/* Order Status Dropdown with SVG Icon */}
      <td className="py-3 px-4">
        <div className="relative flex items-center">
          <div className="absolute left-2.5 pointer-events-none">
            {getOrderIcon(orderStatus)}
          </div>
          <select 
            disabled={loading}
            className="pl-7 pr-2 py-1 bg-white border border-gray-200 hover:border-violet-300 rounded-xl text-gray-900 outline-none text-[11px] font-extrabold cursor-pointer shadow-2xs appearance-none transition-colors"
            value={orderStatus}
            onChange={(e) => handleUpdate('order', e.target.value)}
          >
            <option value="PENDING" className="bg-white text-gray-900 font-bold">PENDING</option>
            <option value="AWAITING_CUSTOMER_VISIT" className="bg-white text-gray-900 font-bold">AWAITING VISIT</option>
            <option value="PROCESSING" className="bg-white text-gray-900 font-bold">PROCESSING</option>
            <option value="COMPLETED" className="bg-white text-gray-900 font-bold">COMPLETED</option>
            <option value="CANCELLED" className="bg-white text-gray-900 font-bold">CANCELLED</option>
          </select>
        </div>
      </td>

      {/* Action Column: Icon Buttons with Tooltips */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1.5">
          {onInspect && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onInspect(order);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-[11px] flex items-center gap-1.5 shadow-xs transition-all hover:scale-105 cursor-pointer shrink-0"
              title="Inspect & Track Order Details"
            >
              <Eye size={13} />
              <span>Details</span>
            </button>
          )}

          <button
            onClick={handlePrintWorkOrder}
            className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 font-bold transition-all hover:scale-105 shrink-0 cursor-pointer"
            title="Print Work Order Receipt"
          >
            <Printer size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
