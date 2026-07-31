'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, CreditCard, Store, ShieldCheck, Lock, Upload, FileText, ArrowRight, Ban } from 'lucide-react';
import Script from 'next/script';
import { toast } from '@/components/ui/Toast';

export default function CheckoutPage() {
  const { items, notes, setNotes, getTotal, getSubtotal, getTax, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'pay_at_shop'>('online');
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [allowFileUploads, setAllowFileUploads] = useState<boolean>(true);

  useEffect(() => {
    const checkSiteControl = async () => {
      try {
        const res = await fetch('/api/site-control');
        if (res.ok) {
          const data = await res.json();
          if (data.settings && typeof data.settings.allowFileUploads === 'boolean') {
            setAllowFileUploads(data.settings.allowFileUploads);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    checkSiteControl();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowFileUploads) {
      toast.error('File and photo uploads are currently disabled by Admin Firewall settings.', 'Upload Restricted');
      e.target.value = '';
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 5MB', 'File Too Large');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDocumentUrl(reader.result as string);
      setDocumentName(file.name);
      toast.success(`Attached ${file.name}`, 'Document Attached');
    };
    reader.readAsDataURL(file);
  };

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
          notes,
          documentUrl,
          documentName,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (paymentMethod === 'pay_at_shop') {
        clearCart();
        toast.success("Order placed successfully! Please visit our shop for payment & verification.", "Order Confirmed");
        router.push('/requests?payment=pending');
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
            toast.success("Payment verified successfully! Your order is in progress.", "Payment Successful");
            router.push('/requests?payment=success');
          } else {
            toast.error("Payment verification failed. Please contact support.", "Verification Error");
            router.push('/requests?payment=failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#FF4500',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      toast.error('Payment gateway could not be loaded. You can select "Pay at Shop" to place order instantly.', 'Payment Notice');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24 px-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl border border-gray-200 shadow-xl max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF4500] flex items-center justify-center mx-auto mb-4 font-bold">
            🛒
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-6">Select a digital service to proceed with checkout.</p>
          <button 
            onClick={() => router.push('/services')} 
            className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white py-3 rounded-2xl font-bold transition-all shadow-md shadow-orange-200"
          >
            Browse Digital Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 md:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Top Trust Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Secure Checkout</h1>
            <p className="text-sm text-gray-500 mt-1">Review your service order and select your payment method.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold w-fit shadow-sm">
            <Lock size={14} className="text-emerald-600" />
            <span>256-Bit SSL Encrypted Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Order Summary & Attachments */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-3.5 divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.serviceId} className="flex justify-between items-center text-sm pt-3 first:pt-0">
                    <div>
                      <span className="font-bold text-gray-900">{item.quantity}x</span>{' '}
                      <span className="font-semibold text-gray-800">{item.title}</span>
                    </div>
                    <span className="font-black text-[#FF4500] shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm bg-gray-50/50 p-4 rounded-2xl">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>GST (18%)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-gray-400 text-xs font-normal">₹{(getSubtotal() * 0.18).toFixed(2)}</span>
                    <span>₹0.00 (Waived)</span>
                  </div>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-xl pt-2 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-[#FF4500]">₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Custom Project Notes / Instructions */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#FF4500]" />
                    <span>Project Notes / Instructions (Optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any specific requirements, preferences, or notes for your service request..."
                    className="w-full bg-gray-50 text-gray-900 p-3.5 rounded-2xl border border-gray-200 focus:border-[#FF4500] focus:bg-white outline-none text-sm min-h-[90px] resize-y transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
                    <Upload size={14} className="text-[#FF4500]" />
                    <span>Attach Document / Photo (Optional)</span>
                  </label>
                  {!allowFileUploads ? (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                      <Ban size={16} className="text-red-600 shrink-0" />
                      <span>File and photo attachments are currently restricted by Admin Firewall settings.</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="file"
                        id="document-upload"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="document-upload"
                        className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors w-full sm:w-auto text-center shadow-sm shrink-0"
                      >
                        Choose File (PDF/Image)
                      </label>
                      {documentName ? (
                        <span className="text-xs text-[#FF4500] font-bold truncate max-w-xs">
                          ✓ {documentName}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          No file attached (Max 5MB)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Select Payment Method</h2>

              <div className="space-y-3.5">
                {/* Pay Online Option */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === 'online'
                      ? 'border-[#FF4500] bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {paymentMethod === 'online' ? (
                      <CheckCircle2 className="text-[#FF4500]" size={22} />
                    ) : (
                      <Circle className="text-gray-300" size={22} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5 flex items-center gap-2">
                      Pay Online 
                      <span className="text-[10px] bg-[#FF4500] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-gray-500 text-xs mb-2.5">Instant payment via UPI, Google Pay, Credit/Debit Cards, NetBanking.</p>
                    {paymentMethod === 'online' && (
                      <div className="bg-white p-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-sm">
                        <CreditCard size={16} className="text-emerald-600" />
                        <span>Instant Confirmation via Razorpay Secure Gateway</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pay at Shop Option */}
                <div
                  onClick={() => setPaymentMethod('pay_at_shop')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                    paymentMethod === 'pay_at_shop'
                      ? 'border-[#FF4500] bg-orange-50/50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {paymentMethod === 'pay_at_shop' ? (
                      <CheckCircle2 className="text-[#FF4500]" size={22} />
                    ) : (
                      <Circle className="text-gray-300" size={22} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base mb-0.5">
                      Pay at Shop
                    </h3>
                    <p className="text-gray-500 text-xs mb-2.5">Pay in cash or UPI at Sandy Digital Hub when collecting your service.</p>
                    {paymentMethod === 'pay_at_shop' && (
                      <div className="bg-white p-4 rounded-xl text-xs text-gray-700 border border-orange-200 space-y-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
                          <Store size={16} className="text-[#FF4500]" />
                          <span>Sandy Digital Hub Store Location</span>
                        </div>
                        <p className="font-semibold text-gray-800">Bairi, Khakhreru, Fatehpur</p>
                        <p className="text-gray-500">Uttar Pradesh, India - 212656</p>
                        <p className="pt-2 border-t border-gray-100 font-bold text-gray-900">Contact: +91 87564 54282</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white py-4 rounded-2xl font-black text-base transition-all disabled:opacity-50 shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  paymentMethod === 'online' ? (
                    <>Pay ₹{getTotal().toFixed(2)} Securely <ArrowRight size={18} /></>
                  ) : (
                    <>Confirm Order (Pay at Shop) <ArrowRight size={18} /></>
                  )
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 pt-2">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>100% Satisfaction & Service Guarantee</span>
              </div>
            </div>
          </div>

          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </div>
      </div>
    </div>
  );
}
