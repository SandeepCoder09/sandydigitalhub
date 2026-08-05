"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { motion } from "framer-motion";
import { DollarSign, Zap, HeadphonesIcon, ShieldCheck, Cpu, Smile } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const reasonsConfig = [
  { titleKey: 'why.affordable.title', descKey: 'why.affordable.desc', icon: DollarSign },
  { titleKey: 'why.fast.title',       descKey: 'why.fast.desc',       icon: Zap },
  { titleKey: 'why.support.title',    descKey: 'why.support.desc',    icon: HeadphonesIcon },
  { titleKey: 'why.secure.title',     descKey: 'why.secure.desc',     icon: ShieldCheck },
  { titleKey: 'why.tech.title',       descKey: 'why.tech.desc',       icon: Cpu },
  { titleKey: 'why.satisfaction.title', descKey: 'why.satisfaction.desc', icon: Smile },
];

export function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t('why.heading')}</h2>
          <p className="text-lg text-muted-foreground">{t('why.subtext')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasonsConfig.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/5 border border-secondary/10 hover:border-primary/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <reason.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t(reason.titleKey)}</h3>
              <p className="text-muted-foreground">{t(reason.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
