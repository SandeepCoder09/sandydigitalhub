import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Globe, Smartphone, CheckCircle2, ArrowRight, ArrowLeft,
  ExternalLink, Layers, Code2, ShieldCheck, Star, Sparkles, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaseStudy {
  slug: string;
  title: string;
  projectType: 'Client Project' | 'Internal Product' | 'Personal Project' | 'Concept Project';
  category: string;
  industry: string;
  image: string;
  liveUrl?: string;
  objective: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
}

const CASE_STUDIES: Record<string, CaseStudy> = {
  'suzu-ai': {
    slug: 'suzu-ai',
    title: 'SUZU AI Conversational Operating Platform',
    projectType: 'Internal Product',
    category: 'Fullstack AI Web Application',
    industry: 'Artificial Intelligence & Automation',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://suzuai.vercel.app/dashboard/voice',
    objective: 'Create an ultra-low latency voice & text assistant operating system for client inquiries and automated service facilitation.',
    problem: 'Traditional chatbots felt robotic, had multi-second latency, and lacked context about local Indian citizen services.',
    solution: 'Engineered a real-time voice synthesis pipeline using Groq Llama-3 inference, ElevenLabs TTS streaming, and 3D audio-reactive avatar visualization.',
    features: [
      'Real-time low-latency voice dialogue',
      'Context-aware knowledge base lookup',
      '3D audio-reactive particle visualization',
      'Automated lead qualification and ticket opening',
    ],
    techStack: ['Next.js 15', 'Three.js', 'Groq Llama-3', 'ElevenLabs TTS', 'TypeScript', 'Tailwind CSS'],
  },
  'sandy-hub': {
    slug: 'sandy-hub',
    title: 'SANDY DIGITAL HUB Multi-Tenant Platform',
    projectType: 'Internal Product',
    category: 'Enterprise Citizen Platform',
    industry: 'Digital Governance & Public Facilitation',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://sandydigitalhub.com',
    objective: 'Build a multi-tenant citizen service and partner network architecture with role-isolated dashboards and real-time request tracking.',
    problem: 'Local digital service operators lacked professional web presence, custom URLs, and automated request management pipelines.',
    solution: 'Architected a multi-tenant platform where authorized partners receive custom portal URLs, individual staff accounts, and live revenue tracking.',
    features: [
      'Dynamic partner branding & custom URL slugs',
      'Centralized 4-step request tracking pipeline',
      'Super Admin notification & announcement center',
      'Client-side image processing utility suite',
    ],
    techStack: ['Next.js App Router', 'MongoDB / Mongoose', 'NextAuth.js', 'Razorpay', 'Tailwind CSS'],
  },
  'mart-ecommerce': {
    slug: 'mart-ecommerce',
    title: 'Mart Digital Retail Store',
    projectType: 'Client Project',
    category: 'E-Commerce Platform',
    industry: 'Retail & Electronics',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    objective: 'Develop a modern, mobile-first e-commerce web storefront with real-time stock sync and automated Razorpay checkout.',
    problem: 'The local retail merchant relied on manual WhatsApp order collection, leading to missed sales and order reconciliation errors.',
    solution: 'Designed and deployed a responsive Next.js catalog with automated inventory management, customer SMS confirmations, and instant payment links.',
    features: [
      'Mobile-optimized product catalog and cart',
      'Instant Razorpay checkout & webhook verification',
      'Automated PDF invoice generation',
      'Admin stock management dashboard',
    ],
    techStack: ['Next.js', 'Node.js', 'MongoDB', 'Razorpay', 'Tailwind CSS'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];
  if (!project) return { title: 'Project Case Study | Sara Digital Studio' };

  return {
    title: `${project.title} | Case Study | SARA DIGITAL STUDIO`,
    description: project.objective,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-24">
      {/* Header */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-[11px] font-black uppercase tracking-wider">
              {project.projectType}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase">{project.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            {project.objective}
          </p>

          {project.liveUrl && (
            <div className="pt-2">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs h-10 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer">
                  Visit Live Project <ExternalLink size={13} />
                </Button>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Case Study Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Banner Image */}
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-md">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-600">The Problem</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              {project.problem}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-600">The Solution</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-black text-gray-900">Key Engineered Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                <CheckCircle2 size={16} className="text-purple-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3">
          <h3 className="text-base font-black text-gray-900">Technology Architecture</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-indigo-950 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black">Want to build something similar?</h3>
          <p className="text-xs sm:text-sm text-indigo-200 font-medium max-w-md mx-auto">
            Calculate estimated development pricing or schedule a discovery call with SARA DIGITAL STUDIO.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/calculator">
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-11 px-6">
                Calculate Project Cost →
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-indigo-700 text-white hover:bg-indigo-900 text-xs font-bold rounded-xl h-11 px-6">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
