import { MapPin, ChevronDown } from "lucide-react"

const packages = [
  {
    title: "Seoul, South Korea",
    category: "Cultural Exploration",
    catColor: "#22B357",
    catBg: "#E3F7EC",
    days: 10,
    nights: 9,
    price: 2100,
    gradient: "from-[#D4E8FC] via-[#E8F2FE] to-[#C0D8F0]",
    emoji: "🏯",
  },
  {
    title: "Venice, Italy",
    category: "Venice Dreams",
    catColor: "#2E7CF6",
    catBg: "#E8F2FE",
    days: 6,
    nights: 5,
    price: 1500,
    gradient: "from-[#C9EFDA] via-[#E3F7EC] to-[#B8E6CC]",
    emoji: "🏛️",
  },
  {
    title: "Serengeti, Tanzania",
    category: "Safari Adventure",
    catColor: "#FB923C",
    catBg: "#FFF2E5",
    days: 8,
    nights: 7,
    price: 3200,
    gradient: "from-[#FDE8CC] via-[#FFF2E5] to-[#F8D9AE]",
    emoji: "🦁",
  },
]

export function TravelPackages() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#1A2B3D]">
          Travel Packages
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#8896A6]">Sort by:</span>
          <button className="flex items-center gap-0.5 text-[11px] font-medium text-[#1A2B3D]">
            Latest
            <ChevronDown className="h-3 w-3" />
          </button>
          <button className="rounded-[8px] border border-[#E4EAF1] px-2.5 py-[4px] text-[11px] font-medium text-[#5A6E82] transition hover:bg-[#F0F4F8]">
            View All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {packages.map((p) => (
          <div
            key={p.title}
            className="group overflow-hidden rounded-[12px] border border-[#E4EAF1] transition hover:shadow-md"
          >
            {/* Image placeholder */}
            <div
              className={`relative flex h-[90px] items-center justify-center bg-gradient-to-br ${p.gradient}`}
            >
              <span className="text-[32px]">{p.emoji}</span>
              <span
                className="absolute top-2 left-2 rounded-[6px] px-2 py-[2px] text-[9px] font-semibold"
                style={{ backgroundColor: p.catBg, color: p.catColor }}
              >
                {p.category}
              </span>
            </div>

            <div className="px-3 py-2.5">
              <h4 className="text-[12px] font-semibold text-[#1A2B3D]">
                {p.title}
              </h4>
              <div className="mt-[3px] flex items-center gap-1 text-[10px] text-[#8896A6]">
                <MapPin className="h-[10px] w-[10px]" />
                <span>
                  {p.days} Days / {p.nights} Nights
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[14px] font-bold text-[#2E7CF6]">
                    ${p.price.toLocaleString()}
                  </span>
                  <span className="ml-[2px] text-[9px] text-[#8896A6]">
                    /person
                  </span>
                </div>
                <button className="rounded-[6px] bg-[#2E7CF6] px-2.5 py-[4px] text-[10px] font-medium text-white transition hover:bg-[#1B5FCC]">
                  See Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
