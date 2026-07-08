"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "E-Commerce Fashion Store",
    category: "Website Development",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    tech: ["Next.js", "Tailwind", "Stripe"],
  },
  {
    id: 2,
    title: "Food Delivery App",
    category: "Mobile App",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    tech: ["React Native", "Firebase"],
  },
  {
    id: 3,
    title: "Corporate Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    tech: ["React", "Node.js", "MongoDB"],
  },
];

export function PortfolioPreview() {
  return (
    <section className="py-24 bg-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground">
              Take a look at some of our recent work. We take pride in delivering high-quality digital products.
            </p>
          </div>
          <Link href="https://sandycoder.vercel.app" className="hidden md:block">
            <Button variant="outline" className="group">
              View All Projects 
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
                <Link href={`/portfolio/${project.id}`}>
                  <Button variant="secondary" className="w-full group/btn">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="https://sandycoder.vercel.app">
            <Button variant="outline" className="group w-full sm:w-auto">
              View All Projects 
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
