import RevealOnScroll from "./RevealOnScroll";
import ImagePlaceholder from "./ImagePlaceholder";

const BAND = [
  { label: "Guide with travelers", delay: 0 },
  { label: "Destination scenery", delay: 100 },
  { label: "Local experience", delay: 200 },
];

export default function ImageBandSection() {
  return (
    <section className="px-12 pb-[100px] max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-4 sm:h-[320px]">
        {BAND.map((item) => (
          <RevealOnScroll key={item.label} delayMs={item.delay} className="block h-[320px] sm:h-full">
            <div className="border border-[rgba(18,18,18,0.12)] rounded-lg overflow-hidden h-full">
              <ImagePlaceholder label={item.label} />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
