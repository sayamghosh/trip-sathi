"use client";

import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const navItems = ["Home", "Explore", "Reviews", "About", "Blog", "Contact"];

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

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="#1a1a2e" strokeWidth="2" />
      <path
        d="M20 20L16.65 16.65"
        stroke="#1a1a2e"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const Navbar = () => {
  return (
    <nav
      className={`${inter.className} sticky top-0 z-[100] h-[72px] w-full border-b border-[#f0f0f0] bg-[#ffffff]`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1240px] items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center gap-[10px] no-underline">
          <span
            className="inline-flex h-10 w-10 items-center justify-center bg-[#1d6ff2]"
            style={{
              clipPath:
                "polygon(50% 0%, 88% 20%, 88% 73%, 50% 100%, 12% 73%, 12% 20%)",
            }}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
              <PaperPlaneIcon className="h-[15px] w-[15px]" />
            </span>
          </span>
          <span className="inline-flex text-[22px] font-bold leading-none">
            <span className="text-[#1a1a2e]">Trip</span>
            <span className="text-[#1d6ff2]">Sathi</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="text-base font-medium text-[#1a1a2e] no-underline"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            aria-label="Search"
            className="cursor-pointer border-0 bg-transparent p-0"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-[15px] font-medium text-[#1a1a2e]"
          >
            Log In
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-[9999px] border-0 bg-[#1d6ff2] px-6 py-[10px] text-[15px] font-semibold text-white"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
