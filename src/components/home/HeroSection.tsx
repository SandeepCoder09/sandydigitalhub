"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MonitorSmartphone, Code, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              <span className="block text-primary">Sandy Digital Hub</span>
              <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl text-foreground/90 leading-tight">
                Websites, Apps, Digital Services & Solutions Under One Roof.
              </span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8">
              We are a premium digital service center and technology agency delivering modern, fast, and secure solutions for businesses and individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/services">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <span>Web Dev</span>
              </div>
              <div className="flex items-center gap-2">
                <MonitorSmartphone className="h-5 w-5 text-primary" />
                <span>Mobile Apps</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span>Digital Services</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative rounded-2xl bg-secondary/5 p-2 ring-1 ring-inset ring-secondary/10 lg:-m-4 lg:rounded-3xl lg:p-4 shadow-2xl overflow-hidden backdrop-blur-3xl glassmorphism">
              <div className="rounded-xl overflow-hidden bg-white/50 dark:bg-black/50 aspect-video relative flex items-center justify-center border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 flex flex-col items-center justify-center">
                   <MonitorSmartphone className="w-32 h-32 text-primary opacity-80" />
                   <p className="mt-4 font-semibold text-lg text-foreground/70">Premium Digital Solutions</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
