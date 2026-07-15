import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const TESTIMONIALS = [
  {
    quote: "I stopped losing 20% of every booking to a middleman. Now travelers message me directly and pay me directly.",
    name: "Amara O.",
    role: "Guide, Lagos",
    photo: "https://images.pexels.com/photos/15393590/pexels-photo-15393590.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop",
  },
  {
    quote: "Setting my own prices and schedule finally made this feel like my business, not someone else's platform.",
    name: "Marco D.",
    role: "Guide, Lisbon",
    photo: "https://images.pexels.com/photos/1481454/pexels-photo-1481454.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop",
  },
  {
    quote: "The verified traveler system means I know exactly who I'm meeting before they even arrive.",
    name: "Suchada P.",
    role: "Guide, Chiang Mai",
    photo: "https://images.pexels.com/photos/15485740/pexels-photo-15485740.jpeg?auto=compress&cs=tinysrgb&w=128&h=128&fit=crop",
  },
];

export default function StoriesSection() {
  return (
    <section id="stories" className="px-12 pb-[100px] max-w-[1000px] mx-auto">
      <RevealOnScroll className="block border-t border-[rgba(18,18,18,0.12)] pt-6 mb-3.5">
        <div className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#6E6A5C]">
          Guide stories
        </div>
      </RevealOnScroll>
      {TESTIMONIALS.map((t) => (
        <RevealOnScroll key={t.name} className="block">
          <div className="guide-testimonial-row grid grid-cols-[64px_1fr_auto] gap-7 items-center border-t border-[rgba(18,18,18,0.12)] py-9 px-6 -mx-6">
            <div className="relative w-16 h-16 rounded shrink-0 overflow-hidden">
              <Image src={t.photo} alt={t.name} fill className="object-cover" />
            </div>
            <p
              className="text-[22px] leading-[1.5] m-0 text-[#121212]"
              style={{ fontFamily: "var(--font-guide-instrument-serif)", fontStyle: "italic" }}
            >
              &quot;{t.quote}&quot;
            </p>
            <div className="text-right whitespace-nowrap">
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-[12.5px] text-[#6E6A5C] font-mono uppercase">{t.role}</div>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </section>
  );
}
