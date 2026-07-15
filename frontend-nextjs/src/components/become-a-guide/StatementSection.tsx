import RevealOnScroll from "./RevealOnScroll";

export default function StatementSection() {
  return (
    <section className="py-[120px] px-12 max-w-[1000px] mx-auto">
      <RevealOnScroll>
        <p className="text-[clamp(24px,2.6vw,34px)] leading-[1.45] tracking-[-0.01em] m-0">
          <span className="text-[#B7B2A0]">
            Most travel platforms take a cut of every booking, hide you behind their brand, and treat your business like their inventory.
          </span>
          <span className="text-[#121212] font-semibold">
            {" "}joytrips is built the other way — we're a discovery layer, not a middleman. Travelers find you, talk to you, and pay you directly.
          </span>
        </p>
      </RevealOnScroll>
    </section>
  );
}
