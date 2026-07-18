'use client';

import { useState } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import { X, Calendar, User, Phone, Mail, Tag, FileText, Paperclip, MessageSquare, Printer, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface AdminOrderInspectorModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: (updatedOrder: any) => void;
}

export function AdminOrderInspectorModal({ order, isOpen, onClose, onOrderUpdate }: AdminOrderInspectorModalProps) {
  const [currentOrder, setCurrentOrder] = useState<any>(order);
  const [loading, setLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState<string>('');

  if (!isOpen || !order) return null;

  const activeOrder = currentOrder || order;
  const brandedId = formatOrderId(activeOrder._id, activeOrder.createdAt);
  const formattedDateTime = formatDateTime(activeOrder.createdAt);
  const customerName = activeOrder.userId?.name || 'Customer';
  const customerMobile = activeOrder.userId?.mobile || '';
  const customerEmail = activeOrder.userId?.email || '';

  // Format WhatsApp number
  const cleanMobile = customerMobile.replace(/[^0-9]/g, '');
  const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

  // Generate pre-filled status update message for WhatsApp
  const getDefaultStatusMsg = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return `Hi ${customerName}! Update regarding your order ${brandedId}: Your service request is currently IN PROGRESS at Sandy Digital Hub. We will notify you once completed.`;
      case 'COMPLETED':
        return `Hi ${customerName}! Great news! Your order ${brandedId} has been COMPLETED by Sandy Digital Hub. You can collect your document or check your account.`;
      case 'AWAITING_CUSTOMER_VISIT':
        return `Hi ${customerName}! Update regarding your order ${brandedId}: Please visit Sandy Digital Hub at Bairi, Khakhreru, Fatehpur with your required documents.`;
      case 'CANCELLED':
        return `Hi ${customerName}! Update regarding your order ${brandedId}: Your service request has been cancelled. Please contact us for details.`;
      default:
        return `Hi ${customerName}! Update regarding your order ${brandedId}: Status is currently ${status}. Thank you for choosing Sandy Digital Hub.`;
    }
  };

  const currentStatusMsg = customMsg || getDefaultStatusMsg(activeOrder.orderStatus);

  const handleStatusChange = async (type: 'payment' | 'order', value: string) => {
    setLoading(true);
    try {
      const payload = type === 'payment'
        ? { paymentStatus: value, orderStatus: activeOrder.orderStatus }
        : { paymentStatus: activeOrder.paymentStatus, orderStatus: value };

      const res = await fetch(`/api/admin/orders/${activeOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = {
          ...activeOrder,
          ...(type === 'payment' ? { paymentStatus: value } : { orderStatus: value }),
        };
        setCurrentOrder(updated);
        setCustomMsg(getDefaultStatusMsg(updated.orderStatus));
        if (onOrderUpdate) onOrderUpdate(updated);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <div class="meta">
            <p><strong>Work Order ID:</strong> ${brandedId}</p>
            <p><strong>Date & Time:</strong> ${formattedDateTime}</p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail || 'N/A'}</p>
            <p><strong>Phone:</strong> ${customerMobile || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${activeOrder.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Shop'} (${activeOrder.paymentStatus})</p>
            <p><strong>Order Status:</strong> ${activeOrder.orderStatus}</p>
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
              ${activeOrder.services?.map((s: any) => `
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
            Total Amount: ₹${activeOrder.total}
          </div>

          ${activeOrder.notes ? `
            <div class="notes">
              <strong>Client Instructions / Notes:</strong>
              <p style="margin-top: 4px; white-space: pre-wrap;">${activeOrder.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
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

  const whatsappShareUrl = formattedMobile
    ? `https://wa.me/${formattedMobile}?text=${encodeURIComponent(currentStatusMsg)}`
    : `https://wa.me/?text=${encodeURIComponent(currentStatusMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#111111]/95 backdrop-blur p-4 sm:p-6 border-b border-white/10 flex items-center justify-between z-10">
          <div>
            <div className="text-[10px] sm:text-xs font-semibold text-[#FF7A00] tracking-wider uppercase mb-0.5 sm:mb-1">
              Admin Order Inspector & Tracker
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-bold font-mono text-white">{brandedId}</h2>
              <CopyButton text={brandedId} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Customer Contact Card */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <User size={16} className="text-[#FF7A00]" />
                <span>{customerName}</span>
              </div>
              <div className="text-xs text-white/60 flex items-center gap-3 flex-wrap">
                {customerEmail && (
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> {customerEmail}
                  </span>
                )}
                {customerMobile && (
                  <span className="flex items-center gap-1 text-[#FF7A00] font-medium">
                    <Phone size={12} /> {customerMobile}
                  </span>
                )}
              </div>
            </div>

            {/* Direct WhatsApp Customer Button */}
            {formattedMobile && (
              <a
                href={`https://wa.me/${formattedMobile}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold hover:bg-green-500/30 transition-colors shadow-md w-full sm:w-auto justify-center"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Customer</span>
              </a>
            )}
          </div>

          {/* Quick Status Update Controllers */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
              Quick Status Management
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/50 mb-1 font-semibold">Payment Status</label>
                <select
                  disabled={loading}
                  value={activeOrder.paymentStatus}
                  onChange={(e) => handleStatusChange('payment', e.target.value)}
                  className={`w-full text-xs font-bold rounded-xl px-3 py-2.5 outline-none cursor-pointer ${
                    activeOrder.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    activeOrder.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1 font-semibold">Order Status</label>
                <select
                  disabled={loading}
                  value={activeOrder.orderStatus}
                  onChange={(e) => handleStatusChange('order', e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-white font-semibold outline-none focus:border-[#FF7A00] text-xs"
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

          {/* 1-Click WhatsApp Status Progress Generator */}
          <div className="bg-gradient-to-r from-green-950/30 to-green-900/10 p-4 rounded-2xl border border-green-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>1-Click WhatsApp Customer Progress Update</span>
              </div>
            </div>
            <textarea
              value={currentStatusMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full bg-black/60 text-white text-xs p-3 rounded-xl border border-green-500/20 outline-none focus:border-green-500 min-h-[70px] resize-y"
              placeholder="Custom status message for customer..."
            />
            <div className="flex justify-end">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-black font-bold text-xs shadow-lg transition-all"
              >
                <MessageSquare size={14} />
                <span>Send WhatsApp Progress Update</span>
              </a>
            </div>
          </div>

          {/* Requested Services Summary */}
          <div>
            <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag size={13} className="text-[#FF7A00]" />
              Requested Services List
            </h4>
            <div className="bg-white/5 rounded-xl border border-white/5 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-white/80">
                <thead className="bg-white/5 border-b border-white/5 text-[10px] text-white/50 uppercase">
                  <tr>
                    <th className="p-3">Service Name</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {activeOrder.services?.map((s: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-white">{s.title}</td>
                      <td className="p-3 text-center text-white/60">{s.quantity}</td>
                      <td className="p-3 text-right font-bold text-[#FF7A00]">₹{s.price * s.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions & Attachments */}
          {activeOrder.notes && (
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] font-semibold text-white/50 uppercase flex items-center gap-1">
                <FileText size={12} className="text-[#FF7A00]" />
                <span>Client Notes</span>
              </div>
              <p className="text-xs text-white/90 whitespace-pre-wrap">{activeOrder.notes}</p>
            </div>
          )}

          {activeOrder.documentUrl && (
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] font-semibold text-white/50 uppercase flex items-center gap-1">
                <Paperclip size={12} className="text-[#FF7A00]" />
                <span>Attached Client File</span>
              </div>
              <a
                href={activeOrder.documentUrl}
                download={activeOrder.documentName || 'attachment'}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#FF7A00] font-medium hover:underline inline-flex items-center gap-1"
              >
                📎 {activeOrder.documentName || 'Download File'}
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-[#111111]/95 backdrop-blur border-t border-white/10 p-4 sm:p-6 flex justify-between items-center gap-3">
          <button
            onClick={handlePrintWorkOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
          >
            <Printer size={14} />
            <span>Print Work Order</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
