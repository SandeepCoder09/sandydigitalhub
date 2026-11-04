'use client';

import { useState, useRef } from 'react';
import {
  FileText, Download, Printer, ShieldCheck, CheckCircle2,
  X, Sparkles, Building, PhoneCall, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderReceiptModalProps {
  order: {
    orderId: string;
    createdAt: string;
    services: { title: string; price: number; quantity: number }[];
    subtotal?: number;
    tax?: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    customerName?: string;
  };
  onClose: () => void;
}

export function OrderReceiptModal({ order, onClose }: OrderReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold">
            <FileText size={16} className="text-[#7C3AED]" />
            <span>Official Application Token Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs h-8 px-3"
            >
              <Printer size={14} className="mr-1" /> Print
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-white font-bold text-sm px-2">✕</button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white text-gray-900">
          
          {/* Receipt Header / Letterhead */}
          <div className="flex items-center justify-between border-b pb-4 border-gray-200">
            <div>
              <div className="text-lg font-black text-gray-900 tracking-tight">SANDY DIGITAL HUB</div>
              <div className="text-[10px] text-gray-500 font-medium">Digital Agency & Jan Seva Center</div>
              <div className="text-[10px] text-gray-500 font-medium">Fatehpur, UP · Phone: +91 9118269278</div>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-md bg-purple-100 text-[#7C3AED] text-[10px] font-black uppercase">
                OFFICIAL TOKEN
              </span>
              <div className="text-[10px] text-gray-500 font-bold mt-1">
                Token #{order.orderId.slice(-6).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Customer & Date Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Customer Name</span>
              <div className="font-extrabold text-gray-900 mt-0.5">{order.customerName || 'Valued Customer'}</div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Booking Date</span>
              <div className="font-extrabold text-gray-900 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Payment Status</span>
              <div className={`font-extrabold mt-0.5 ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-purple-600'}`}>
                {order.paymentStatus} ({order.paymentMethod.toUpperCase()})
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Order Status</span>
              <div className="font-extrabold text-gray-900 mt-0.5">{order.orderStatus.replace(/_/g, ' ')}</div>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Services / Items Booked:</div>
            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="p-3">Service Name</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {order.services.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold">{item.title}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-extrabold">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <div className="w-48 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-gray-900 border-t pt-1 border-gray-300">
                <span>Total Amount:</span>
                <span className="text-[#7C3AED]">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Official Verification Stamp */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-300">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-900 uppercase tracking-wider">VERIFIED DIGITAL TOKEN</div>
                <div className="text-[10px] text-emerald-700 font-medium">Sandy Digital Hub Security Seal</div>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-mono">
              Ref: {order.orderId}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
          <Button onClick={onClose} className="bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs px-6">
            Close Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
