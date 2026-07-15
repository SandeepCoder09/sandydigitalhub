"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { motion } from "framer-motion";
import { DollarSign, Zap, HeadphonesIcon, ShieldCheck, Cpu, Smile } from "lucide-react";

const reasons = [
  {
    title: "Affordable Pricing",
    description: "Premium quality services at competitive and transparent prices with no hidden costs.",
    icon: DollarSign,
  },
  {
    title: "Fast Delivery",
    description: "We value your time. We ensure quick turnaround times without compromising on quality.",
    icon: Zap,
  },
  {
    title: "Professional Support",
    description: "Dedicated customer service to assist you at every step of your digital journey.",
    icon: HeadphonesIcon,
  },
  {
    title: "Secure Payments",
    description: "100% secure payment gateways and data protection protocols to keep you safe.",
    icon: ShieldCheck,
  },
  {
    title: "Modern Technologies",
    description: "We use the latest tech stacks to ensure your products are future-proof.",
    icon: Cpu,
  },
  {
    title: "Customer Satisfaction",
    description: "Our primary goal is to exceed your expectations and deliver complete satisfaction.",
    icon: Smile,
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Choose Us?</h2>
          <p className="text-lg text-muted-foreground">
            We don't just provide services; we build lasting relationships through trust, quality, and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
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
              <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
