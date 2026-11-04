'use client';

import { useState } from 'react';
import { CheckCircle2, Send, Lock, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/Toast';

export function PublicServiceRequestModal({
  partner,
  selectedService,
  onClose,
}: {
  partner: any;
  selectedService: any;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const toast = useToast();

  const primaryColor = partner.branding?.primaryColor || '#7C3AED';
  const whatsappNumber = partner.whatsapp?.replace(/[^0-9]/g, '') || '919118269278';
  const servicePrice = selectedService?.customPrice ?? selectedService?.basePrice ?? 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) {
      toast.error('Please enter your Name and Mobile number');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: partner.partnerId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          notes: formData.notes,
          paymentMethod: 'pay_at_shop',
          total: servicePrice,
          subtotal: servicePrice,
          items: [
            {
              serviceId: selectedService?.serviceId || partner._id,
              title: selectedService?.customTitle || selectedService?.title || 'Digital Service Facilitation',
              price: servicePrice,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderId(data.orderId);
        setSubmitted(true);
      } else {
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error: any) {
      toast.error(error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-slate-900 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
              {partner.name}
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Request {selectedService?.title || 'Digital Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900">Service Request Received!</h4>
              <p className="text-xs text-slate-600">
                Your Tracking Reference ID is: <strong className="text-purple-600 font-mono">#{orderId.substring(0, 8)}</strong>
              </p>
              <p className="text-xs text-slate-500 font-medium pt-2">
                Thank you, <strong>{formData.customerName}</strong>. The center staff at <strong>{partner.name}</strong> has received your submission and will contact you via WhatsApp or phone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 text-left">
              <div className="font-bold text-slate-900">Next Steps:</div>
              <p>1. Keep your Aadhaar / relevant identity documents ready.</p>
              <p>2. Visit the center or connect with the staff on WhatsApp for instant document review.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%20${encodeURIComponent(partner.name)},%20I%20have%20submitted%20service%20request%20#${orderId.substring(0, 8)}%20for%20${encodeURIComponent(selectedService?.title || 'Service')}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20">
                  <MessageCircle size={15} className="mr-1.5" />
                  <span>Connect on WhatsApp Now</span>
                </Button>
              </a>

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 rounded-2xl border-slate-300 text-slate-700"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Summary Strip */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-purple-950">
                  {selectedService?.customTitle || selectedService?.title || 'Digital Service'}
                </div>
                <div className="text-[11px] text-purple-700 font-medium">Standard Counter Facilitation</div>
              </div>
              <div className="text-sm font-black text-purple-900 bg-white px-3 py-1 rounded-xl shadow-2xs border border-purple-200">
                ₹{servicePrice}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Your Full Name <span className="text-purple-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Mobile / WhatsApp Number <span className="text-purple-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="ramesh@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Additional Notes or Details
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Mention any specific requirements or questions..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-purple-600 focus:bg-white rounded-2xl p-3 text-xs sm:text-sm text-slate-900 outline-none transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                <Lock size={12} className="text-purple-600 shrink-0" />
                <span>Pay at center counter upon visit</span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-11 px-6 rounded-2xl text-white font-extrabold text-xs shadow-md cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
                <Send size={13} className="ml-1.5" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
