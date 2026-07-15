"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const FAQS = [
  {
    q: "Is it really free to join?",
    a: "Yes. Creating a profile and listing your tours costs nothing today, and we take no commission on your bookings.",
  },
  {
    q: "Will you ever charge commission?",
    a: "No. Our long-term model is a simple subscription, not a per-booking cut — you'll never see a surprise percentage taken from your earnings.",
  },
  {
    q: "How do I get paid?",
    a: "Travelers pay you directly. joytrips is a discovery and chat platform — we connect you, we never sit between you and your money.",
  },
  {
    q: "Who can sign up as an agent?",
    a: "Any local travel agent or independent guide with tours or packages to offer travelers can apply.",
  },
  {
    q: "How are travelers verified?",
    a: "Every traveler completes identity verification before they can message or book a guide, so you always know who you're meeting.",
  },
  {
    q: "Where do I manage my profile after joining?",
    a: "Once approved, you manage everything — tours, calendar, chats, pricing — from your agent portal.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="px-12 pb-[100px] max-w-[820px] mx-auto border-t border-[rgba(18,18,18,0.12)]">
      <RevealOnScroll className="block mt-6 mb-10">
        <div className="text-[12.5px] font-semibold tracking-[0.08em] uppercase text-[#6E6A5C] mb-3.5">
          FAQ
        </div>
        <h2 className="text-[clamp(28px,3.2vw,38px)] font-semibold tracking-[-0.02em] m-0">
          Good questions, straight answers
        </h2>
      </RevealOnScroll>

      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <RevealOnScroll key={faq.q} className="block">
            <div className="border-t border-[rgba(18,18,18,0.12)]">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between py-[22px] cursor-pointer text-left bg-transparent border-0"
              >
                <span className="text-base font-semibold">{faq.q}</span>
                <span
                  className="font-mono text-xl text-[#E2531B] inline-block transition-transform duration-300 ease-out"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <div className="pb-6 text-[14.5px] leading-[1.7] text-[#4A4636] max-w-[640px]">
                  {faq.a}
                </div>
              )}
            </div>
          </RevealOnScroll>
        );
      })}
    </section>
  );
}
