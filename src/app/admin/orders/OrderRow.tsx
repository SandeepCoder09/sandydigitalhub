'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { FileText, Calendar, User, Tag, Paperclip, Printer } from 'lucide-react';

export default function OrderRow({ order, isMobile = false }: { order: any; isMobile?: boolean }) {
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
            h1 { font-size: 20px; margin-bottom: 4px; color: #000; border-bottom: 2px solid #FF7A00; padding-bottom: 8px; }
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
          <div className="meta">
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

          <div className="total">
            Total Amount: ₹${order.total}
          </div>

          ${order.notes ? `
            <div className="notes">
              <strong>Client Instructions / Notes:</strong>
              <p style="margin-top: 4px; white-space: pre-wrap;">${order.notes}</p>
            </div>
          ` : ''}

          <div className="footer">
            Sandy Digital Hub • Bairi, Khakhreru, Fatehpur, Uttar Pradesh, India • Phone: +91 8756454282
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

  if (isMobile) {
    return (
      <div className="bg-[#111111] p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex justify-between items-start border-b border-white/5 pb-2">
          <div>
            <div className="text-xs text-[#FF7A00] font-mono font-bold">{brandedId}</div>
            <div className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
              <Calendar size={12} />
              <span>{dateTimeStr}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/50">Total: </span>
            <span className="text-sm font-bold text-[#FF7A00]">₹{order.total}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            <User size={13} className="text-[#FF7A00]" />
            <span>{order.userId?.name || 'Customer'}</span>
          </div>
          <div className="text-xs text-white/50 pl-5">{order.userId?.email} {order.userId?.mobile && `• ${order.userId.mobile}`}</div>
        </div>

        <div className="space-y-1 bg-white/5 p-2.5 rounded-lg border border-white/5">
          <div className="text-[11px] text-white/40 font-semibold uppercase flex items-center gap-1">
            <Tag size={12} className="text-[#FF7A00]" />
            Services
          </div>
          <div className="text-xs font-medium text-white line-clamp-2">{servicesText}</div>
          {order.notes && (
            <div className="mt-1 text-xs text-[#FF7A00] flex items-center gap-1 font-medium">
              <FileText size={12} />
              <span className="line-clamp-1">Note: {order.notes}</span>
            </div>
          )}
          {order.documentUrl && (
            <div className="mt-1 text-xs text-[#FF7A00]">
              <a href={order.documentUrl} download={order.documentName || 'attachment'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                <Paperclip size={12} />
                <span>Doc: {order.documentName || 'Download File'}</span>
              </a>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1 font-semibold">Payment Status</label>
            <select
              disabled={loading}
              className={`w-full text-xs font-bold rounded px-2 py-1.5 outline-none cursor-pointer ${paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}
              value={paymentStatus}
              onChange={(e) => handleUpdate('payment', e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase mb-1 font-semibold">Order Status</label>
            <select
              disabled={loading}
              className="w-full bg-black/50 border border-white/20 rounded px-2 py-1.5 text-white/80 outline-none focus:border-[#FF7A00] text-xs font-semibold"
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

        <div className="pt-2 flex justify-end">
          <button
            onClick={handlePrintWorkOrder}
            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors"
          >
            <Printer size={12} />
            <span>Print Work Order</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="p-4 text-sm font-mono font-bold text-white whitespace-nowrap">
        {brandedId}
      </td>
      <td className="p-4">
        <div className="text-sm font-medium text-white">{order.userId?.name || 'Customer'}</div>
        <div className="text-xs text-white/50">{order.userId?.email}</div>
        {order.userId?.mobile && <div className="text-xs text-white/40">{order.userId?.mobile}</div>}
      </td>
      <td className="p-4 max-w-[200px]">
        <div className="text-sm font-medium text-white truncate">
          {servicesText}
        </div>
        {order.notes && (
          <div className="mt-1 text-xs text-[#FF7A00] flex items-center gap-1 font-medium" title={order.notes}>
            <FileText size={12} />
            <span className="truncate max-w-[180px]">Note: {order.notes}</span>
          </div>
        )}
        {order.documentUrl && (
          <div className="mt-1 text-xs text-[#FF7A00]">
            <a href={order.documentUrl} download={order.documentName || 'attachment'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Paperclip size={12} />
              <span className="truncate max-w-[180px]">{order.documentName || 'Attached File'}</span>
            </a>
          </div>
        )}
      </td>
      <td className="p-4 text-sm font-bold text-[#FF7A00]">₹{order.total}</td>
      <td className="p-4">
        <div className="text-xs text-white/80 mb-1">
          {order.paymentMethod === 'online' ? (
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Online</span>
          ) : (
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Shop</span>
          )}
        </div>
        <select
          disabled={loading}
          className={`text-xs font-bold rounded px-2 py-1 outline-none cursor-pointer ${paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          value={paymentStatus}
          onChange={(e) => handleUpdate('payment', e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
        </select>
      </td>
      <td className="p-4 text-sm">
        <select
          disabled={loading}
          className="bg-black/50 border border-white/20 rounded p-1.5 text-white/80 outline-none focus:border-[#FF7A00] text-xs font-semibold"
          value={orderStatus}
          onChange={(e) => handleUpdate('order', e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="AWAITING_CUSTOMER_VISIT">AWAITING VISIT</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </td>
      <td className="p-4 text-xs text-white/60 whitespace-nowrap">
        <div>{dateTimeStr}</div>
        <button
          onClick={handlePrintWorkOrder}
          className="mt-1.5 inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-white text-[11px] font-medium hover:bg-white/20 transition-colors"
        >
          <Printer size={12} />
          <span>Work Order</span>
        </button>
      </td>
    </tr>
  );
}
