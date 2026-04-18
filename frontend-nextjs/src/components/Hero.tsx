"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M21.5 3.5L10.5 14.5"
        stroke="#1d6ff2"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 3.5L14 21L10.5 14.5L4 11L21.5 3.5Z"
        stroke="#1d6ff2"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Hero = () => {
  return (
    <section
      className={`${inter.className} mt-2 min-h-[680px] rounded-2xl bg-[#d1d5db] bg-cover bg-center text-center`}
      style={{
        marginLeft: "16px",
        marginRight: "16px",
        backgroundImage: "url('/hero-bg.avif')",
      }}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 pb-14 pt-[120px]">
        <h1 className="mx-auto max-w-[800px] text-[58px] font-extrabold leading-[1.2] text-white">
          Discover the Unforgettable
          <br />
          Beauty of India
        </h1>

        <p className="mx-auto mt-5 max-w-[640px] text-base font-normal leading-[1.7] text-[rgba(255,255,255,0.85)]">
          Embark on a journey through Indonesia&apos;s breathtaking landscapes,
          vibrant cultures, and hidden gems. From pristine beaches to rich
          traditions let us be your ultimate travel companion for an authentic
          and memorable adventure.
        </p>

        <div className="mt-20 w-full max-w-[860px] rounded-2xl bg-white px-7 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
          <p className="mb-[10px] text-left text-[15px] font-semibold text-[#1a1a2e]">
            Destination
          </p>
          <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
            <div className="relative flex-1">
              <PaperPlaneIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full rounded-[9999px] border border-[#e5e7eb] px-[18px] py-3 pl-11 text-[15px] text-[#9ca3af] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
            <button
              type="button"
              className="rounded-[9999px] border-0 bg-[#1d6ff2] px-10 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1558c0]"
            >
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
