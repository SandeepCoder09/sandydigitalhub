'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck,
  CheckCircle2, AlertCircle, Building2, Globe, FileText, CheckCheck, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ECOSYSTEM_CONFIG } from '@/config/ecosystem';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'SARA_SERVICES',
    relatedRequestNumber: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setErrorMsg('Please fill in all mandatory fields (*)');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedId(data.enquiryNumber);
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-24">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Mail size={13} /> Direct Communication & Support
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Contact Our <span className="text-purple-400">Ecosystem Teams</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Route your inquiry directly to the right department for prompt, expert assistance.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Contact Details & SLA Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-5">
              <h3 className="text-base font-black text-gray-900">Direct Contact Channels</h3>

              <div className="space-y-4 text-xs font-medium">
                <a
                  href="tel:+919118269278"
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors text-purple-950"
                >
                  <Phone size={16} className="text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-purple-900">Helpline / WhatsApp</span>
                    <span className="text-[11px] text-purple-700">+91 9118269278 (Mon–Sat, 9AM–7PM)</span>
                  </div>
                </a>

                <a
                  href="mailto:admin@sandydigitalhub.com"
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-900"
                >
                  <Mail size={16} className="text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Official Email</span>
                    <span className="text-[11px] text-slate-600">admin@sandydigitalhub.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 text-slate-900">
                  <MapPin size={16} className="text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-900">Physical Center Location</span>
                    <span className="text-[11px] text-slate-600">Main Market, Bindki Road, Fatehpur, UP — 212601</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Tickets Callout */}
            <div className="bg-purple-950 text-white rounded-3xl p-6 border border-purple-800/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-400" />
                <h4 className="text-sm font-black">Existing Service Request Inquiry?</h4>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed font-medium">
                For active order updates, document attachments, or timeline escalation, use our dedicated Support Ticket System.
              </p>
              <Link href="/support" className="inline-block pt-1">
                <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer">
                  Go to Support Center →
                </button>
              </Link>
            </div>

          </div>

          {/* Right Column: Structured Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              {submittedId ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCheck size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-gray-900">Enquiry Submitted Successfully</h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Your reference tracking number is <strong className="text-purple-700">{submittedId}</strong>.
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto font-medium">
                    Our team will review your inquiry and respond within 24 business hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmittedId(null);
                      setForm({
                        name: '', email: '', phone: '', department: 'SARA_SERVICES',
                        relatedRequestNumber: '', subject: '', message: '',
                      });
                    }}
                    className="bg-[#7C3AED] text-white text-xs font-bold rounded-xl h-10 px-5"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-gray-900">Send an Enquiry</h3>
                    <p className="text-xs text-gray-500 font-medium">Select the appropriate department for faster routing.</p>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Department Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">What can we help you with? *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ECOSYSTEM_CONFIG.contactDepartments.map((dept) => (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, department: dept.id }))}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                            form.department === dept.id
                              ? 'bg-purple-50 border-[#7C3AED] text-purple-900'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {dept.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                      <input
                        type="text" required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Ankit Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email" required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="ankit@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Existing Request ID (Optional)</label>
                      <input
                        type="text"
                        value={form.relatedRequestNumber}
                        onChange={e => setForm(f => ({ ...f, relatedRequestNumber: e.target.value }))}
                        placeholder="e.g. SDH-20260821-F4A8"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text" required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="Brief summary of your inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Message *</label>
                    <textarea
                      required rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Please provide full details so we can best assist you..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl text-xs py-3 h-11 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <><Loader2 size={15} className="animate-spin" /> Routing Inquiry...</>
                    ) : (
                      <><Send size={14} /> Submit Department Inquiry</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
