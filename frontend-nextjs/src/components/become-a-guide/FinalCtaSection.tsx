import RevealOnScroll from "./RevealOnScroll";
import GuideCtaButton from "./GuideCtaButton";

export default function FinalCtaSection({ ctaUrl }: { ctaUrl: string }) {
  return (
    <section className="bg-[#121212] py-[120px] px-12">
      <RevealOnScroll className="block max-w-[1000px] mx-auto text-left">
        <div className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#8A8574] mb-5">
          Get started
        </div>
        <h2 className="text-[clamp(34px,4.6vw,58px)] font-semibold tracking-[-0.02em] text-[#FBF9F4] mb-8 max-w-[640px]">
          Your tours. Your price.{" "}
          <i style={{ fontFamily: "var(--font-guide-instrument-serif)", fontStyle: "italic", fontWeight: 400, color: "#E2531B" }}>
            Your travelers.
          </i>
        </h2>
        <div className="flex items-center gap-6 flex-wrap">
          <GuideCtaButton href={ctaUrl} variant="final">Join for free →</GuideCtaButton>
          <span className="text-[13.5px] text-[#8A8574]">Takes under 5 minutes · No credit card required</span>
        </div>
      </RevealOnScroll>
    </section>
  );
}
