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
      <div className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">About Sandy Digital Hub</h1>
          <p className="text-xl text-muted-foreground">
            We are passionate about bringing world-class digital solutions to local businesses and global clients alike.
          </p>
        </div>
      </div>

      <div className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Sandy Digital Hub was founded with a simple vision: to make technology accessible, affordable, and effective for everyone. From small shop owners looking to sell online to students needing help with government forms, we saw a gap in reliable digital assistance.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we have evolved into a full-service technology agency offering enterprise-level Web Development, Mobile Apps, and comprehensive Digital Marketing, while still staying true to our roots by providing essential digital services to our local community.
            </p>
          </div>
          <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl border">
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
              alt="Team at work"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-card p-10 rounded-3xl border shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-muted-foreground text-lg">
              To empower businesses and individuals by providing innovative, high-quality, and affordable digital solutions that drive real results.
            </p>
          </div>
          <div className="bg-card p-10 rounded-3xl border shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-muted-foreground text-lg">
              To become the most trusted and preferred digital partner, known for our technical excellence, customer-centric approach, and community impact.
            </p>
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              How we grew from a small idea into a complete digital solution center.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 md:gap-10 mb-10 last:mb-0 relative">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 z-10">
                    {index + 1}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-0.5 bg-border h-full absolute top-12 bottom-[-40px]"></div>
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-sm font-bold text-primary mb-1">{item.year}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary text-secondary-foreground rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-white">Visit Our Location</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We are deeply rooted in our local community. Feel free to visit us during business hours for in-person consultations or digital services.
            </p>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-xl text-white mb-1">Sandy Digital Hub</div>
                <div className="text-muted-foreground">Bairi, Khakhreru, Fatehpur,<br />Uttar Pradesh, India</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
             {/* Map Placeholder */}
             <div className="w-full md:w-80 aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                  <span className="text-sm text-muted-foreground">Google Maps Location</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <ContactCTA />
    </>
  );
}
