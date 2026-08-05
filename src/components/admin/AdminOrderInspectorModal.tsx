'use client';

import { useState, useEffect } from 'react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';
import Link from 'next/link';
import { X, Calendar, User, Phone, Mail, Tag, FileText, Paperclip, MessageSquare, Printer, CheckCircle2, Loader2, AlertCircle, Download } from 'lucide-react';

interface AdminOrderInspectorModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: (updatedOrder: any) => void;
}

export function AdminOrderInspectorModal({ order, isOpen, onClose, onOrderUpdate }: AdminOrderInspectorModalProps) {
  const [activeOrder, setActiveOrder] = useState<any>(order);
  const [loading, setLoading] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  useEffect(() => {
    if (order) {
      setActiveOrder(order);
    }
  }, [order]);

  if (!isOpen || !activeOrder) return null;

  const brandedId = formatOrderId(activeOrder._id, activeOrder.createdAt);
  const formattedDateTime = formatDateTime(activeOrder.createdAt);
  const customerName = activeOrder.userId?.name || 'Customer';
  const customerEmail = activeOrder.userId?.email || '';
  const customerMobile = activeOrder.userId?.mobile || activeOrder.userId?.phone || '';
  const formattedMobile = customerMobile.replace(/[^0-9]/g, '');

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
        setActiveOrder(updated);
        if (onOrderUpdate) onOrderUpdate(updated);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultStatusMsg = `Hi ${customerName}! Update regarding your order ${brandedId}: Please visit Sandy Digital Hub at Bairi, Khakhreru, Fatehpur with your required documents.`;
  const currentStatusMsg = customMsg || defaultStatusMsg;
  const whatsappShareUrl = `https://wa.me/${formattedMobile}?text=${encodeURIComponent(currentStatusMsg)}`;

  const handlePrintWorkOrder = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Work Order - ${brandedId}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; color: #111; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 4px; color: #000; border-bottom: 2px solid #2563EB; padding-bottom: 8px; }
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

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-[#2563EB] tracking-wider">Admin Order Inspector & Tracker</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{brandedId}</h2>
              <CopyButton text={brandedId} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Customer Contact Card */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-black text-gray-900 text-base">
                <User size={16} className="text-[#2563EB]" />
                <span>{customerName}</span>
              </div>
              <div className="text-xs text-gray-600 font-medium flex items-center gap-3 flex-wrap">
                {customerEmail && (
                  <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <Mail size={12} className="text-gray-500" /> {customerEmail}
                  </span>
                )}
                {customerMobile && (
                  <span className="flex items-center gap-1 text-[#2563EB] font-bold">
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all w-full sm:w-auto justify-center cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Customer</span>
              </a>
            )}
          </div>

          {/* Quick Status Update Controllers */}
          <div className="bg-gray-50 p-4.5 rounded-2xl border border-gray-200 space-y-3">
            <div className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Quick Status Management
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-700 mb-1 font-extrabold">Payment Status</label>
                <select
                  disabled={loading}
                  value={activeOrder.paymentStatus}
                  onChange={(e) => handleStatusChange('payment', e.target.value)}
                  className={`w-full text-xs font-extrabold rounded-xl px-3.5 py-2.5 outline-none cursor-pointer border shadow-sm ${
                    activeOrder.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold'
                      : activeOrder.paymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-900 border-red-300 font-extrabold'
                      : 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                  }`}
                >
                  <option value="PENDING" className="text-amber-900 font-bold bg-white">PENDING</option>
                  <option value="PAID" className="text-emerald-900 font-bold bg-white">PAID</option>
                  <option value="FAILED" className="text-red-900 font-bold bg-white">FAILED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1 font-extrabold">Order Status</label>
                <select
                  disabled={loading}
                  value={activeOrder.orderStatus}
                  onChange={(e) => handleStatusChange('order', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-gray-900 font-extrabold outline-none focus:border-[#2563EB] text-xs shadow-sm cursor-pointer"
                >
                  <option value="PENDING" className="text-gray-900 font-bold">PENDING</option>
                  <option value="AWAITING_CUSTOMER_VISIT" className="text-gray-900 font-bold">AWAITING VISIT</option>
                  <option value="PROCESSING" className="text-gray-900 font-bold">PROCESSING</option>
                  <option value="COMPLETED" className="text-gray-900 font-bold">COMPLETED</option>
                  <option value="CANCELLED" className="text-gray-900 font-bold">CANCELLED</option>
                </select>
              </div>
            </div>
          </div>

          {/* 1-Click WhatsApp Customer Progress Update Box */}
          <div className="bg-emerald-50 p-4.5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={15} className="text-emerald-700" />
                <span>1-Click WhatsApp Progress Update</span>
              </div>
            </div>
            <textarea
              value={currentStatusMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full bg-white text-gray-900 text-xs font-medium p-3 rounded-xl border border-emerald-300 outline-none focus:border-emerald-600 min-h-[75px] resize-y placeholder:text-gray-400 shadow-sm"
              placeholder="Custom status message for customer..."
            />
            <div className="flex justify-end">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Send WhatsApp Progress Update</span>
              </a>
            </div>
          </div>

          {/* Requested Services Summary */}
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag size={13} className="text-[#2563EB]" />
              Requested Services List
            </h4>
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm text-gray-900">
                <thead className="bg-gray-100 border-b border-gray-200 text-xs text-gray-800 font-black uppercase">
                  <tr>
                    <th className="p-3 font-extrabold">Service Name</th>
                    <th className="p-3 text-center font-extrabold">Qty</th>
                    <th className="p-3 text-right font-extrabold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {activeOrder.services?.map((s: any, idx: number) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold text-gray-900">{s.title}</td>
                      <td className="p-3 text-center text-gray-700 font-bold">{s.quantity}</td>
                      <td className="p-3 text-right font-black text-[#2563EB]">₹{s.price * s.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions & Attachments */}
          {activeOrder.notes && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-1">
              <div className="text-[11px] font-black text-gray-900 uppercase flex items-center gap-1">
                <FileText size={13} className="text-[#2563EB]" />
                <span>Client Notes & Instructions</span>
              </div>
              <p className="text-xs text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">{activeOrder.notes}</p>
            </div>
          )}

          {activeOrder.documentUrl && (
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 space-y-2.5">
              <div className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Paperclip size={13} />
                  <span>Attached Client File / Document</span>
                </div>
                <Link href="/admin/uploads" target="_blank" className="text-[10px] text-gray-600 hover:text-gray-900 underline font-bold">
                  Open Uploads Gallery ↗
                </Link>
              </div>

              {activeOrder.documentUrl.startsWith('data:image/') || activeOrder.documentName?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <div className="space-y-2">
                  <div className="relative h-44 w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                    <img src={activeOrder.documentUrl} alt={activeOrder.documentName || 'Attached preview'} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-gray-900 truncate max-w-[200px]">
                      📎 {activeOrder.documentName || 'Attached Image'}
                    </span>
                    <a
                      href={activeOrder.documentUrl}
                      download={activeOrder.documentName || 'client_attachment'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-extrabold text-xs inline-flex items-center gap-1 shadow-sm"
                    >
                      <Download size={13} /> Download Image
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[220px]">
                    📎 {activeOrder.documentName || 'Download Attached File'}
                  </span>
                  <a
                    href={activeOrder.documentUrl}
                    download={activeOrder.documentName || 'client_attachment'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/90 text-white font-extrabold text-xs inline-flex items-center gap-1 shadow-sm"
                  >
                    <Download size={13} /> Download File
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-5 flex justify-between items-center gap-3">
          <button
            onClick={handlePrintWorkOrder}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 text-xs font-extrabold hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>Print Work Order</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-extrabold transition-colors cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
