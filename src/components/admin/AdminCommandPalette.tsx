'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, LayoutDashboard, ShoppingBag, Wrench, Users,
  FolderCheck, ShieldAlert, AlertOctagon, BarChart3, MessageSquare,
  User, ExternalLink, Command, ArrowRight, X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  href?: string;
  action?: () => void;
  icon: any;
}

export function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const commands: CommandItem[] = [
    { id: 'dashboard', title: 'Dashboard Overview', category: 'Navigation', href: '/admin', icon: LayoutDashboard },
    { id: 'orders', title: 'Manage Orders & Order Lookup', category: 'Operations', href: '/admin/orders', icon: ShoppingBag },
    { id: 'users', title: 'Manage Users & Account Roles', category: 'People', href: '/admin/users', icon: Users },
    { id: 'services', title: 'Manage Services Catalog & Pricing', category: 'Operations', href: '/admin/services', icon: Wrench },
    { id: 'uploads', title: 'User Uploads & Document Inspector', category: 'Operations', href: '/admin/uploads', icon: FolderCheck },
    { id: 'site-control', title: 'Site & Firewall Control Center', category: 'System', href: '/admin/site-control', icon: ShieldAlert },
    { id: 'security-logs', title: 'Security Audit Logs & Threats', category: 'System', href: '/admin/security-logs', icon: AlertOctagon },
    { id: 'analytics', title: 'Visitor Telemetry & Traffic Analytics', category: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { id: 'chat', title: 'Live Customer Support Chat Inbox', category: 'Operations', href: '/admin/chat', icon: MessageSquare },
    { id: 'account', title: 'My Admin Profile & Settings', category: 'Account', href: '/account', icon: User },
    { id: 'public-site', title: 'View Live Public Website', category: 'Quick Action', action: () => window.open('/', '_blank'), icon: ExternalLink },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (cmd: CommandItem) => {
    setIsOpen(false);
    setQuery('');
    if (cmd.action) {
      cmd.action();
    } else if (cmd.href) {
      router.push(cmd.href);
    }
  };

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-violet-50 text-gray-400 hover:text-violet-700 transition-all border border-gray-200 text-xs font-semibold cursor-pointer"
        title="Open Command Palette (⌘K)"
      >
        <Search size={14} className="text-violet-600" />
        <span>Search admin pages, orders...</span>
        <kbd className="font-mono text-[10px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md shadow-2xs font-extrabold ml-2">
          ⌘K
        </kbd>
      </button>

      {/* Modal Command Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col">
            {/* Input Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Search size={18} className="text-violet-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page name, or Order ID..."
                className="w-full text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-900 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Commands List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs font-bold text-gray-400">
                  No matching admin commands found.
                </div>
              ) : (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-violet-50 text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-violet-600 group-hover:text-white text-gray-600 flex items-center justify-center shrink-0 transition-colors">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-gray-900 group-hover:text-violet-900 truncate">
                            {cmd.title}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {cmd.category}
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-violet-600 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hotkey Info */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Command size={12} className="text-violet-600" /> Sandy Digital Hub Command Palette
              </span>
              <span>Press <kbd className="font-mono bg-white border px-1 rounded">ESC</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
