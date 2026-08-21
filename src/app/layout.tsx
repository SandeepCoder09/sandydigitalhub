import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { PageGuard } from "@/components/layout/PageGuard";
import { VisitorTracker } from "@/components/layout/VisitorTracker";
import { SuzuBusinessWidget } from "@/components/layout/SuzuBusinessWidget";
import { CookieConsentPopup } from "@/components/layout/CookieConsentPopup";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";

import { LanguageProvider } from "@/context/LanguageContext";
import { SidebarProvider } from "@/context/SidebarContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Sandy Digital Hub | Your One-Stop Digital Solution Center",
  description: "Sandy Digital Hub provides premium Website Development, Mobile Apps, UI/UX Design, and Digital Services in Fatehpur and beyond.",
  keywords: "Sandy Digital Hub, Website Development in Fatehpur, App Development in Fatehpur, Digital Services Near Me, Online Services Fatehpur, SEO, Web Design",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Sandy Digital Hub | Your One-Stop Digital Solution Center",
    description: "Premium Website Development, Mobile Apps, and Digital Services.",
    url: "https://sandydigitalhub.com",
    siteName: "Sandy Digital Hub",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <SidebarProvider>
              <ToastProvider>
                <VisitorTracker />
                <AnnouncementBanner />
                <PageGuard navbar={<Navbar />} footer={<Footer />} liveChat={<SuzuBusinessWidget />}>
                  {children}
                </PageGuard>
                <CookieConsentPopup />
              </ToastProvider>
            </SidebarProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
