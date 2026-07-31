"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ToolHeroProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export function ToolHero({ icon, title, description, badge }: ToolHeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-gray-200 bg-white">
      {/* Subtle gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-orange-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-64 h-32 bg-orange-50/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <Link
          href="/image-tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Image Tools
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-200 shrink-0">
            <span className="text-white">{icon}</span>
          </div>
          <div>
            {badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold mb-2 border border-orange-200">
                {badge}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-500 mt-2 text-lg max-w-2xl">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
