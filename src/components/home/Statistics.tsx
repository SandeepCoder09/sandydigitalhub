"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const statsConfig = [
  { value: "500+", labelKey: 'stats.projects' },
  { value: "100%", labelKey: 'stats.clients' },
  { value: "150+", labelKey: 'stats.websites' },
  { value: "50k+", labelKey: 'stats.services' },
];

export function Statistics() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4"
            >
              <div className="text-4xl sm:text-5xl font-extrabold mb-2 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium text-lg">
                {t(stat.labelKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
