import GuideCtaButton from "./GuideCtaButton";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#stories", label: "Stories" },
  { href: "#faq", label: "FAQ" },
];

export default function GuideNav({ ctaUrl }: { ctaUrl: string }) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-5 bg-[rgba(251,249,244,0.9)] backdrop-blur-sm border-b border-[rgba(18,18,18,0.1)]">
      <div className="flex items-center gap-2.5">
        <div className="w-3 h-3 bg-[#E2531B]" />
        <span className="font-semibold text-lg tracking-[-0.01em]">joytrips</span>
      </div>
      <div className="hidden md:flex items-center gap-[34px]">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="guide-nav-link no-underline text-[13px] font-medium tracking-[0.04em] uppercase text-[#121212]"
          >
            {link.label}
          </a>
        ))}
      </div>
      <GuideCtaButton href={ctaUrl} variant="nav">Join for free</GuideCtaButton>
    </nav>
  );
}
