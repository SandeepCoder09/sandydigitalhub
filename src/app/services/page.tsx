import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Smartphone, FileDigit, Megaphone, CheckCircle2 } from "lucide-react";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "Our Services | Sandy Digital Hub",
  description: "Explore our premium digital services including website development, mobile apps, PAN card services, and digital marketing.",
};

const serviceCategories = [
  {
    id: "web-development",
    title: "Website Development",
    description: "We build fast, secure, and modern websites tailored to your business needs.",
    icon: Code,
    services: [
      "Business Websites",
      "Portfolio Websites",
      "E-commerce Websites",
      "Landing Pages",
      "Custom Web Applications"
    ]
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    description: "Custom Android and iOS applications designed for performance and great user experience.",
    icon: Smartphone,
    services: [
      "Android Apps",
      "Business Apps",
      "Community Apps",
      "Utility Apps"
    ]
  },
  {
    id: "digital-services",
    title: "Digital Services",
    description: "Reliable and fast digital assistance for individuals and businesses.",
    icon: FileDigit,
    services: [
      "PAN Card (New & Correction)",
      "Online Applications",
      "Government Forms Filling",
      "Exam Registrations",
      "Resume & Cover Letter Building"
    ]
  },
  {
    id: "marketing",
    title: "Digital Marketing & Branding",
    description: "Grow your online presence and reach more customers with our marketing solutions.",
    icon: Megaphone,
    services: [
      "Search Engine Optimization (SEO)",
      "Social Media Management",
      "Business Branding (Logos & Banners)",
      "Digital Advertising"
    ]
  }
];

export default function ServicesPage() {
  return (
    <>
      <div className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive digital solutions to elevate your brand, streamline your operations, and reach your target audience.
          </p>
        </div>
      </div>

      <div className="py-24 container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {serviceCategories.map((category, index) => (
          <div 
            key={category.id} 
            id={category.id} 
            className={`flex flex-col md:flex-row gap-12 items-center scroll-mt-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="w-full md:w-1/2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <category.icon className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{category.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{category.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.services.map((service) => (
                  <div key={service} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="aspect-video bg-muted rounded-2xl border flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-secondary/10 to-primary/5 flex items-center justify-center">
                   <category.icon className="w-32 h-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ContactCTA />
    </>
  );
}
