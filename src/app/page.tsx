import { HeroSection } from "@/components/home/HeroSection";
import { RecentRequestsBanner } from "@/components/home/RecentRequestsBanner";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Statistics } from "@/components/home/Statistics";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <RecentRequestsBanner />
      <ServicesOverview />
      <WhyChooseUs />
      <Statistics />
      <PortfolioPreview />
      <CustomerReviews />
      <ContactCTA />
    </>
  );
}
