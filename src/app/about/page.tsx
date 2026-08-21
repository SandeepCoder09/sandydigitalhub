/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */
import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Target, Lightbulb, MapPin } from "lucide-react";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "About Us | Sandy Digital Hub",
  description: "Learn about our mission, vision, and the team behind Sandy Digital Hub.",
};

const timeline = [
  {
    year: "2020",
    title: "The Beginning",
    description: "Started as a small freelance web development group serving local clients in Fatehpur."
  },
  {
    year: "2021",
    title: "Expanding Services",
    description: "Added Digital Services like PAN card applications and online form filling to help the community."
  },
  {
    year: "2022",
    title: "Mobile Apps & Marketing",
    description: "Launched mobile app development and digital marketing services for businesses."
  },
  {
    year: "2024",
    title: "Sandy Digital Hub",
    description: "Officially registered as Sandy Digital Hub, the premier one-stop digital solution center."
  }
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-muted py-8 sm:py-20">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 text-center max-w-3xl space-y-2 sm:space-y-4">
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">About Sandy Digital Hub</h1>
          <p className="text-xs sm:text-xl text-muted-foreground">
            We are passionate about bringing world-class digital solutions to local businesses and global clients alike.
          </p>
        </div>
      </div>

      <div className="py-8 sm:py-24 container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-16 items-center mb-10 sm:mb-24">
          <div>
            <h2 className="text-xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-6">Our Story</h2>
            <p className="text-xs sm:text-lg text-muted-foreground mb-3 sm:mb-6 leading-relaxed">
              Sandy Digital Hub was founded with a simple vision: to make technology accessible, affordable, and effective for everyone. From small shop owners looking to sell online to students needing help with government forms, we saw a gap in reliable digital assistance.
            </p>
            <p className="text-xs sm:text-lg text-muted-foreground leading-relaxed">
              Today, we have evolved into a full-service technology agency offering enterprise-level Web Development, Mobile Apps, and comprehensive Digital Marketing, while still staying true to our roots by providing essential digital services to our local community.
            </p>
          </div>
          <div className="relative aspect-video sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl border">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
              alt="Team at work"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-12 mb-10 sm:mb-24">
          <div className="bg-card p-4 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xs sm:shadow-sm">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-6">
              <Target className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-2xl font-bold mb-2 sm:mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-xs sm:text-lg leading-relaxed">
              To empower businesses and individuals by providing innovative, high-quality, and affordable digital solutions that drive real results.
            </p>
          </div>
          <div className="bg-card p-4 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xs sm:shadow-sm">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 sm:mb-6">
              <Lightbulb className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-base sm:text-2xl font-bold mb-2 sm:mb-4">Our Vision</h3>
            <p className="text-muted-foreground text-xs sm:text-lg leading-relaxed">
              To become the most trusted and preferred digital partner, known for our technical excellence, customer-centric approach, and community impact.
            </p>
          </div>
        </div>

        <div className="mb-10 sm:mb-24">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16 space-y-1.5 sm:space-y-4">
            <h2 className="text-xl sm:text-4xl font-bold tracking-tight">Our Journey</h2>
            <p className="text-xs sm:text-lg text-muted-foreground">
              How we grew from a small idea into a complete digital solution center.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-3 sm:gap-10 mb-4 sm:mb-10 last:mb-0 relative">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 z-10 text-xs sm:text-base">
                    {index + 1}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-0.5 bg-border h-full absolute top-8 sm:top-12 bottom-[-20px] sm:bottom-[-40px]"></div>
                  )}
                </div>
                <div className="pb-3 sm:pb-8">
                  <div className="text-xs sm:text-sm font-bold text-primary mb-0.5 sm:mb-1">{item.year}</div>
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary text-secondary-foreground rounded-2xl sm:rounded-3xl p-5 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4 text-white">Visit Our Location</h2>
            <p className="text-xs sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              We are deeply rooted in our local community. Feel free to visit us during business hours for in-person consultations or digital services.
            </p>
            <div className="flex items-start gap-3 sm:gap-4">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm sm:text-xl text-white mb-0.5 sm:mb-1">Sandy Digital Hub</div>
                <div className="text-muted-foreground text-xs sm:text-base">Bairi, Khakhreru, Fatehpur,<br />Uttar Pradesh, India  - 212656</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="w-full md:w-80 aspect-video md:aspect-square rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative shadow-lg">
              <Image
                src="/about-map.png"
                alt="Location Map"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      <ContactCTA />
    </>
  );
}
