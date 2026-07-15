import GuideCtaButton from "./GuideCtaButton";
import DashboardMockup from "./DashboardMockup";

const WORDS = [
  { text: "Sell", delay: 0.02 },
  { text: "direct.", delay: 0.09 },
  { text: "Keep", delay: 0.16 },
];

export default function HeroSection({ ctaUrl }: { ctaUrl: string }) {
  return (
    <section className="pt-[88px] px-12 pb-0 max-w-[1280px] mx-auto">
      <div className="flex items-center gap-2.5 mb-7 animate-guide-fade-up">
        <span className="w-[7px] h-[7px] bg-[#E2531B] rounded-full animate-guide-blink" />
        <span className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#6E6A5C]">
          Now onboarding local guides &amp; agents
        </span>
      </div>

      <h1 className="text-[clamp(42px,5.6vw,84px)] leading-[0.98] font-semibold tracking-[-0.03em] mb-7 max-w-[920px]">
        {WORDS.map((w) => (
          <span
            key={w.text}
            className="inline-block animate-guide-word-up mr-3"
            style={{ animationDelay: `${w.delay}s` }}
          >
            {w.text}
          </span>
        ))}
        <i
          className="guide-word-hover animate-guide-word-up inline-block mr-3"
          style={{
            fontFamily: "var(--font-guide-instrument-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            color: "#E2531B",
            animationDelay: "0.23s",
          }}
        >
          every rupee
        </i>
        <span className="inline-block animate-guide-word-up mr-3" style={{ animationDelay: "0.3s" }}>
          you
        </span>
        <span className="inline-block animate-guide-word-up" style={{ animationDelay: "0.37s" }}>
          earn.
        </span>
      </h1>

      <div className="flex justify-between items-end gap-10 flex-wrap mb-14 animate-guide-fade-up [animation-duration:0.8s] [animation-delay:0.1s]">
        <p className="text-lg leading-[1.6] text-[#4A4636] max-w-[460px] m-0" style={{ textWrap: "pretty" }}>
          joytrips puts local travel agents and guides in front of travelers directly — no listing fees, no commission, no middleman standing between you and your business.
        </p>
        <div className="flex items-center gap-6 flex-wrap">
          <GuideCtaButton href={ctaUrl} variant="hero">Join for free →</GuideCtaButton>
          <a href="#how" className="no-underline text-[14.5px] font-semibold border-b border-[#121212] pb-0.5 whitespace-nowrap text-[#121212]">
            See how it works
          </a>
        </div>
      </div>

      <DashboardMockup />
      <div className="font-mono text-[12.5px] text-[#6E6A5C] mt-3.5">
        Your agent dashboard — tours, bookings &amp; payouts, all in one place.
      </div>
    </section>
  );
}
