"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  color?: string;
}

export function ToolCard({ href, icon, title, description, badge, color = "from-purple-600 to-indigo-600" }: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-1">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-white">{icon}</span>
        </div>

        {badge && (
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold mb-3 border border-purple-200">
            {badge}
          </span>
        )}

        <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-purple-500 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex items-center gap-1 text-purple-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          Try it now <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
