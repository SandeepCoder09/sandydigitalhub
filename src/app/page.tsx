import { BrandGatewayHero } from "@/components/home/BrandGatewayHero";
import { HeroSection } from "@/components/home/HeroSection";
import { LocalTrustStrip } from "@/components/home/LocalTrustStrip";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { HomeQuickActions } from "@/components/home/HomeQuickActions";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Statistics } from "@/components/home/Statistics";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { ServiceDisclaimerSection } from "@/components/home/ServiceDisclaimerSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      {/* 1. Futuristic digital ecosystem hero */}
      <HeroSection />

      {/* 2. Dual-platform ecosystem gateway */}
      <BrandGatewayHero />

      {/* 3. Local Trust & Operational Transparency Strip */}
      <LocalTrustStrip />

      {/* 4. Popular Facilitation Services */}
      <ServicesOverview />

      {/* 5. Tracking and quick customer actions */}
      <HomeQuickActions />

      {/* 6. 5-Step How Our Service Works Workflow */}
      <WhyChooseUs />

      {/* 7. Genuine Value Pillars */}
      <Statistics />

      {/* 8. Real Customer Verified Feedback */}
      <CustomerReviews />

      {/* 9. Important Legal & Service Disclaimer */}
      <ServiceDisclaimerSection />

      {/* 10. Direct Contact & WhatsApp CTA */}
      <ContactCTA />
    </>
  );
}
