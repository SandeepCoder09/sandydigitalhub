'use client';

import { useState } from 'react';
import { ToolHero } from '@/components/image-tools/ToolHero';
import { Lock, Copy, Check, RefreshCw, ShieldCheck, Key } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('s8#K9$mP2!vL5@xQ');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      toast.error('Please select at least one character type.');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
    toast.info('New password generated!');
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success('Password copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Password strength calculation
  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 2;
    if (length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 2;

    if (score <= 3) return { label: 'Weak', color: 'bg-red-500 text-red-500', width: 'w-1/3' };
    if (score <= 5) return { label: 'Medium', color: 'bg-amber-500 text-amber-500', width: 'w-2/3' };
    return { label: 'Strong / Ultra Secure', color: 'bg-emerald-500 text-emerald-500', width: 'w-full' };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ToolHero
        title="Strong Password & Token Generator"
        description="Generate cryptographically secure passwords and API keys. 100% client-side with zero logging."
        icon={<Lock className="w-8 h-8 text-[#7C3AED]" />}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
        {/* Main Password Box */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 space-y-6">
          <div className="relative bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="font-mono text-lg sm:text-2xl font-black text-gray-900 break-all select-all tracking-wider">
              {password}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={generatePassword}
                className="p-2.5 rounded-xl bg-purple-100 text-[#7C3AED] hover:bg-purple-200 transition-colors"
                title="Regenerate"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-purple-200"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Strength Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-extrabold uppercase text-gray-500">
              <span>Security Level:</span>
              <span className={strength.color.split(' ')[1]}>{strength.label}</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]} ${strength.width}`} />
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-5 pt-4 border-t border-gray-100">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-900">Password Length: {length}</label>
                <span className="text-xs font-extrabold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {length} chars
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-[#7C3AED] cursor-pointer"
              />
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-800">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded"
                />
                <span>Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded"
                />
                <span>Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded"
                />
                <span>Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 accent-[#7C3AED] rounded"
                />
                <span>Symbols (!@#$%)</span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-[#7C3AED] hover:bg-[#7C3AED]/90 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-2 text-base"
            >
              <RefreshCw size={18} /> Generate New Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
