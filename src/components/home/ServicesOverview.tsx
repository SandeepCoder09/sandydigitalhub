"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Smartphone, FileText, Briefcase, Palette, Megaphone, Wrench, FileDigit, ImageIcon } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Website Development",
    description: "Premium, fast, and SEO-optimized business websites, portfolios, and e-commerce stores.",
    icon: Code,
    link: "/services#web-development",
  },
  {
    title: "Mobile App Development",
    description: "Custom Android and iOS applications designed for performance and excellent user experience.",
    icon: Smartphone,
    link: "/services#mobile-apps",
  },
  {
    title: "PAN Card Services",
    description: "Fast and reliable new PAN card applications and correction services.",
    icon: FileDigit,
    link: "/services#digital-services",
  },
  {
    title: "Online Form Filling",
    description: "Assistance with government forms, exam registrations, and online applications.",
    icon: FileText,
    link: "/services#digital-services",
  },
  {
    title: "Resume Building",
    description: "Professional and ATS-friendly resumes and cover letters for job seekers.",
    icon: Briefcase,
    link: "/services#digital-services",
  },
  {
    title: "Graphic Design",
    description: "Eye-catching logos, banners, social media posts, and complete business branding.",
    icon: Palette,
    link: "/services#design",
  },
  {
    title: "Digital Marketing",
    description: "Data-driven SEO, social media management, and online advertising to grow your business.",
    icon: Megaphone,
    link: "/services#marketing",
  },
  {
    title: "Technical Support",
    description: "Reliable IT support, software installations, and hardware troubleshooting.",
    icon: Wrench,
    link: "/services#support",
  },
  {
    title: "Free Image Tools",
    description: "Compress, resize, crop, convert, passport photo maker & more — all free, right in your browser.",
    icon: ImageIcon,
    link: "/image-tools",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function ServicesOverview() {
  return (
    <section className="py-24 bg-accent/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive range of digital solutions designed to help individuals and businesses thrive in the modern era.
          </p>
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
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow justify-between">
                  <CardDescription className="text-base mb-6">
                    {service.description}
                  </CardDescription>
                  <Link href={service.link}>
                    <Button variant="link" className="px-0 text-primary group-hover:gap-2 transition-all">
                      Learn more <ArrowRight className="w-4 h-4 ml-1" />
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
