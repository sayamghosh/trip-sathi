import { Calendar, Plus } from "lucide-react"

const trips = [
  {
    dest: "Paris, France",
    cat: "Romantic Getaway",
    catC: "#EF4444",
    catBg: "#FEE2E2",
    date: "5 - 10 July",
    n: 9,
    avColors: ["#2E7CF6", "#22B357", "#818CF8", "#F472B6"],
  },
  {
    dest: "Tokyo, Japan",
    cat: "Cultural Exploration",
    catC: "#2E7CF6",
    catBg: "#E8F2FE",
    date: "12 - 18 July",
    n: 17,
    avColors: ["#FB923C", "#22B357", "#818CF8", "#2E7CF6"],
  },
  {
    dest: "Sydney, Australia",
    cat: "Adventure Tour",
    catC: "#22B357",
    catBg: "#E3F7EC",
    date: "15 - 24 July",
    n: 12,
    avColors: ["#EF4444", "#2E7CF6", "#818CF8", "#FB923C"],
  },
  {
    dest: "New York, USA",
    cat: "City Highlights",
    catC: "#818CF8",
    catBg: "#EDE8FE",
    date: "20 - 25 July",
    n: 22,
    avColors: ["#F472B6", "#2E7CF6", "#22B357", "#FB923C"],
  },
]

export function UpcomingTrips() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[#1A2B3D]">
          Upcoming Trips
        </h3>
        <button className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[#2E7CF6] text-white transition hover:bg-[#1B5FCC]">
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2">
        {trips.map((t) => (
          <div
            key={t.dest}
            className="rounded-[10px] border border-[#F0F4F8] p-2.5 transition hover:border-[#E4EAF1] hover:shadow-sm"
          >
            <span
              className="inline-block rounded-[5px] px-[6px] py-[2px] text-[9px] font-semibold"
              style={{ backgroundColor: t.catBg, color: t.catC }}
            >
              {t.cat}
            </span>
            <h4 className="mt-1 text-[12px] font-bold text-[#1A2B3D]">
              {t.dest}
            </h4>
            <div className="mt-1.5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex -space-x-1">
                  {t.avColors.map((c, i) => (
                    <div
                      key={i}
                      className="h-[18px] w-[18px] rounded-full border-[1.5px] border-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="ml-1 text-[9px] font-semibold text-[#2E7CF6]">
                  +{t.n}
                </span>
              </div>
              <div className="flex items-center gap-0.5 text-[9px] text-[#8896A6]">
                <Calendar className="h-[10px] w-[10px]" />
                {t.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
