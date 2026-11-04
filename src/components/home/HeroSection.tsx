"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2, Zap, Image as ImageIcon, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-purple-50/40 via-white to-white pt-4 pb-8 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#7C3AED]/15 to-[#A855F7]/10 blur-[130px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-white border border-purple-200 shadow-xs sm:shadow-md text-[#7C3AED] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-3 sm:mb-6 hover:scale-105 transition-transform cursor-pointer">
              <Sparkles size={12} className="text-[#7C3AED] sm:w-3.5 sm:h-3.5" />
              <span>SANDY DIGITAL HUB · SERVICE PORTAL</span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight mb-3 sm:mb-6">
              Your Trusted <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#A855F7] bg-clip-text text-transparent">
                Digital Service Center
              </span>
            </h1>

            <p className="text-xs sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-4 sm:mb-8 leading-relaxed font-medium">
              From online applications and document assistance to professional digital services, get fast, secure and transparent support from one convenient place.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center lg:justify-start mb-4 sm:mb-10">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto text-xs sm:text-base font-extrabold h-11 sm:h-13 px-6 sm:px-8 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl shadow-purple-500/20 hover:shadow-purple-500/35 transition-all hover:scale-105 group">
                  <Zap className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5 fill-white" /> Get Digital Service
                  <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/track-order">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-xs sm:text-base font-bold h-11 sm:h-13 px-5 sm:px-7 border-2 border-purple-200 text-gray-800 hover:text-[#7C3AED] hover:border-[#7C3AED] hover:bg-purple-50 rounded-xl sm:rounded-2xl transition-all hover:scale-105">
                  Track My Request
                </Button>
              </Link>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-6 text-[10px] sm:text-xs font-bold text-gray-700 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 sm:w-[15px] sm:h-[15px]" />
                <span>Secure Assistance</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 sm:w-[15px] sm:h-[15px]" />
                <span>Transparent Charges</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 sm:w-[15px] sm:h-[15px]" />
                <span>Fast Support</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 sm:w-[15px] sm:h-[15px]" />
                <span>WhatsApp Help</span>
              </div>
            </div>
          </motion.div>

          {/* 3D Interactive Card Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000 mt-2 sm:mt-0"
          >
            {/* Floating Badge 1 - Desktop only */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="hidden sm:flex absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl border border-purple-100 shadow-2xl items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold shadow-md shadow-purple-300">
                <Zap size={20} className="fill-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">{t('hero.badge1.label')}</div>
                <div className="text-sm font-black text-gray-900">{t('hero.badge1.value')}</div>
              </div>
            </motion.div>

            {/* Floating Badge 2 - Desktop only */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="hidden sm:flex absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl border border-green-100 shadow-2xl items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#22C55E] text-white flex items-center justify-center font-bold shadow-md shadow-green-300">
                <Star size={20} className="fill-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">{t('hero.badge2.label')}</div>
                <div className="text-sm font-black text-gray-900">{t('hero.badge2.value')}</div>
              </div>
            </motion.div>

            {/* Main Showcase Image */}
            <div className="relative rounded-2xl sm:rounded-3xl bg-white p-2 sm:p-3 ring-1 ring-purple-100/80 shadow-xl sm:shadow-2xl shadow-purple-500/8 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] relative flex items-center justify-center border border-purple-50 bg-gradient-to-br from-purple-50 to-indigo-50">
                <Image
                  src="/hero-dashboard.png"
                  alt="Sandy Digital Hub Services Showcase"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
