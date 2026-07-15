'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from 'react';

export default function OrderRow({ order }: { order: any }) {
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

  return (
    <tr>
      <td className="p-4 text-sm font-mono text-white/60">{order._id.toString().slice(-8).toUpperCase()}</td>
      <td className="p-4">
        <div className="text-sm font-medium text-white">{order.userId?.name}</div>
        <div className="text-xs text-white/50">{order.userId?.email}</div>
      </td>
      <td className="p-4 text-sm font-bold text-[#FF7A00]">₹{order.total}</td>
      <td className="p-4">
        <div className="text-sm text-white/80 mb-1">
          {order.paymentMethod === 'online' ? (
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Online</span>
          ) : (
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Shop</span>
          )}
        </div>
        <select 
          disabled={loading}
          className={`text-xs font-bold rounded px-1 py-0.5 outline-none ${
            paymentStatus === 'PAID' ? 'bg-green-500/20 text-green-400' : 
            paymentStatus === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
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
          className="bg-black/50 border border-white/20 rounded p-1 text-white/80 outline-none focus:border-[#FF7A00] text-xs"
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
      <td className="p-4 text-sm text-white/60">{new Date(order.createdAt).toLocaleDateString()}</td>
    </tr>
  );
}
