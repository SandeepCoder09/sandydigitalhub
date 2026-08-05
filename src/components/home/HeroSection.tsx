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
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white pt-16 pb-24 lg:pt-28 lg:pb-36">
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#2563EB]/12 to-[#06B6D4]/8 blur-[130px] rounded-full pointer-events-none -z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-md shadow-blue-500/5 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider mb-6 hover:scale-105 transition-transform cursor-pointer">
              <Sparkles size={14} className="animate-spin text-[#2563EB]" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15] mb-6">
              {t('hero.heading1')} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#06B6D4] bg-clip-text text-transparent">
                {t('hero.brand')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {t('hero.subtext')}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto text-base font-extrabold h-14 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/35 transition-all hover:scale-105 group">
                  <Zap className="mr-2 h-5 w-5 fill-white" /> {t('hero.cta.primary')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/image-tools">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-bold h-14 px-7 border-2 border-blue-200 text-gray-800 hover:text-[#2563EB] hover:border-[#2563EB] hover:bg-blue-50 rounded-2xl transition-all hover:scale-105">
                  <ImageIcon className="mr-2 h-5 w-5 text-[#2563EB]" /> {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Micro Guarantees */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-gray-700 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>{t('hero.guarantee1')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>{t('hero.guarantee2')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>{t('hero.guarantee3')}</span>
              </div>
            </div>
          </motion.div>

          {/* 3D Interactive Card Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000"
          >
            {/* Floating Badge 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl border border-blue-100 shadow-2xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-md shadow-blue-300">
                <Zap size={20} className="fill-white" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold">{t('hero.badge1.label')}</div>
                <div className="text-sm font-black text-gray-900">{t('hero.badge1.value')}</div>
              </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl border border-green-100 shadow-2xl flex items-center gap-3"
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
            <div className="relative rounded-3xl bg-white p-3 ring-1 ring-blue-100/80 shadow-2xl shadow-blue-500/8 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] relative flex items-center justify-center border border-blue-50 bg-gradient-to-br from-blue-50 to-cyan-50">
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
