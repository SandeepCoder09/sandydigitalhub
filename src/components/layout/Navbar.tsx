/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { LanguageNavToggle } from "@/components/layout/LanguageNavToggle";
import { UserNavMenu } from "@/components/layout/UserNavMenu";
import { TranslatedNav } from "@/components/layout/TranslatedNav";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm shadow-slate-100/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">

          {/* ── Logo ──────────────────────────────────── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
              <Image
                src="/logo.png"
                alt="Sandy Digital Hub"
                width={180}
                height={50}
                className="h-9 sm:h-10 w-auto object-contain shrink-0 max-w-[130px] sm:max-w-[160px]"
                priority
              />
            </Link>
          </div>

          {/* ── Desktop Nav Links (xl+) — via TranslatedNav client component ── */}
          <nav className="hidden xl:flex items-center gap-x-3 text-xs font-semibold text-slate-700 flex-1 mx-3">
            <TranslatedNav mode="desktop" />
          </nav>

          {/* ── Desktop: Auth + Utility (xl+) ── */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <LanguageNavToggle />
            <NotificationBell />
            <CartDrawer />
            {session ? (
              <UserNavMenu user={session.user!} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-bold text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 px-3 text-xs h-8">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all hover:scale-105 px-3 text-xs h-8">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile / Tablet: Utility + Off-Canvas Mobile Navigation Drawer (below xl) ── */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <LanguageNavToggle />
            <NotificationBell />
            <CartDrawer />
            <MobileNavDrawer session={session} />
          </div>

        </div>
      </div>
    </header>
  );
}
