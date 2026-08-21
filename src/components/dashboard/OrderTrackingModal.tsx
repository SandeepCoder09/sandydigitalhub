'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  PackageSearch,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Calendar,
  Tag,
  Building2,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatOrderId, formatDateTime } from '@/lib/utils';
import { CopyButton } from '@/components/ui/CopyButton';

interface OrderTrackingModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderTrackingModal({ order, isOpen, onClose }: OrderTrackingModalProps) {
  if (!isOpen || !order) return null;

  const brandedId = formatOrderId(order._id, order.createdAt);
  const formattedDate = formatDateTime(order.createdAt);

  const STATUS_STEPS = [
    {
      key: 'PENDING',
      title: 'Order Placed',
      desc: 'Application received and registered in Sandy Digital Hub portal.',
      icon: Clock,
    },
    {
      key: 'AWAITING_CUSTOMER_VISIT',
      title: 'Document Verification',
      desc: order.paymentMethod === 'online'
        ? 'Documents submitted online are being verified.'
        : 'Awaiting customer shop visit or biometric verification.',
      icon: FileText,
    },
    {
      key: 'PROCESSING',
      title: 'Department Processing',
      desc: 'Active processing with Govt / Cyber Dept portal.',
      icon: Building2,
    },
    {
      key: 'COMPLETED',
      title: 'Ready for Pickup / Download',
      desc: 'Certificate / service has been completed successfully.',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'COMPLETED') return 3;
    if (status === 'PROCESSING') return 2;
    if (status === 'AWAITING_CUSTOMER_VISIT') return 1;
    return 0;
  };

  const currentStep = getStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus === 'CANCELLED';

  const whatsappText = encodeURIComponent(
    `Hello Sandy Digital Hub, I am tracking my order ${brandedId} for ${
      order.services?.map((s: any) => s.title).join(', ') || 'Services'
    }. Please update me on the live status.`
  );
  const whatsappUrl = `https://wa.me/+918756454282?text=${whatsappText}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 my-auto"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/2 -top-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur text-white">
                    <PackageSearch size={18} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-200">
                    Live Order Tracker
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{brandedId}</span>
                  <div className="text-white">
                    <CopyButton text={brandedId} />
                  </div>
                </h2>
                <div className="text-xs text-purple-100 flex items-center gap-1.5 pt-0.5">
                  <Calendar size={13} className="text-purple-300" />
                  <span>Placed on {formattedDate}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-purple-200 font-medium">Current Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[11px] ${
                    isCancelled
                      ? 'bg-red-500/20 text-red-100 border border-red-400/30'
                      : order.orderStatus === 'COMPLETED'
                      ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'
                      : 'bg-amber-400/20 text-amber-100 border border-amber-400/30'
                  }`}
                >
                  {isCancelled ? 'CANCELLED' : order.orderStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-200 font-medium">Total:</span>
                <span className="font-extrabold text-white text-sm">₹{order.total}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-bold uppercase">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Step-by-Step Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-[#7C3AED]" />
                  Application Progress Milestones
                </h3>
                {!isCancelled && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-100">
                    Step {currentStep + 1} of 4
                  </span>
                )}
              </div>

              {isCancelled ? (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">This application was cancelled</h4>
                    <p className="mt-0.5 text-red-700">
                      If you believe this was in error, please contact Sandy Digital Hub customer support or visit our shop.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="relative flex items-start gap-3.5 group">
                        {/* Step Marker */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isCurrent
                              ? 'bg-[#7C3AED] text-white ring-4 ring-purple-100 shadow-md scale-110'
                              : isDone
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-300'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>

                        {/* Step Content */}
                        <div
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all w-full ${
                            isCurrent
                              ? 'bg-purple-50/70 border-purple-200 shadow-xs'
                              : isDone
                              ? 'bg-white border-gray-200'
                              : 'bg-gray-50/50 border-gray-100 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <StepIcon
                                size={16}
                                className={isCurrent ? 'text-[#7C3AED]' : isDone ? 'text-emerald-600' : 'text-gray-400'}
                              />
                              <h4 className={`text-xs sm:text-sm font-extrabold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.title}
                              </h4>
                            </div>
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-purple-100 px-2 py-0.5 rounded-md">
                                Current Stage
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Requested Services */}
            <div className="pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag size={13} className="text-[#7C3AED]" />
                Services in this Order
              </h4>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden">
                {order.services?.map((svc: any, idx: number) => (
                  <div key={idx} className="p-3 sm:p-3.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-gray-800">{svc.title}</span>
                    <span className="font-bold text-[#7C3AED]">₹{svc.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables / Attached Document */}
            {order.documentUrl && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm">
                    <Download size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-emerald-950">Ready Deliverable Available</h5>
                    <p className="text-[11px] sm:text-xs text-emerald-700">
                      {order.documentName || 'Official Certificate / File'}
                    </p>
                  </div>
                </div>
                <a
                  href={order.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download size={14} />
                  Download File
                </a>
              </div>
            )}

            {/* Next Action / Location Guidance Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <ShieldCheck size={14} />
                Next Step Instructions
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {order.orderStatus === 'COMPLETED'
                  ? 'Your requested service has been delivered! You can download your official document above or visit the Sandy Digital Hub center to collect your laminated printout.'
                  : order.orderStatus === 'AWAITING_CUSTOMER_VISIT'
                  ? 'Please visit Sandy Digital Hub at GT Road, Near Bus Stand, Fatehpur with your original Aadhaar / document proofs for live verification and biometric authorization.'
                  : order.orderStatus === 'PROCESSING'
                  ? 'Your application has been submitted to the government portal. Processing typically takes 24–72 working hours. You will receive an SMS update once ready.'
                  : 'Your request has been queued. Our operators are preparing your documentation for submission.'}
              </p>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare size={14} />
              <span>Ask Live Support via WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Close Tracker
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default OrderTrackingModal;
