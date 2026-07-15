"use client";

import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";
const DURATION_MS = 900;

type Direction = "up" | "left" | "right";

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  up: "translateY(40px) scale(0.97)",
  left: "translateX(-64px)",
  right: "translateX(64px)",
};

export default function RevealOnScroll({
  children,
  delayMs = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  direction?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      // Trigger while the element is still mostly below the fold, so the
      // reveal plays out as it scrolls into view rather than snapping in.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0) scale(1)" : HIDDEN_TRANSFORM[direction],
        transition: `opacity ${DURATION_MS}ms ${EASE} ${delayMs}ms, transform ${DURATION_MS}ms ${EASE} ${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
