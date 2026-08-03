import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 pb-0">
        <CardTitle className="text-base font-bold">Top Packages</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="relative flex min-h-56 flex-1 flex-col items-center justify-center">
          <div className="pointer-events-none absolute inset-0 z-10 mt-2 flex flex-col items-center justify-center">
            <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              This Week <ChevronDown className="h-3 w-3" />
            </div>
            <div className="mb-1 text-2xl font-bold leading-none text-foreground">
              {totalParticipants.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Participants</div>
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
                      <div className="rounded-lg border border-border bg-card p-2 shadow-lg">
                        <p className="text-xs font-medium text-foreground">{payload[0].name}: {payload[0].value}%</p>
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
                className="flex h-7 min-w-9 shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold text-white"
                style={{ backgroundColor: pkg.color }}
              >
                {pkg.value}%
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {pkg.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {pkg.participants} Participants
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
