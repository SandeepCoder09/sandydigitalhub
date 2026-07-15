'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, Circle, CreditCard, Store } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotal, getSubtotal, getTax, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pay_at_shop'>('online');

  const handlePayment = async () => {
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          subtotal: getSubtotal(),
          tax: getTax(),
          total: getTotal(),
          paymentMethod,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);

      if (paymentMethod === 'pay_at_shop') {
        clearCart();
        router.push('/dashboard?payment=pending');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Sandy Digital Hub',
        description: 'Payment for Services',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            }),
          });
          
          if (verifyRes.ok) {
            clearCart();
            router.push('/dashboard?payment=success');
          } else {
            router.push('/dashboard?payment=failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#FF7A00',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <button onClick={() => router.push('/services')} className="text-[#FF7A00] underline hover:text-[#FF7A00]/80">Browse Services</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
          <div className="bg-[#111111] p-6 rounded-2xl border border-white/10 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.serviceId} className="flex justify-between text-white/80">
                  <span>{item.quantity}x {item.title}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>GST (18%)</span>
                <span>₹{getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-xl pt-2 border-t border-white/10">
                <span>Total</span>
                <span className="text-[#FF7A00]">₹{getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white mb-6 md:mt-[68px]">Select Payment Method</h2>
          
          <div className="space-y-4 mb-8">
            {/* Pay Online Option */}
            <div 
              onClick={() => setPaymentMethod('online')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                paymentMethod === 'online' 
                  ? 'border-[#FF7A00] bg-[#FF7A00]/10' 
                  : 'border-white/10 bg-[#111111] hover:border-white/30'
              }`}
            >
              <div className="mt-1">
                {paymentMethod === 'online' ? (
                  <CheckCircle2 className="text-[#FF7A00]" size={24} />
                ) : (
                  <Circle className="text-white/40" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 flex items-center gap-2 ${paymentMethod === 'online' ? 'text-white' : 'text-white/80'}`}>
                  Pay Online <span className="text-xs bg-[#FF7A00] text-white px-2 py-0.5 rounded-full font-normal">Recommended</span>
                </h3>
                <p className="text-white/60 text-sm mb-3">Secure payment via UPI, Credit/Debit Cards, NetBanking.</p>
                {paymentMethod === 'online' && (
                  <div className="bg-black/20 p-3 rounded-lg flex items-center gap-3 text-sm text-white/70 border border-white/5">
                    <CreditCard size={18} className="text-green-400" />
                    <span>Instant Confirmation via Razorpay Secure Gateway</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pay at Shop Option */}
            <div 
              onClick={() => setPaymentMethod('pay_at_shop')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                paymentMethod === 'pay_at_shop' 
                  ? 'border-[#FF7A00] bg-[#FF7A00]/10' 
                  : 'border-white/10 bg-[#111111] hover:border-white/30'
              }`}
            >
              <div className="mt-1">
                {paymentMethod === 'pay_at_shop' ? (
                  <CheckCircle2 className="text-[#FF7A00]" size={24} />
                ) : (
                  <Circle className="text-white/40" size={24} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg mb-1 ${paymentMethod === 'pay_at_shop' ? 'text-white' : 'text-white/80'}`}>
                  Pay at Shop
                </h3>
                <p className="text-white/60 text-sm mb-3">Pay at Sandy Digital Hub and collect your service after payment verification.</p>
                {paymentMethod === 'pay_at_shop' && (
                  <div className="bg-black/20 p-4 rounded-lg text-sm text-white/70 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-bold text-white mb-1">
                      <Store size={16} className="text-[#FF7A00]" />
                      Sandy Digital Hub
                    </div>
                    <p>123 Digital Market Street, Sector 4</p>
                    <p>New Delhi, 110001</p>
                    <p className="pt-2 border-t border-white/10 mt-1">Mobile: +91 98765 43210</p>
                    <p>Hours: Mon-Sat, 10:00 AM - 8:00 PM</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#FF7A00] text-white py-4 rounded-xl font-bold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              paymentMethod === 'online' 
                ? `Pay ₹${getTotal().toFixed(2)} Securely` 
                : 'Confirm Order'
            )}
          </button>
          
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </div>
      </div>
    </div>
  );
}
