const VARIANTS = {
  nav: "guide-cta-dark guide-cta-nav px-[22px] py-[11px] text-[13.5px] rounded",
  hero: "guide-cta-dark guide-cta-hero px-[30px] py-4 text-[15px] rounded",
  final: "guide-cta-paper guide-cta-hero px-[30px] py-4 text-[15px] rounded",
} as const;

export default function GuideCtaButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: keyof typeof VARIANTS;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block no-underline font-semibold whitespace-nowrap ${VARIANTS[variant]}`}
    >
      {children}
    </a>
  );
}
