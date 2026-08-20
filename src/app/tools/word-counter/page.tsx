'use client';

import { useState } from 'react';
import { ToolHero } from '@/components/image-tools/ToolHero';
import { FileText, Copy, Check, RotateCcw, Sparkles, Clock, Hash, AlignLeft, BarChart3 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanText = text.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = cleanText ? cleanText.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = cleanText ? cleanText.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200); // 200 wpm average
  const speakingTime = Math.ceil(words / 130); // 130 wpm average

  // Keyword density analysis
  const getKeywordFrequency = () => {
    if (!cleanText) return [];
    const wordList = cleanText.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 2);
    const counts: Record<string, number> = {};
    wordList.forEach((w) => {
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  };

  const keywordFreq = getKeywordFrequency();

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    toast.info('Text cleared.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ToolHero
        title="Word & Character Counter"
        description="Analyze text length, word count, sentence count, reading duration, and keyword density in real-time."
        icon={<FileText className="w-8 h-8 text-[#7C3AED]" />}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-black text-[#7C3AED]">{words}</div>
            <div className="text-xs font-extrabold uppercase text-gray-500 mt-1 flex items-center justify-center gap-1">
              <AlignLeft size={14} /> Words
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-black text-gray-900">{characters}</div>
            <div className="text-xs font-extrabold uppercase text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Hash size={14} /> Characters
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-black text-gray-900">{sentences}</div>
            <div className="text-xs font-extrabold uppercase text-gray-500 mt-1">Sentences</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-black text-emerald-600">{readingTime} min</div>
            <div className="text-xs font-extrabold uppercase text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Clock size={14} /> Reading Time
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <FileText size={18} className="text-[#7C3AED]" /> Enter or Paste Your Text
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleClear}
                disabled={!text}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={14} /> Clear
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your document, blog post, or essay content here..."
            className="w-full min-h-[250px] p-4 rounded-2xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none text-sm text-gray-900 leading-relaxed resize-y transition-all placeholder:text-gray-400"
          />

          {/* Deep Breakdown Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700 font-semibold">
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span>Characters (without spaces):</span>
                <span className="font-bold text-gray-900">{charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200/60">
                <span>Paragraphs:</span>
                <span className="font-bold text-gray-900">{paragraphs}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Estimated Speaking Time:</span>
                <span className="font-bold text-[#7C3AED]">{speakingTime} min</span>
              </div>
            </div>

            {/* Keyword Density */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
              <h4 className="text-xs font-extrabold uppercase text-gray-500 flex items-center gap-1">
                <BarChart3 size={14} className="text-[#7C3AED]" /> Keyword Density
              </h4>
              {keywordFreq.length === 0 ? (
                <p className="text-xs text-gray-400">Type words to see frequency analytics...</p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {keywordFreq.map(([word, count]) => (
                    <span key={word} className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1.5">
                      <span>{word}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[10px] font-black">{count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
