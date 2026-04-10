import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface PackageData {
  name: string
  count: number
  participants: number
  value: number
  color: string
}

interface TopPackagesProps {
  data: PackageData[]
}

export function TopPackages({ data }: TopPackagesProps) {
  const totalParticipants = data.reduce((acc, p) => acc + p.participants, 0)

  return (
    <div className="flex flex-col rounded-[16px] border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-foreground">
          Top Packages
        </h3>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[220px]">
         <div className="absolute inset-0 flex items-center justify-center flex-col z-10 pointer-events-none mt-2">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1">
               This Week <ChevronDown className="w-3 h-3"/>
            </div>
            <div className="text-[24px] font-bold text-foreground leading-none mb-1">
              {totalParticipants.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground">Total Participants</div>
         </div>
         <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                      <p className="text-[12px] font-medium text-foreground">{payload[0].name}: {payload[0].value}%</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {data.map((pkg, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="flex h-7 min-w-[36px] shrink-0 px-2 items-center justify-center rounded-[6px] text-[11px] font-semibold text-white"
              style={{ backgroundColor: pkg.color }}
            >
              {pkg.value}%
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-foreground">
                {pkg.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {pkg.participants} Participants
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
