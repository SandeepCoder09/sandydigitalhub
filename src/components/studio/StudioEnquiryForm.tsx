'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Sparkles, MessageCircle, PhoneCall, Mail, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StudioEnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'Business Website',
    budget: '₹15,000 – ₹30,000',
    timeline: '2–4 Weeks',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.description) return;

    setLoading(true);

    // Generate unique inquiry reference
    const generatedRef = `SDS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setRefId(generatedRef);

    try {
      // Send inquiry to contact / chat backend
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[PROJECT ENQUIRY: ${generatedRef}]
Client: ${formData.name} (${formData.company || 'Individual'})
Phone/WhatsApp: ${formData.phone}
Email: ${formData.email || 'N/A'}
Type: ${formData.projectType}
Budget: ${formData.budget} | Timeline: ${formData.timeline}
Description: ${formData.description}`,
          sessionId: `inquiry_${generatedRef}`,
          senderName: formData.name,
        }),
      });
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="quote" className="py-20 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Project Estimation & Scope</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Project Enquiry</span>
          </h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Tell us about your product goals, timeline, and vision. We will review your scope and provide a detailed quotation.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-violet-500/40 text-center space-y-6 shadow-2xl max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Project Scope Received!</h3>
              <p className="text-xs text-slate-400">
                Your enquiry reference ID is: <strong className="text-violet-400 font-mono">{refId}</strong>
              </p>
              <p className="text-sm text-slate-300 font-medium pt-2 leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our engineering lead will review your project requirements and connect via WhatsApp/Email to schedule your discovery call.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 text-left">
              <div className="font-bold text-white">Direct WhatsApp Connect:</div>
              <p>For urgent scope discussions, WhatsApp us directly at <strong>+91 8756454282</strong> with reference <strong>{refId}</strong>.</p>
            </div>

            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="h-11 px-6 rounded-xl border-slate-700 text-slate-300 hover:text-white"
            >
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            {/* Row 1: Name & Business */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Your Full Name <span className="text-violet-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Sharma Enterprises or Personal"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Phone / WhatsApp Number <span className="text-violet-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 3: Project Type, Budget & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white outline-none transition-colors"
                >
                  <option value="Business Website">Business Website</option>
                  <option value="Fullstack Web Application">Fullstack Web App</option>
                  <option value="E-Commerce Store">E-Commerce Store</option>
                  <option value="Mobile App (PWA)">Mobile App (PWA)</option>
                  <option value="UI/UX Design & Branding">UI/UX Design & Branding</option>
                  <option value="Custom Digital Solution">Custom Digital Solution</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Estimated Budget
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white outline-none transition-colors"
                >
                  <option value="₹5,000 – ₹15,000">₹5,000 – ₹15,000 (Starter)</option>
                  <option value="₹15,000 – ₹30,000">₹15,000 – ₹30,000 (Growth)</option>
                  <option value="₹30,000 – ₹60,000">₹30,000 – ₹60,000 (Custom App)</option>
                  <option value="₹60,000+">₹60,000+ (Enterprise)</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Expected Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white outline-none transition-colors"
                >
                  <option value="1–2 Weeks">1–2 Weeks (Fast Track)</option>
                  <option value="2–4 Weeks">2–4 Weeks (Standard)</option>
                  <option value="1–2 Months">1–2 Months (Complex)</option>
                  <option value="Flexible">Flexible Schedule</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-black uppercase tracking-wider text-slate-300">
                Project Overview & Requirements <span className="text-violet-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your product idea, key features needed, existing references, or design preferences..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Lock size={13} className="text-violet-400 shrink-0" />
                <span>NDA & Confidentiality Respected · No Spam Guaranteed</span>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-900/40 cursor-pointer"
              >
                <span>{loading ? 'Submitting Scope...' : 'Submit Project Enquiry'}</span>
                <Send size={15} className="ml-2" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
