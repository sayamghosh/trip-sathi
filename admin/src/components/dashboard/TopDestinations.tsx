import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Tokyo, Japan", pct: 35, color: "#2E7CF6", participants: "2,458" },
  {
    name: "Sydney, Australia",
    pct: 28,
    color: "#5BC5F0",
    participants: "2,458",
  },
  { name: "Paris, France", pct: 22, color: "#818CF8", participants: "2,458" },
  { name: "Venice, Italy", pct: 15, color: "#F472B6", participants: "2,458" },
]

export function TopDestinations() {
  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-foreground">
          Top Destinations
        </h3>
        <button className="rounded-[8px] bg-primary px-3 py-[5px] text-[11px] font-medium text-white transition hover:bg-primary/90">
          This Month
        </button>
      </div>

      <div className="flex items-center gap-5">
        {/* Donut */}
        <div className="relative" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="pct"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-[10px]">
          {data.map((d) => (
            <div key={d.name} className="flex items-start gap-2">
              <div
                className="mt-[4px] h-[8px] w-[8px] shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <div>
                <p className="text-[12px] leading-tight font-medium text-foreground">
                  {d.name} ({d.pct}%)
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {d.participants} Participants
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
