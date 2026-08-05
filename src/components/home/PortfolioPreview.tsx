"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const projects = [
  {
    id: 1,
    title: "3D Portfolio",
    category: "3D / Interactive",
    image: "https://sandycoder.vercel.app/assets/Portfolio3D.png",
    tech: ["Three.js", "HTML5", "CSS3", "JavaScript"],
    url: "https://sandeepcoder09.github.io/3DPortfolioBySandy/",
  },
  {
    id: 2,
    title: "BudgetMate",
    category: "Finance App",
    image: "https://sandycoder.vercel.app/assets/BudgeMateLogo.png",
    tech: ["HTML5", "CSS3", "JavaScript"],
    url: "https://sandycoder.vercel.app/budgetmet/index.html",
  },
  {
    id: 3,
    title: "Neon Calculator",
    category: "Tool",
    image: "https://sandycoder.vercel.app/assets/cal.png",
    tech: ["React", "CSS3", "Keyboard Input"],
    url: "https://calcbysandy.vercel.app/",
  },
  {
    id: 4,
    title: "SH — The Hunger Point",
    category: "Food App",
    image: "https://sandycoder.vercel.app/assets/sh-thehungerpoint.png",
    tech: ["Firebase Auth", "HTML5", "CSS3", "JavaScript"],
    url: "https://sandycoder.vercel.app/sh-TheHungerPoint.html",
  },
  {
    id: 5,
    title: "Habit Mover",
    category: "PWA",
    image: "https://sandycoder.vercel.app/assets/habitmover.png",
    tech: ["PWA", "HTML5", "CSS3", "JavaScript"],
    url: "https://habitmover.vercel.app",
  },
  {
    id: 6,
    title: "QR GenDecoder",
    category: "QR Gen. & Dec.",
    image: "https://sandycoder.vercel.app/assets/qr-logo-09-brand.png",
    tech: ["HTML5", "CSS3", "JavaScript"],
    url: "https://qrgendecoder.vercel.app",
  },
  {
    id: 7,
    title: "Mohalla",
    category: "PWA",
    image: "https://sandycoder.vercel.app/assets/mohalla.png",
    tech: ["PWA", "Node.js", "Express", "MongoDB"],
    url: "https://mohalla-app.onrender.com",
  },
  {
    id: 8,
    title: "Website Design",
    category: "Web Design",
    image: "https://sandycoder.vercel.app/assets/webdesign.png",
    tech: ["Figma", "UI/UX", "Responsive Design"],
    url: "https://sandycoder.vercel.app/portfolio#projects",
  },
];

export function PortfolioPreview() {
  const { t } = useLanguage();
  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{t('portfolio.heading')}</h2>
            <p className="text-lg text-muted-foreground">{t('portfolio.subtext')}</p>
          </div>
          <Link href="https://sandycoder.vercel.app/portfolio#projects" target="_blank" rel="noopener noreferrer" className="hidden md:block">
            <Button variant="outline" className="group">
              {t('portfolio.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="text-sm font-medium text-primary mb-2">{project.category}</div>
                <h3 className="text-xl font-semibold mb-4">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="w-full group/btn">
                    {t('portfolio.viewLive')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="https://sandycoder.vercel.app/portfolio#projects" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="group w-full sm:w-auto">
              {t('portfolio.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
