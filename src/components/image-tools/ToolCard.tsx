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
    <Link href={href} className="group block h-full">
      <div className="h-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-6 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
        <div>
          <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2.5 sm:mb-5 shadow-sm sm:shadow-md group-hover:scale-110 transition-transform duration-300 [&_svg]:w-4.5 [&_svg]:h-4.5 sm:[&_svg]:w-7 sm:[&_svg]:h-7`}>
            <span className="text-white flex items-center justify-center">{icon}</span>
          </div>

          {badge && (
            <span className="inline-block px-1.5 sm:px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[9px] sm:text-xs font-semibold mb-1.5 sm:mb-3 border border-purple-200">
              {badge}
            </span>
          )}

          <h3 className="text-gray-900 font-bold text-xs sm:text-lg mb-1 sm:mb-2 group-hover:text-purple-500 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-500 text-[10px] sm:text-sm leading-snug sm:leading-relaxed mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-none">{description}</p>
        </div>

        <div className="flex items-center gap-1 text-purple-500 text-xs sm:text-sm font-semibold opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-y-2 sm:group-hover:translate-y-0 pt-1">
          <span>Open Tool</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>
    </Link>
  );
}
