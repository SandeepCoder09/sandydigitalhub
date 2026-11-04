import { BrandGatewayHero } from "@/components/home/BrandGatewayHero";
import { HeroSection } from "@/components/home/HeroSection";
import { LocalTrustStrip } from "@/components/home/LocalTrustStrip";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Statistics } from "@/components/home/Statistics";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { ServiceDisclaimerSection } from "@/components/home/ServiceDisclaimerSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      {/* 1. Brand Ecosystem Gateway Card Switcher */}
      <BrandGatewayHero />

      {/* 2. SANDY DIGITAL HUB Hero */}
      <HeroSection />

      {/* 3. Local Trust & Operational Transparency Strip */}
      <LocalTrustStrip />

      {/* 4. Popular Facilitation Services */}
      <ServicesOverview />

      {/* 5. 5-Step How Our Service Works Workflow */}
      <WhyChooseUs />

      {/* 6. Genuine Value Pillars */}
      <Statistics />

      {/* 7. Real Customer Verified Feedback */}
      <CustomerReviews />

      {/* 8. Important Legal & Service Disclaimer */}
      <ServiceDisclaimerSection />

      {/* 9. Direct Contact & WhatsApp CTA */}
      <ContactCTA />
    </>
  );
}
