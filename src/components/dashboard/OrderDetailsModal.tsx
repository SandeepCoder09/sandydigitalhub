'use client';

import { useState } from "react";
import { formatOrderId, formatDateTime } from "@/lib/utils";
import { DownloadInvoiceButton } from "./DownloadInvoiceButton";
import { OrderReviewModal } from "./OrderReviewModal";
import { X, Calendar, CreditCard, Tag, FileText, CheckCircle2, Loader2, MessageSquare, Printer, Paperclip, Star } from "lucide-react";

interface OrderDetailsModalProps {
  order: any;
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, user, isOpen, onClose }: OrderDetailsModalProps) {
  const [currentOrder, setCurrentOrder] = useState<any>(order);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  if (!isOpen || !order) return null;

  const activeOrder = currentOrder || order;
  const brandedId = formatOrderId(activeOrder._id, activeOrder.createdAt);
  const formattedDateTime = formatDateTime(activeOrder.createdAt);

  // Determine progress step (1: Submitted, 2: Payment/Visit, 3: Processing, 4: Completed)
  let currentStep = 1;
  if (activeOrder.orderStatus === 'COMPLETED') currentStep = 4;
  else if (activeOrder.orderStatus === 'PROCESSING') currentStep = 3;
  else if (activeOrder.paymentStatus === 'PAID' || activeOrder.orderStatus === 'AWAITING_CUSTOMER_VISIT') currentStep = 2;

  const isCancelled = activeOrder.orderStatus === 'CANCELLED';

  const steps = [
    { label: 'Submitted', desc: 'Order Placed' },
    { label: 'Verification', desc: activeOrder.paymentMethod === 'online' ? 'Payment Verified' : 'Awaiting Visit' },
    { label: 'In Progress', desc: 'Processing Service' },
    { label: 'Delivered', desc: 'Completed' },
  ];

  const whatsappText = encodeURIComponent(`Hi Sandy Digital Hub! I need an update regarding my order ${brandedId}.`);
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappText}`;

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
            <p><strong>Date & Time:</strong> ${formattedDateTime}</p>
            <p><strong>Customer Name:</strong> ${user?.name || 'Customer'}</p>
            <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
            <p><strong>Payment Method:</strong> ${activeOrder.paymentMethod === 'online' ? 'Online Payment' : 'Pay at Shop'} (${activeOrder.paymentStatus})</p>
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

          <div className="total">
            Total Amount: ₹${activeOrder.total}
          </div>

          ${activeOrder.notes ? `
            <div className="notes">
              <strong>Client Instructions / Notes:</strong>
              <p style="margin-top: 4px; white-space: pre-wrap;">${activeOrder.notes}</p>
            </div>
          ` : ''}

          <div className="footer">
            Sandy Digital Hub • Bairi, Khakhreru, Fatehpur, Uttar Pradesh, India • Phone: +91 9876543210
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
        <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl text-white">
          
          {/* Modal Header */}
          <div className="sticky top-0 bg-[#111111]/95 backdrop-blur border-b border-white/10 p-4 sm:p-6 flex items-center justify-between z-10">
            <div>
              <div className="text-[10px] sm:text-xs font-semibold text-[#FF7A00] tracking-wider uppercase mb-0.5 sm:mb-1">Service Request Details</div>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold font-mono text-white">{brandedId}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 space-y-5">

            {/* Quick Action Bar: WhatsApp & Print */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold hover:bg-green-500/30 transition-colors"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Support</span>
              </a>

              <button
                onClick={handlePrintWorkOrder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/10 text-xs font-bold hover:bg-white/20 transition-colors"
              >
                <Printer size={14} />
                <span>Print Work Order</span>
              </button>

              {activeOrder.orderStatus === 'COMPLETED' && (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold hover:bg-yellow-500/30 transition-colors"
                >
                  <Star size={14} className="fill-yellow-400" />
                  <span>{activeOrder.rating ? `Reviewed (${activeOrder.rating}★)` : 'Leave Review'}</span>
                </button>
              )}
            </div>

            {/* Visual Order Progress Tracker */}
            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3 sm:space-y-4">
              <h4 className="text-[11px] sm:text-xs font-semibold text-white/50 uppercase tracking-wider">Order Progress Status</h4>
              {isCancelled ? (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <X size={16} />
                  <span>This order request was cancelled.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
                  {steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = stepNum < currentStep || currentStep === 4;
                    const isCurrent = stepNum === currentStep && currentStep !== 4;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center text-center space-y-1.5 bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone 
                            ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' 
                            : isCurrent 
                            ? 'bg-[#FF7A00] text-white ring-4 ring-[#FF7A00]/20 animate-pulse' 
                            : 'bg-white/10 text-white/40'
                        }`}>
                          {isDone ? <CheckCircle2 size={16} /> : isCurrent ? <Loader2 size={15} className="animate-spin" /> : stepNum}
                        </div>
                        <div>
                          <div className={`text-[11px] sm:text-xs font-bold ${isDone || isCurrent ? 'text-white' : 'text-white/40'}`}>
                            {step.label}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-white/40">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs font-semibold uppercase">
                  <Calendar size={13} className="text-[#FF7A00]" />
                  <span>Date & Time</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-white">{formattedDateTime}</div>
              </div>

              <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs font-semibold uppercase">
                  <CreditCard size={13} className="text-[#FF7A00]" />
                  <span>Payment Method & Status</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="font-medium text-white">
                    {activeOrder.paymentMethod === 'online' ? 'Pay Online' : 'Pay at Shop'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                    activeOrder.paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 
                    activeOrder.paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activeOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Project Instructions/Notes */}
            {activeOrder.notes && (
              <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs font-semibold uppercase">
                  <FileText size={13} className="text-[#FF7A00]" />
                  <span>Customer Instructions & Notes</span>
                </div>
                <p className="text-xs sm:text-sm text-white/90 whitespace-pre-wrap">{activeOrder.notes}</p>
              </div>
            )}

            {/* Attached Document Download */}
            {activeOrder.documentUrl && (
              <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs font-semibold uppercase">
                  <Paperclip size={13} className="text-[#FF7A00]" />
                  <span>Attached Document</span>
                </div>
                <a 
                  href={activeOrder.documentUrl} 
                  download={activeOrder.documentName || 'attached-document'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-medium text-[#FF7A00] hover:underline inline-flex items-center gap-1.5"
                >
                  📎 {activeOrder.documentName || 'Download Attached File'}
                </a>
              </div>
            )}

            {/* Requested Services Item List */}
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <Tag size={13} className="text-[#FF7A00]" />
                Requested Services List
              </h4>
              <div className="bg-white/5 rounded-xl border border-white/5 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-white/80 min-w-[320px]">
                  <thead className="bg-white/5 border-b border-white/5 text-[10px] sm:text-xs text-white/60 uppercase">
                    <tr>
                      <th className="px-3 py-2.5 sm:px-4 sm:py-3">Service Title</th>
                      <th className="px-2 py-2.5 sm:px-4 sm:py-3 text-center">Qty</th>
                      <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-right">Price</th>
                      <th className="px-3 py-2.5 sm:px-4 sm:py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeOrder.services?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-2.5 sm:px-4 sm:py-3 font-medium text-white">{item.title}</td>
                        <td className="px-2 py-2.5 sm:px-4 sm:py-3 text-center text-white/60">{item.quantity}</td>
                        <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-right text-white/60">₹{item.price}</td>
                        <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-right font-semibold text-white">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm text-white/60">
                <span>Subtotal</span>
                <span>₹{activeOrder.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-white/60">
                <span>GST (18%)</span>
                <span>₹{activeOrder.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-[#FF7A00]">₹{activeOrder.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-[#111111]/95 backdrop-blur border-t border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="w-full sm:w-auto">
              {activeOrder.paymentStatus === 'PAID' && user && (
                <DownloadInvoiceButton order={JSON.parse(JSON.stringify(activeOrder))} user={JSON.parse(JSON.stringify(user))} />
              )}
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-sm"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      <OrderReviewModal
        order={activeOrder}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={(updated) => setCurrentOrder(updated)}
      />
    </>
  );
}
