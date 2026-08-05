"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Smartphone, FileText, Briefcase, Palette, Megaphone, Wrench, FileDigit, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function ServicesOverview() {
  const { t } = useLanguage();

  const services = [
    {
      titleKey: 'service.web.title',
      descKey:  'service.web.desc',
      icon: Code,
      link: "/services#web-development",
    },
    {
      titleKey: 'service.app.title',
      descKey:  'service.app.desc',
      icon: Smartphone,
      link: "/services#mobile-apps",
    },
    {
      titleKey: 'service.pan.title',
      descKey:  'service.pan.desc',
      icon: FileDigit,
      link: "/services#digital-services",
    },
    {
      titleKey: 'service.form.title',
      descKey:  'service.form.desc',
      icon: FileText,
      link: "/services#digital-services",
    },
    {
      titleKey: 'service.resume.title',
      descKey:  'service.resume.desc',
      icon: Briefcase,
      link: "/services#digital-services",
    },
    {
      titleKey: 'service.design.title',
      descKey:  'service.design.desc',
      icon: Palette,
      link: "/services#design",
    },
    {
      titleKey: 'service.marketing.title',
      descKey:  'service.marketing.desc',
      icon: Megaphone,
      link: "/services#marketing",
    },
    {
      titleKey: 'service.support.title',
      descKey:  'service.support.desc',
      icon: Wrench,
      link: "/services#support",
    },
    {
      titleKey: 'service.image.title',
      descKey:  'service.image.desc',
      icon: ImageIcon,
      link: "/image-tools",
    },
  ];

  return (
    <section className="py-24 bg-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t('services.heading')}</h2>
          <p className="text-lg text-muted-foreground">{t('services.subtext')}</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden bg-card/80 backdrop-blur-sm border-white/20 dark:border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow justify-between">
                  <CardDescription className="text-base mb-6">
                    {t(service.descKey)}
                  </CardDescription>
                  <Link href={service.link}>
                    <Button variant="link" className="px-0 text-primary group-hover:gap-2 transition-all">
                      {t('services.learnMore')} <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
