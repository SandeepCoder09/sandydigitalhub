'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export function PublicPartnerServices({
  partner,
  onSelectService,
}: {
  partner: any;
  onSelectService: (service: any) => void;
}) {
  const primaryColor = partner.branding?.primaryColor || '#7C3AED';
  const assignedServices = (partner.assignedServices || []).filter((s: any) => s.enabled);

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
            <Sparkles size={13} style={{ color: primaryColor }} />
            <span>Available Facilitation Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Services Available at <span style={{ color: primaryColor }}>{partner.name}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Select a service below to request immediate assistance or inquire via our counter desk.
          </p>
        </div>

        {assignedServices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 max-w-md mx-auto space-y-2">
            <FileText size={32} className="mx-auto text-slate-400" />
            <div className="text-sm font-bold text-slate-700">Services Updating</div>
            <p className="text-xs">This partner center is currently updating their service catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {assignedServices.map((service: any, index: number) => {
              const price = service.customPrice ?? service.basePrice ?? 50;

              return (
                <motion.div
                  key={service.serviceId || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-2 flex flex-col justify-between hover:-translate-y-1">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {service.category || 'Digital Service'}
                        </span>
                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-xl border border-emerald-200">
                          ₹{price}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                        {service.customTitle || service.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 flex flex-col flex-grow justify-between space-y-4">
                      <CardDescription className="text-xs text-slate-600 font-medium leading-relaxed">
                        {service.customDescription ||
                          'Professional online application assistance, form submission, and document formatting.'}
                      </CardDescription>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span>Direct Support</span>
                        </span>

                        <Button
                          size="sm"
                          onClick={() => onSelectService(service)}
                          className="h-9 px-4 rounded-xl text-white font-extrabold text-xs shadow-sm hover:scale-105 transition-all cursor-pointer"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <span>Start Request</span>
                          <ArrowRight size={13} className="ml-1.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
