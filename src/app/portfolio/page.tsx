'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase, ExternalLink, Star, Sparkles, Globe, Smartphone,
  CheckCircle2, ArrowRight, Layers, Tag, ShieldCheck, PhoneCall,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioItem {
  id: string;
  title: string;
  category: 'Website Development' | 'Mobile Apps' | 'E-Commerce' | 'Digital Agency';
  image: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  rating: number;
  clientName: string;
}

const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  {
    id: 'suzu-ai',
    title: 'SUZU AI Operating System',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: 'Next-generation AI voice & text operating platform built for automated client interaction and business operations.',
    techStack: ['Next.js 15', 'Three.js', 'Groq Llama-3', 'ElevenLabs TTS', 'Tailwind CSS'],
    liveUrl: 'https://suzuai.vercel.app/dashboard/voice',
    rating: 5.0,
    clientName: 'Internal AI Product'
  },
  {
    id: 'sandy-hub',
    title: 'Sandy Digital Hub Platform',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    description: 'All-in-one digital agency & Jan Seva center portal featuring online checkout, document upload, and security firewall.',
    techStack: ['React', 'Next.js', 'MongoDB', 'Razorpay', 'Framer Motion'],
    liveUrl: 'https://sandydigitalhub.com',
    rating: 5.0,
    clientName: 'Sandy Digital Hub'
  },
  {
    id: 'store-app',
    title: 'Mart Digital E-Commerce Store',
    category: 'E-Commerce',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    description: 'Full-stack retail e-commerce platform with automated inventory management, payment gateway & order tracking.',
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Razorpay', 'Tailwind'],
    rating: 4.9,
    clientName: 'Fatehpur Retailers'
  },
  {
    id: 'portfolio-v1',
    title: 'Creative Agency Developer Portfolio',
    category: 'Website Development',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    description: 'Modern glassmorphic developer portfolio showcasing interactive 3D elements and dark mode aesthetics.',
    techStack: ['Next.js', 'Framer Motion', 'TailwindCSS', 'TypeScript'],
    liveUrl: 'https://sandycoder.vercel.app',
    rating: 5.0,
    clientName: 'Sandeep Coder'
  }
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Website Development', 'Mobile Apps', 'E-Commerce'];

  const filteredProjects = selectedCategory === 'All'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-12 sm:pb-16">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200/80 pt-6 sm:pt-14 pb-8 sm:pb-14 px-3 sm:px-6 lg:px-8 relative overflow-hidden shadow-xs">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-purple-50 rounded-full blur-3xl opacity-80" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-2.5 sm:space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" /> Our Client Work & Case Studies
          </div>
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Client <span className="text-[#7C3AED]">Portfolio & Projects</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-600 font-medium leading-relaxed">
            Explore web applications, e-commerce stores, and digital solutions engineered by Sandy Digital Hub.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#7C3AED] text-white shadow-md'
                    : 'bg-slate-100/90 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-xs sm:shadow-sm hover:shadow-lg transition-all space-y-0 group">
              <div className="relative h-40 sm:h-60 w-full overflow-hidden bg-gray-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900/90 text-blue-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-gray-700">
                  {project.category}
                </span>
              </div>

              <div className="p-3.5 sm:p-6 space-y-2.5 sm:space-y-4">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div>
                    <h3 className="text-sm sm:text-lg font-extrabold text-gray-900 group-hover:text-[#7C3AED] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500 font-bold mt-0.5">
                      <Star size={12} className="sm:w-3.5 sm:h-3.5" fill="currentColor" /> {project.rating} · {project.clientName}
                    </div>
                  </div>

                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-1 h-7 sm:h-9 px-2 sm:px-3">
                        Live <ExternalLink size={11} className="sm:w-3 sm:h-3" />
                      </Button>
                    </a>
                  )}
                </div>

                <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-snug sm:leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-1 sm:pt-2 border-t border-gray-100">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[9px] sm:text-[10px] font-bold">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-1 sm:pt-2">
                  <Link href={`/calculator`}>
                    <Button className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 h-10 sm:h-11">
                      Request Similar Project <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
