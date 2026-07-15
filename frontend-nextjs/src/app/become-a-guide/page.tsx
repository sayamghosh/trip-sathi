import GuideNav from "../../components/become-a-guide/GuideNav";
import HeroSection from "../../components/become-a-guide/HeroSection";
import StatementSection from "../../components/become-a-guide/StatementSection";
import FeaturesSection from "../../components/become-a-guide/FeaturesSection";
import HowItWorksSection from "../../components/become-a-guide/HowItWorksSection";
import StoriesSection from "../../components/become-a-guide/StoriesSection";
import ImageBandSection from "../../components/become-a-guide/ImageBandSection";
import FaqSection from "../../components/become-a-guide/FaqSection";
import FinalCtaSection from "../../components/become-a-guide/FinalCtaSection";

const CTA_URL = process.env.NEXT_PUBLIC_ADMIN_APP_URL || "https://admin.joytrips.site";

export default function BecomeAGuidePage() {
  return (
    <div
      className="text-[#121212] bg-[#FBF9F4] overflow-x-clip"
      style={{ fontFamily: "var(--font-guide-space-grotesk), sans-serif" }}
    >
      <GuideNav ctaUrl={CTA_URL} />
      <HeroSection ctaUrl={CTA_URL} />
      <StatementSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StoriesSection />
      <ImageBandSection />
      <FaqSection />
      <FinalCtaSection ctaUrl={CTA_URL} />
    </div>
  );
}
