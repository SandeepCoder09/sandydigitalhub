import { Metadata } from 'next';
import { StudioHero } from '@/components/studio/StudioHero';
import { StudioServices } from '@/components/studio/StudioServices';
import { StudioFeaturedWork } from '@/components/studio/StudioFeaturedWork';
import { StudioProcess } from '@/components/studio/StudioProcess';
import { StudioPricing } from '@/components/studio/StudioPricing';
import { StudioEnquiryForm } from '@/components/studio/StudioEnquiryForm';

export const metadata: Metadata = {
  title: 'Sara Digital Studio · Modern Websites, Web Apps & Technology Solutions',
  description: 'Sara Digital Studio designs and builds modern websites, web applications, mobile platforms, and custom software for businesses and creators.',
};

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* 1. Studio Hero */}
      <StudioHero />

      {/* 2. Engineering & Design Services */}
      <StudioServices />

      {/* 3. Featured Portfolio & Work */}
      <StudioFeaturedWork />

      {/* 4. 6-Step Build Process */}
      <StudioProcess />

      {/* 5. Starting Investment Packages */}
      <StudioPricing />

      {/* 6. Interactive Scope & Quote Questionnaire */}
      <StudioEnquiryForm />
    </main>
  );
}
