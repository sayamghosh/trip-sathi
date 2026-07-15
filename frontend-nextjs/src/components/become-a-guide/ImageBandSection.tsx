import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import guideWithTravelersImg from "../../assets/landing-page/kashmir.jpg";
import destinationSceneryImg from "../../assets/landing-page/munnar.jpg";
import localExperienceImg from "../../assets/landing-page/rajasthan.jpg";

const BAND = [
  { label: "Guide with travelers", image: guideWithTravelersImg, delay: 0 },
  { label: "Destination scenery", image: destinationSceneryImg, delay: 100 },
  { label: "Local experience", image: localExperienceImg, delay: 200 },
];

export default function ImageBandSection() {
  return (
    <section className="px-12 pb-[100px] max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr_1fr] gap-4 sm:h-[320px]">
        {BAND.map((item) => (
          <RevealOnScroll key={item.label} delayMs={item.delay} className="block h-[320px] sm:h-full">
            <div className="relative border border-[rgba(18,18,18,0.12)] rounded-lg overflow-hidden h-full">
              <Image src={item.image} alt={item.label} fill className="object-cover" />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
