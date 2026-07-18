'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Wrench, Users } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', mobileLabel: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'Manage Orders', mobileLabel: 'Orders', icon: ShoppingBag },
    { href: '/admin/services', label: 'Manage Services', mobileLabel: 'Services', icon: Wrench },
    { href: '/admin/users', label: 'Manage Users', mobileLabel: 'Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile Top Navigation 2x2 Grid (< md) */}
      <div className="block md:hidden mb-6">
        <div className="bg-[#111111] p-3.5 rounded-2xl border border-white/10 space-y-2.5">
          <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider px-1">Admin Panel Navigation</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all text-center w-full ${
                    isActive
                      ? 'bg-[#FF7A00] text-white shadow-md font-bold'
                      : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="truncate">{link.mobileLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Vertical Sidebar (>= md) */}
      <div className="hidden md:block w-64 bg-[#111111] p-6 rounded-2xl border border-white/10 h-fit">
        <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-[#FF7A00] bg-white/5 font-bold border border-[#FF7A00]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
