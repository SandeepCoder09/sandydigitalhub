"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business Digitally?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Get in touch with us today for a free consultation. Let's discuss your ideas and bring them to life with cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg group bg-primary hover:bg-primary/90 text-primary-foreground">
                Start a Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="tel:+918756454282">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                <PhoneCall className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
