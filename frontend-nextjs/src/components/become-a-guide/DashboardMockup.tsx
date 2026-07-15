"use client";

import { useEffect, useRef } from "react";

const DESTINATIONS = [
  { label: "Darjeeling", pct: 38, delay: 100, color: "#E2531B" },
  { label: "Kalimpong", pct: 27, delay: 220, color: "#121212" },
  { label: "Dooars", pct: 21, delay: 340, color: "#121212" },
];

export default function DashboardMockup() {
  const lineRef = useRef<SVGPolylineElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.width = `${DESTINATIONS[i].pct}%`;
      });

      const line = lineRef.current;
      if (line) {
        const len = line.getTotalLength();
        line.style.strokeDasharray = String(len);
        line.style.strokeDashoffset = String(len);
        line.getBoundingClientRect();
        line.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)";
        requestAnimationFrame(() => {
          line.style.strokeDashoffset = "0";
        });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="border border-[rgba(18,18,18,0.12)] rounded-2xl overflow-hidden bg-white flex h-[480px] animate-guide-fade-up [animation-delay:0.15s]">
      {/* Sidebar */}
      <div className="w-[190px] shrink-0 border-r border-[rgba(18,18,18,0.1)] px-4 py-[22px] flex flex-col gap-0.5 bg-[#FBF9F4]">
        <div className="flex items-center gap-2 mb-[26px] px-1.5">
          <div className="w-[9px] h-[9px] bg-[#E2531B]" />
          <span className="font-semibold text-[13.5px]">joytrips</span>
        </div>
        <div className="bg-[#121212] text-[#FBF9F4] rounded-md px-2.5 py-[9px] text-[13px] font-semibold">Dashboard</div>
        <div className="text-[#6E6A5C] px-2.5 py-[9px] text-[13px]">Packages</div>
        <div className="text-[#6E6A5C] px-2.5 py-[9px] text-[13px]">Bookings</div>
        <div className="text-[#6E6A5C] px-2.5 py-[9px] text-[13px]">Calendar</div>
        <div className="text-[#6E6A5C] px-2.5 py-[9px] text-[13px] flex justify-between">
          Travelers <span className="bg-[#E2531B] text-white rounded-full text-[10px] px-1.5 py-px">2</span>
        </div>
        <div className="text-[#6E6A5C] px-2.5 py-[9px] text-[13px]">Messages</div>
        <div className="mt-auto px-1.5 text-[11.5px] text-[#B7B2A0] font-mono">v2.1 · agent portal</div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6.5 py-5 border-b border-[rgba(18,18,18,0.1)]">
          <div>
            <div className="text-[11.5px] text-[#6E6A5C] uppercase tracking-[0.06em]">Dashboard</div>
            <div className="text-[17px] font-semibold mt-0.5">Welcome back, Priya</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#EDE9DD] border border-[rgba(18,18,18,0.1)]" />
        </div>

        <div className="grid grid-cols-3 gap-4 px-6.5 pt-[22px]">
          <div className="border border-[rgba(18,18,18,0.1)] rounded-[10px] p-4">
            <div className="text-xs text-[#6E6A5C] mb-2">Live packages</div>
            <div className="text-2xl font-semibold">6</div>
            <div className="text-[11.5px] text-[#1E8A5E] mt-1.5">↑ 2 this month</div>
          </div>
          <div className="border border-[rgba(18,18,18,0.1)] rounded-[10px] p-4">
            <div className="text-xs text-[#6E6A5C] mb-2">Travelers this week</div>
            <div className="text-2xl font-semibold">18</div>
            <div className="text-[11.5px] text-[#1E8A5E] mt-1.5">↑ 12%</div>
          </div>
          <div className="border border-[rgba(18,18,18,0.1)] rounded-[10px] p-4 bg-[#121212]">
            <div className="text-xs text-[#8A8574] mb-2">You keep</div>
            <div className="text-2xl font-semibold text-[#FBF9F4]">100%</div>
            <div className="text-[11.5px] text-[#E2531B] mt-1.5">$0 taken by us</div>
          </div>
        </div>

        <div className="grid grid-cols-[1.6fr_1fr] gap-4 px-6.5 pt-4 pb-[22px] flex-1 min-h-0">
          <div className="border border-[rgba(18,18,18,0.1)] rounded-[10px] p-4 flex flex-col">
            <div className="text-[13px] font-semibold mb-2.5">Earnings, paid direct</div>
            <svg viewBox="0 0 320 110" className="w-full flex-1" preserveAspectRatio="none">
              <polyline
                ref={lineRef}
                points="0,90 40,78 80,82 120,55 160,60 200,30 240,38 280,18 320,24"
                fill="none"
                stroke="#E2531B"
                strokeWidth="2.5"
              />
              <polyline
                points="0,90 40,78 80,82 120,55 160,60 200,30 240,38 280,18 320,24 320,110 0,110"
                fill="rgba(226,83,27,0.08)"
                stroke="none"
              />
            </svg>
          </div>
          <div className="border border-[rgba(18,18,18,0.1)] rounded-[10px] p-4">
            <div className="text-[13px] font-semibold mb-3">Top destinations</div>
            <div className="flex flex-col gap-2.5">
              {DESTINATIONS.map((d, i) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{d.label}</span>
                    <span className="text-[#6E6A5C]">{d.pct}%</span>
                  </div>
                  <div className="h-[5px] rounded-[3px] bg-[rgba(18,18,18,0.08)]">
                    <div
                      ref={(el) => { barRefs.current[i] = el; }}
                      className="guide-bar-fill h-full rounded-[3px]"
                      style={{
                        width: "0%",
                        background: d.color,
                        transitionDelay: `${d.delay}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
