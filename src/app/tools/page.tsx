'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { ToolCard } from "@/components/image-tools/ToolCard";
import {
  Minimize2, User, RefreshCcw, Maximize2, Crop, Eraser, Layers, Zap, FileText, QrCode, Search, Sparkles, Lock, FileCode, Image as ImageIcon, Wrench
} from "lucide-react";

const allTools = [
  // Category: Image & Photo Tools
  { 
    href: "/tools/govt-photo-resizer", 
    icon: <ImageIcon className="w-7 h-7" />, 
    title: "Govt Job Photo & Signature Resizer", 
    description: "Resize photos & signatures for UPSC, SSC, IBPS, State Govt & Board exams to exact KB & pixel specs.", 
    badge: "Official Govt", 
    category: "image",
    color: "from-purple-600 to-indigo-600" 
  },
  { 
    href: "/image-tools/compress", 
    icon: <Minimize2 className="w-7 h-7" />, 
    title: "Image Compressor", 
    description: "Reduce image file size from MB to KB without quality loss. Instant client-side compression.", 
    badge: "Most Popular", 
    category: "image",
    color: "from-purple-500 to-indigo-600" 
  },
  { 
    href: "/image-tools/passport-photo", 
    icon: <User className="w-7 h-7" />, 
    title: "Passport Photo Maker", 
    description: "Generate standard passport-size photos (35×45mm). Get a printable sheet of 8 photos instantly.", 
    badge: "Print Ready", 
    category: "image",
    color: "from-purple-600 to-purple-800" 
  },
  { 
    href: "/image-tools/background-remove", 
    icon: <Eraser className="w-7 h-7" />, 
    title: "Background Remover", 
    description: "Remove plain backgrounds and make images transparent or white — great for product photos & logos.", 
    category: "image",
    color: "from-pink-500 to-pink-600" 
  },
  { 
    href: "/image-tools/convert", 
    icon: <RefreshCcw className="w-7 h-7" />, 
    title: "Format Converter", 
    description: "Convert images between JPG, PNG, WebP formats instantly in your browser.", 
    category: "image",
    color: "from-purple-500 to-purple-600" 
  },
  { 
    href: "/image-tools/resize", 
    icon: <Maximize2 className="w-7 h-7" />, 
    title: "Image Resizer", 
    description: "Resize by exact pixels or percentage with aspect ratio lock and social media presets.", 
    category: "image",
    color: "from-green-500 to-green-600" 
  },
  { 
    href: "/image-tools/crop", 
    icon: <Crop className="w-7 h-7" />, 
    title: "Image Cropper", 
    description: "Crop images with interactive handles and presets (Square, 16:9, 4:3, Freehand).", 
    category: "image",
    color: "from-cyan-500 to-cyan-600" 
  },
  { 
    href: "/image-tools/watermark", 
    icon: <Layers className="w-7 h-7" />, 
    title: "Watermark Adder", 
    description: "Stamp custom text watermarks with full opacity, size, and position control.", 
    category: "image",
    color: "from-yellow-500 to-yellow-600" 
  },

  // Category: PDF & Document Tools
  { 
    href: "/image-tools/image-to-pdf", 
    icon: <FileText className="w-7 h-7" />, 
    title: "Image to PDF Converter", 
    description: "Combine single or multiple images (JPG/PNG) into a clean, printable PDF document.", 
    badge: "High Demand", 
    category: "pdf",
    color: "from-emerald-500 to-emerald-600" 
  },

  // Category: Utility & Generator Tools
  { 
    href: "/image-tools/qr-generator", 
    icon: <QrCode className="w-7 h-7" />, 
    title: "QR Code & UPI Generator", 
    description: "Generate custom QR codes for Website URLs, UPI Payments, WiFi credentials, and text.", 
    badge: "Hot", 
    category: "utility",
    color: "from-indigo-500 to-indigo-600" 
  },
  { 
    href: "/tools/word-counter", 
    icon: <FileCode className="w-7 h-7" />, 
    title: "Word & Character Counter", 
    description: "Analyze word count, character count, sentence structure, reading time, and keyword frequency.", 
    badge: "New", 
    category: "utility",
    color: "from-amber-500 to-amber-600" 
  },
  { 
    href: "/tools/password-generator", 
    icon: <Lock className="w-7 h-7" />, 
    title: "Strong Password Generator", 
    description: "Generate cryptographically secure passwords & API tokens with length & strength controls.", 
    badge: "New", 
    category: "utility",
    color: "from-rose-500 to-rose-600" 
  },
];

const categories = [
  { id: "all", label: "All Free Tools", icon: Zap },
  { id: "image", label: "Image & Photo Tools", icon: ImageIcon },
  { id: "pdf", label: "PDF & Document Tools", icon: FileText },
  { id: "utility", label: "Utilities & Generators", icon: Wrench },
];

export default function ToolsHubPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200 pt-6 sm:pt-14 pb-8 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-purple-50 rounded-full blur-3xl opacity-70" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> 100% Free · No Sign-Up · 100% Browser Private
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Free Online <span className="text-[#7C3AED]">Digital Tools</span> Hub
          </h1>

          <p className="text-xs sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Compress images, generate passport photos, convert PDFs, create QR codes, count words, and generate secure passwords — all in your browser!
          </p>

          {/* Search Bar */}
          <div className="max-w-xl sm:max-w-2xl mx-auto pt-2 sm:pt-4">
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <Search className="text-[#7C3AED]" size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search free tools (photo resizer, passport, compress, qr)..."
                className="w-full bg-white border-2 border-slate-200 hover:border-purple-200 focus:border-[#7C3AED] rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-4 text-xs sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 shadow-sm sm:shadow-lg focus:ring-4 focus:ring-purple-500/15 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-white bg-slate-200 hover:bg-[#7C3AED] rounded-full w-5 h-5 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mb-6 sm:mb-10">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl font-bold text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#7C3AED] text-white shadow-md shadow-purple-500/20 scale-102"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-xs"
                }`}
              >
                <CatIcon size={14} className={activeCategory === cat.id ? "text-white" : "text-[#7C3AED]"} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-2xl sm:rounded-3xl border border-gray-200 text-center max-w-md mx-auto shadow-sm">
            <p className="text-gray-500 text-xs sm:text-base font-medium">No tools found matching your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
