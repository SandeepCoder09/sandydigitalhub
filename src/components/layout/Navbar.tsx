/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, User, ShieldCheck, Home, Zap, Image as ImageIcon, Briefcase, Tag, Building, PhoneCall, Wrench, FileCheck, Calculator, PackageCheck } from "lucide-react";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NavLogoutButton } from "@/components/layout/NavLogoutButton";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  const routes: { name: string; path: string; icon: any; target?: string }[] = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/services", icon: Zap },
    { name: "Checklist", path: "/document-checklist", icon: FileCheck },
    { name: "Calculator", path: "/calculator", icon: Calculator },
    { name: "Track Order", path: "/track-order", icon: PackageCheck },
    { name: "Portfolio", path: "/portfolio", icon: Briefcase },
    { name: "Tools", path: "/tools", icon: Wrench },
    { name: "Pricing", path: "/pricing", icon: Tag },
    { name: "Contact", path: "/contact", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo Section (Fixed for Pixel & Small Mobile Screens) */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
              <Image 
                src="/logo.png" 
                alt="Sandy Digital Hub" 
                width={180} 
                height={50} 
                className="h-10 sm:h-12 w-auto object-contain shrink-0 max-w-[150px] sm:max-w-[190px]" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation with SVG Icons */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-semibold text-gray-700">
            {routes.map((route) => {
              const RouteIcon = route.icon;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  target={route.target || "_self"}
                  rel={route.target === "_blank" ? "noreferrer" : undefined}
                  className="flex items-center gap-1.5 transition-colors hover:text-[#FF4500] hover:font-bold"
                >
                  <RouteIcon size={15} className="text-[#FF4500] shrink-0" />
                  <span>{route.name}</span>
                </Link>
              );
            })}
            <div className="flex items-center space-x-3 ml-3">
              <NotificationBell />
              <CartDrawer />
              {session ? (
                <>
                  {session.user?.role === 'ADMIN' || session.user?.role === 'admin' ? (
                    <>
                      <Link href="/account">
                        <Button variant="outline" className="border-gray-300 text-gray-800 hover:bg-gray-100 font-bold rounded-xl flex items-center gap-1.5 px-3">
                          <User size={15} className="text-[#FF4500]" /> My Account
                        </Button>
                      </Link>
                      <Link href="/admin">
                        <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl shadow-md shadow-orange-200 transition-all hover:scale-105 flex items-center gap-1.5 px-3">
                          <ShieldCheck size={16} /> Admin
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/requests">
                        <Button variant="outline" className="border-orange-200 text-[#FF4500] hover:bg-orange-50 font-bold rounded-xl px-3">
                          My Requests
                        </Button>
                      </Link>
                      <Link href="/account">
                        <Button className="bg-gray-900 hover:bg-black text-white font-bold rounded-xl px-3">
                          Account
                        </Button>
                      </Link>
                    </>
                  )}
                  <NavLogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="font-bold text-gray-700 hover:text-[#FF4500] px-3">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl shadow-md shadow-orange-200 transition-all hover:scale-105 px-3">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation (Sliding Top to Bottom) */}
          <div className="flex lg:hidden items-center gap-2">
            <NotificationBell />
            <CartDrawer />
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", className: "px-2 text-gray-800" })}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="top" className="w-full max-h-[90vh] overflow-y-auto bg-white border-b border-gray-200 shadow-2xl rounded-b-3xl p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <Image src="/logo.png" alt="Sandy Digital Hub" width={160} height={45} className="h-10 w-auto object-contain" />
                </div>
                <nav className="grid grid-cols-2 gap-2 text-sm font-bold">
                  {routes.map((route) => {
                    const RouteIcon = route.icon;
                    return (
                      <Link
                        key={route.path}
                        href={route.path}
                        target={route.target || "_self"}
                        rel={route.target === "_blank" ? "noreferrer" : undefined}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-gray-800 hover:text-[#FF4500] bg-gray-50 hover:bg-orange-50 rounded-xl transition-all border border-gray-100 shadow-sm"
                      >
                        <RouteIcon size={16} className="text-[#FF4500]" />
                        <span>{route.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-2.5 mt-6 border-t border-gray-100 pt-4">
                  {session ? (
                    <>
                      {session.user?.role === 'ADMIN' || session.user?.role === 'admin' ? (
                        <>
                          <Link href="/admin">
                            <Button className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
                              <ShieldCheck size={16} /> Admin Dashboard
                            </Button>
                          </Link>
                          <Link href="/account">
                            <Button variant="outline" className="w-full border-gray-300 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-2">
                              <User size={16} className="text-[#FF4500]" /> My Account
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/requests">
                            <Button variant="outline" className="w-full border-orange-200 text-[#FF4500] font-bold rounded-xl">
                              My Requests
                            </Button>
                          </Link>
                          <Link href="/account">
                            <Button className="w-full bg-gray-900 text-white font-bold rounded-xl">
                              My Account
                            </Button>
                          </Link>
                        </>
                      )}
                      <NavLogoutButton className="w-full mt-1" />
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" className="w-full border-gray-300 font-bold rounded-xl">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl shadow-md">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
