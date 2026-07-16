/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NavLogoutButton } from "@/components/layout/NavLogoutButton";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  
  const routes = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "https://sandycoder.vercel.app/portfolio" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Sandy Digital Hub" width={200} height={60} className="h-16 w-auto object-contain" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className="transition-colors hover:text-primary"
              >
                {route.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-4">
              <CartDrawer />
              {session ? (
                <>
                  {session.user?.role === 'ADMIN' || session.user?.role === 'admin' ? (
                    <Link href="/admin">
                      <Button variant="destructive">Admin Dashboard</Button>
                    </Link>
                  ) : (
                    <Link href="/profile">
                      <Button>Profile</Button>
                    </Link>
                  )}
                  <NavLogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <CartDrawer />
            <Sheet>
              <SheetTrigger className={buttonVariants({ variant: "ghost", className: "px-2" })}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="block px-2 py-1 text-lg font-medium hover:text-primary transition-colors"
                    >
                      {route.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                    {session ? (
                      <>
                        {session.user?.role === 'ADMIN' || session.user?.role === 'admin' ? (
                          <Link href="/admin">
                            <Button variant="destructive" className="w-full">Admin Dashboard</Button>
                          </Link>
                        ) : (
                          <Link href="/profile">
                            <Button className="w-full">Profile</Button>
                          </Link>
                        )}
                        <NavLogoutButton className="w-full mt-2" />
                      </>
                    ) : (
                      <>
                        <Link href="/login">
                          <Button variant="outline" className="w-full">Login</Button>
                        </Link>
                        <Link href="/signup">
                          <Button className="w-full">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
