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
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Briefcase size={14} /> Our Client Work & Case Studies
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Client <span className="text-[#FF4500]">Portfolio & Projects</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            Explore web applications, e-commerce stores, and digital solutions engineered by Sandy Digital Hub.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF4500] text-white shadow-md'
                    : 'bg-gray-800/80 border border-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all space-y-4 group">
              <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/90 text-orange-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-gray-700">
                  {project.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-[#FF4500] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-0.5">
                      <Star size={14} fill="currentColor" /> {project.rating} · {project.clientName}
                    </div>
                  </div>

                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-1.5">
                        Live Demo <ExternalLink size={13} />
                      </Button>
                    </a>
                  )}
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href={`/calculator`}>
                    <Button className="w-full bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 py-2.5">
                      Request Similar Project <ArrowRight size={14} />
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
