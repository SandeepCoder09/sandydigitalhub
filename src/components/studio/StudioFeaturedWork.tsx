'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Layers, ExternalLink, Code2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function StudioFeaturedWork() {
  const featuredProjects = [
    {
      title: 'DevSync - Developer Collaboration Hub',
      category: 'Fullstack Web Application',
      description: 'A modern developer community workspace featuring real-time chat, code snippets sharing, and interactive project kanban boards.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'WebSockets'],
      link: 'https://github.com/SandeepCoder09',
    },
    {
      title: 'Aura Luxe - Premium Fashion E-Commerce',
      category: 'E-Commerce & Brand Platform',
      description: 'High-converting luxury retail storefront with dynamic size selectors, instant Razorpay checkout, and an automated customer receipt engine.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
      tags: ['Next.js 15', 'Razorpay API', 'Framer Motion', 'Cloudinary'],
      link: 'https://github.com/SandeepCoder09',
    },
    {
      title: 'DocuQuick - Government Certificate & Form Portal',
      category: 'Citizen Services SaaS Platform',
      description: 'Streamlined online application processor with client document preview, PDF generation, and automated WhatsApp order tracking status.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1000',
      tags: ['React', 'Node.js', 'Tailwind CSS', 'PDFKit', 'PWA'],
      link: 'https://github.com/SandeepCoder09',
    },
  ];

  return (
    <section id="work" className="py-20 bg-slate-900 text-white relative border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-900/40 border border-violet-500/30 text-violet-300 text-xs font-black uppercase tracking-wider">
              <Layers size={13} />
              <span>Selected Studio Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">Client Projects</span>
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              Explore recent digital products, web platforms, and applications we engineered from concept to launch.
            </p>
          </div>

          <Link href="/portfolio">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-700 hover:border-violet-500 text-white bg-slate-800/80 hover:bg-slate-700 font-bold text-xs shrink-0">
              <span>View All Projects</span>
              <ArrowUpRight size={15} className="ml-1.5" />
            </Button>
          </Link>
        </div>

        {/* 3 Featured Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredProjects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-violet-500/60 overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/40"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-violet-300">
                  {proj.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-violet-300 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tags.map((t) => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-violet-400 group-hover:text-violet-300 hover:underline"
                  >
                    <span>View Project Details</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
