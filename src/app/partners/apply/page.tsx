'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Phone,
  Mail, User, FileText, CheckCheck, Loader2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerApplyPage() {
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    yearsInBusiness: '1-3',
    currentServices: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.ownerName || !form.email || !form.phone || !form.city) {
      setErrorMsg('Please fill in all mandatory fields (*)');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // Post to contact/partner application endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.ownerName,
          email: form.email,
          phone: form.phone,
          department: 'PARTNER_NETWORK',
          subject: `New Partner Center Application: ${form.businessName} (${form.city})`,
          message: `Business Name: ${form.businessName}\nOwner: ${form.ownerName}\nLocation: ${form.address}, ${form.city}, ${form.state} - ${form.pincode}\nYears in Business: ${form.yearsInBusiness}\nCurrent Services: ${form.currentServices}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAppId(data.enquiryNumber || `APP-${Date.now().toString().slice(-6)}`);
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Building2 size={12} /> Partner Onboarding Application
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Apply to Join <span className="text-purple-400">SARA Partner Network</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Fill out your shop and business details. Our onboarding team will contact you within 24–48 hours for document verification.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCheck size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900">Application Received!</h3>
                <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
                  Your reference ID is <strong className="text-purple-700">{appId}</strong>. We have logged your application and will review your location exclusivity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-left text-xs space-y-2 text-purple-900 max-w-md mx-auto font-medium">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-purple-700" /> Next Steps:
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-purple-800">
                  <li>Document verification via phone / WhatsApp</li>
                  <li>Operator portal setup & custom URL issuance</li>
                  <li>Initial training and commission rules activation</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link href="/partners">
                  <Button variant="outline" className="text-xs rounded-xl h-10">
                    Back to Partner Network
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-[#7C3AED] text-white text-xs font-bold rounded-xl h-10">
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Business Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  1. Center & Owner Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Business / Shop Name *</label>
                    <input
                      type="text" required
                      value={form.businessName}
                      onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                      placeholder="e.g. Verma Digital Seva Kendra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Owner / Operator Name *</label>
                    <input
                      type="text" required
                      value={form.ownerName}
                      onChange={e => setForm(f => ({ ...f, ownerName: e.target.value }))}
                      placeholder="e.g. Rajesh Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email" required
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="rajesh@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel" required
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  2. Physical Shop Location
                </h3>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Shop Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="Shop No. 4, Main Market, GT Road"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / District *</label>
                    <input
                      type="text" required
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="e.g. Fatehpur"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                      placeholder="212601"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Operational Experience */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  3. Operational Background
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Years in Physical Operation</label>
                    <select
                      value={form.yearsInBusiness}
                      onChange={e => setForm(f => ({ ...f, yearsInBusiness: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="New Startup">New Center / Starting Soon</option>
                      <option value="1-3">1 to 3 Years</option>
                      <option value="3-5">3 to 5 Years</option>
                      <option value="5+">5+ Years Established</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Services Currently Offered</label>
                    <input
                      type="text"
                      value={form.currentServices}
                      onChange={e => setForm(f => ({ ...f, currentServices: e.target.value }))}
                      placeholder="e.g. Printing, CSC, PAN, Aadhaar Banking"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs py-3 h-11 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {submitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting Application...</>
                ) : (
                  <>Submit Partner Application <ArrowRight size={14} /></>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
