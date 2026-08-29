import Link from "next/link";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { LanguageNavToggle } from "@/components/layout/LanguageNavToggle";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export async function Navbar() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP PERMANENT LEFT SIDEBAR (lg+)
      ───────────────────────────────────────────────────────────── */}
      <AppSidebar initialSession={session} />

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE TOP HEADER BAR (< lg)
      ───────────────────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex h-13 sm:h-14 items-center justify-between gap-2.5">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Sandy Digital Hub"
                  width={130}
                  height={36}
                  className="h-7 sm:h-8 w-auto object-contain shrink-0 max-w-[125px] sm:max-w-[140px]"
                  priority
                />
              </Link>
            </div>

            {/* Mobile Top Quick Actions (Language, Notification, Cart) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <LanguageNavToggle />
              <NotificationBell />
              <CartDrawer />
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. MOBILE BOTTOM NAVIGATION DOCK (< lg)
      ───────────────────────────────────────────────────────────── */}
      <MobileBottomNav session={session} />
    </>
  );
}
