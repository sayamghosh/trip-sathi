import RevealOnScroll from "./RevealOnScroll";
import ImagePlaceholder from "./ImagePlaceholder";

const FEATURES = [
  {
    title: "Zero fees, zero commission",
    desc: "List and sell without giving up a cut of your earnings.",
    points: ["No listing fees, ever", "No commission per booking", "No per-transaction charges"],
    image: "Earnings screen",
  },
  {
    title: "Direct traveler relationships",
    desc: "We're a discovery platform — the relationship, and the payment, is yours.",
    points: ["Direct contact with travelers", "Clients pay you directly", "Built-in direct chat"],
    image: "Chat with a traveler",
  },
  {
    title: "Full control of your business",
    desc: "Run it your way — your prices, your schedule, your offerings.",
    points: ["Set your own tour prices", "Flexible scheduling", "Multiple tour & package types"],
    image: "Calendar & pricing screen",
  },
  {
    title: "Global reach & reputation",
    desc: "Get discovered by travelers everywhere and build a brand that lasts.",
    points: ["Access to a global traveler audience", "Ratings & reviews system", "Priority placement for top-rated guides"],
    image: "Guide profile & reviews",
  },
  {
    title: "Safety you can trust",
    desc: "Every traveler on the platform is verified before they can book.",
    points: ["Verified traveler safety", "Easy booking & calendar management", "No middleman markup"],
    image: "Verification screen",
  },
  {
    title: "No surprises, ever",
    desc: "Free today, and we'll stay that way — future pricing is subscription-only.",
    points: ["Future subscription-only model", "No surprise cuts", "Keep 100% of what you earn"],
    image: "Billing screen",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-12 pb-[60px] max-w-[1280px] mx-auto">
      <RevealOnScroll className="block border-t border-[rgba(18,18,18,0.12)] pt-6 mb-16">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#6E6A5C] mb-3.5">
              Features
            </div>
            <h2 className="text-[clamp(30px,3.4vw,46px)] font-semibold tracking-[-0.02em] m-0 max-w-[560px]">
              Built to put more in your pocket
            </h2>
          </div>
          <span className="font-mono text-[13px] text-[#6E6A5C]">01 — 06</span>
        </div>
      </RevealOnScroll>

      {FEATURES.map((card, i) => {
        const num = String(i + 1).padStart(2, "0");
        const imageFirst = i % 2 !== 0;
        return (
          <div key={card.title} className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center border-t border-[rgba(18,18,18,0.12)] py-14">
            <RevealOnScroll direction={imageFirst ? "right" : "left"} className={imageFirst ? "md:order-2" : "md:order-1"}>
              <div className="font-mono text-[13px] text-[#E2531B] mb-4">{num}</div>
              <h3 className="text-[26px] font-semibold tracking-[-0.01em] mb-3.5">{card.title}</h3>
              <p className="text-[15px] leading-[1.65] text-[#4A4636] mb-4.5 max-w-[420px]">{card.desc}</p>
              <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
                {card.points.map((point) => (
                  <li key={point} className="guide-bullet text-sm text-[#121212] flex items-start gap-2.5">
                    <span className="text-[#E2531B]">/</span>{point}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
            <RevealOnScroll
              direction={imageFirst ? "left" : "right"}
              delayMs={100}
              className={imageFirst ? "md:order-1" : "md:order-2"}
            >
              <div className="guide-feature-image border border-[rgba(18,18,18,0.12)] rounded-[10px] overflow-hidden h-[340px] bg-white">
                <ImagePlaceholder label={card.image} />
              </div>
            </RevealOnScroll>
          </div>
        );
      })}
    </section>
  );
}
