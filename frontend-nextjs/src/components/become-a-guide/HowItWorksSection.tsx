import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  { n: "01", title: "Create your profile", desc: "Sign up free and tell travelers who you are and where you guide." },
  { n: "02", title: "List your tours", desc: "Add your packages, set your own prices and availability." },
  { n: "03", title: "Get discovered", desc: "Travelers find you directly through search and recommendations." },
  { n: "04", title: "Chat & get paid", desc: "Talk to travelers directly and get paid without any middleman." },
];

export default function HowItWorksSection() {
  return (
    <section id="how" className="pt-20 px-12 pb-[100px] max-w-[1280px] mx-auto border-t border-[rgba(18,18,18,0.12)]">
      <RevealOnScroll className="block mb-14">
        <div className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#6E6A5C] mb-3.5">
          How it works
        </div>
        <h2 className="text-[clamp(30px,3.4vw,46px)] font-semibold tracking-[-0.02em] m-0">
          From sign-up to your first booking
        </h2>
      </RevealOnScroll>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <RevealOnScroll key={step.n} className="block" delayMs={i * 100}>
            <div className="border-l border-[rgba(18,18,18,0.12)] pr-7 pl-6">
              <div className="font-mono text-[32px] font-semibold text-[#E2531B] mb-5">{step.n}</div>
              <h3 className="text-[17.5px] font-semibold mb-2.5">{step.title}</h3>
              <p className="text-sm leading-[1.65] text-[#4A4636] m-0">{step.desc}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
