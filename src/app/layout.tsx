import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { PageGuard } from "@/components/layout/PageGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sandy Digital Hub | Your One-Stop Digital Solution Center",
  description: "Sandy Digital Hub provides premium Website Development, Mobile Apps, UI/UX Design, and Digital Services in Fatehpur and beyond.",
  keywords: "Sandy Digital Hub, Website Development in Fatehpur, App Development in Fatehpur, Digital Services Near Me, Online Services Fatehpur, SEO, Web Design",
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
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <PageGuard>
              {children}
            </PageGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
