'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { ToolCard } from "@/components/image-tools/ToolCard";
import {
  Minimize2, User, RefreshCcw, Maximize2, Crop, Eraser, Layers, Zap, FileText, QrCode, Search, Sparkles, Lock, FileCode
} from "lucide-react";

const allTools = [
  // Category: Image & Photo Tools
  { 
    href: "/image-tools/compress", 
    icon: <Minimize2 className="w-7 h-7" />, 
    title: "Image Compressor", 
    description: "Reduce image file size from MB to KB without quality loss. Instant client-side compression.", 
    badge: "Most Popular", 
    category: "image",
    color: "from-orange-500 to-orange-600" 
  },
  { 
    href: "/image-tools/passport-photo", 
    icon: <User className="w-7 h-7" />, 
    title: "Passport Photo Maker", 
    description: "Generate standard passport-size photos (35×45mm). Get a printable sheet of 8 photos instantly.", 
    badge: "Print Ready", 
    category: "image",
    color: "from-blue-500 to-blue-600" 
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
  { id: "all", label: "All Free Tools", icon: "⚡" },
  { id: "image", label: "Image & Photo Tools", icon: "🖼️" },
  { id: "pdf", label: "PDF & Document Tools", icon: "📄" },
  { id: "utility", label: "Utilities & Generators", icon: "🛠️" },
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[300px] bg-orange-50 rounded-full blur-3xl opacity-70" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF4500] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} /> 100% Free · No Sign-Up · 100% Browser Private
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
            Free Online <span className="text-[#FF4500]">Digital Tools</span> Hub
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Compress images, generate passport photos, convert PDFs, create QR codes, count words, and generate secure passwords — all in your browser!
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. compress, passport, password, qr)..."
              className="w-full bg-white border border-gray-300 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-gray-900 shadow-lg focus:border-[#FF4500] focus:ring-2 focus:ring-[#FF4500]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#FF4500] text-white shadow-lg shadow-orange-500/20 scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center max-w-md mx-auto shadow-sm">
            <p className="text-gray-500 font-medium">No tools found matching your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
