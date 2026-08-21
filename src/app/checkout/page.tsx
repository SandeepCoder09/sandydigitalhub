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
          color: '#7C3AED',
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
          <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto mb-4 font-bold">
            🛒
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 mb-6">Select a digital service to proceed with checkout.</p>
          <button 
            onClick={() => router.push('/services')} 
            className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white py-3 rounded-2xl font-bold transition-all shadow-md shadow-purple-200"
          >
            Browse Digital Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Top Trust Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Secure Checkout</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Review your service order and select your payment method.</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-extrabold w-fit shadow-xs">
            <Lock size={12} className="text-emerald-600 sm:w-3.5 sm:h-3.5" />
            <span>256-Bit SSL Encrypted Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 items-start">
          {/* Order Summary & Attachments */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xs sm:shadow-sm space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 border-b border-gray-100 pb-2.5 sm:pb-4">Order Summary</h2>
              
              <div className="space-y-2.5 sm:space-y-3.5 divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.serviceId} className="flex justify-between items-center text-xs sm:text-sm pt-2.5 sm:pt-3 first:pt-0">
                    <div>
                      <span className="font-bold text-gray-900">{item.quantity}x</span>{' '}
                      <span className="font-semibold text-gray-800">{item.title}</span>
                    </div>
                    <span className="font-black text-[#7C3AED] shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm bg-gray-50/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-800">₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>GST (18%)</span>
                  <div className="flex items-center gap-1.5">
                    <span className="line-through text-gray-400 text-[10px] sm:text-xs font-normal">₹{(getSubtotal() * 0.18).toFixed(2)}</span>
                    <span>₹0.00 (Waived)</span>
                  </div>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-base sm:text-xl pt-2 border-t border-gray-200">
                  <span>Total Payable</span>
                  <span className="text-[#7C3AED]">₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Custom Project Notes / Instructions */}
              <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5">
                    <FileText size={13} className="text-[#7C3AED]" />
                    <span>Project Notes / Instructions (Optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any specific requirements, preferences, or notes for your service request..."
                    className="w-full bg-gray-50 text-gray-900 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-[#7C3AED] focus:bg-white outline-none text-xs sm:text-sm min-h-[75px] sm:min-h-[90px] resize-y transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5">
                    <Upload size={13} className="text-[#7C3AED]" />
                    <span>Attach Document / Photo (Optional)</span>
                  </label>
                  {!allowFileUploads ? (
                    <div className="bg-red-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-red-200 text-red-800 text-[11px] sm:text-xs font-bold flex items-center gap-2">
                      <Ban size={15} className="text-red-600 shrink-0" />
                      <span>File and photo attachments are currently restricted by Admin Firewall settings.</span>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                      <input
                        type="file"
                        id="document-upload"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="document-upload"
                        className="px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold cursor-pointer transition-colors w-full sm:w-auto text-center shadow-xs shrink-0"
                      >
                        Choose File (PDF/Image)
                      </label>
                      {documentName ? (
                        <span className="text-xs text-[#7C3AED] font-bold truncate max-w-xs">
                          ✓ {documentName}
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
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
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xs sm:shadow-sm space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 border-b border-gray-100 pb-2.5 sm:pb-4">Select Payment Method</h2>

              <div className="space-y-2.5 sm:space-y-3.5">
                {/* Pay Online Option */}
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 sm:gap-4 ${
                    paymentMethod === 'online'
                      ? 'border-[#7C3AED] bg-purple-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {paymentMethod === 'online' ? (
                      <CheckCircle2 className="text-[#7C3AED]" size={18} />
                    ) : (
                      <Circle className="text-gray-300" size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-base mb-0.5 flex items-center gap-2">
                      Pay Online 
                      <span className="text-[9px] sm:text-[10px] bg-[#7C3AED] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-xs">
                        Recommended
                      </span>
                    </h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs mb-2">Instant payment via UPI, Google Pay, Cards, NetBanking.</p>
                    {paymentMethod === 'online' && (
                      <div className="bg-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-emerald-700 border border-emerald-200 shadow-2xs">
                        <CreditCard size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
                        <span>Instant Confirmation via Razorpay Secure Gateway</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pay at Shop Option */}
                <div
                  onClick={() => setPaymentMethod('pay_at_shop')}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 sm:gap-4 ${
                    paymentMethod === 'pay_at_shop'
                      ? 'border-[#7C3AED] bg-purple-50/50 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="mt-0.5">
                    {paymentMethod === 'pay_at_shop' ? (
                      <CheckCircle2 className="text-[#7C3AED]" size={18} />
                    ) : (
                      <Circle className="text-gray-300" size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xs sm:text-base mb-0.5">
                      Pay at Shop
                    </h3>
                    <p className="text-gray-500 text-[10px] sm:text-xs mb-2">Pay in cash or UPI at Sandy Digital Hub when collecting your service.</p>
                    {paymentMethod === 'pay_at_shop' && (
                      <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs text-gray-700 border border-purple-200 space-y-1 shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-0.5">
                          <Store size={14} className="text-[#7C3AED] sm:w-4 sm:h-4" />
                          <span>Sandy Digital Hub Store Location</span>
                        </div>
                        <p className="font-semibold text-gray-800">Bairi, Khakhreru, Fatehpur</p>
                        <p className="text-gray-500">Uttar Pradesh, India - 212656</p>
                        <p className="pt-1.5 border-t border-gray-100 font-bold text-gray-900">Contact: +91 87564 54282</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white h-11 sm:h-14 rounded-xl sm:rounded-2xl font-black text-xs sm:text-base transition-all disabled:opacity-50 shadow-md sm:shadow-lg shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  paymentMethod === 'online' ? (
                    <>Pay ₹{getTotal().toFixed(2)} Securely <ArrowRight size={15} className="sm:w-[18px] sm:h-[18px]" /></>
                  ) : (
                    <>Confirm Order (Pay at Shop) <ArrowRight size={15} className="sm:w-[18px] sm:h-[18px]" /></>
                  )
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gray-500 pt-1">
                <ShieldCheck size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
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
