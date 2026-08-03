import { MoreHorizontal } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const messages = [
  {
    name: "Europia Hotel",
    msg: "We are pleased to announc...",
    time: "11:00 AM",
    color: "var(--chart-1)",
    init: "E",
    online: true,
  },
  {
    name: "Global Travel Co",
    msg: "We have updated our com...",
    time: "2:15 PM",
    color: "var(--chart-2)",
    init: "G",
    online: false,
  },
  {
    name: "Kalendra Umbora",
    msg: "Hi, I need assistance with c...",
    time: "9:45 AM",
    color: "var(--chart-3)",
    init: "K",
    online: true,
  },
  {
    name: "Osman Farooq",
    msg: "Hello, I had an amazing tim...",
    time: "10:15 AM",
    color: "var(--chart-4)",
    init: "O",
    online: false,
  },
  {
    name: "Mellinda Jenkins",
    msg: "Can you provide more deta...",
    time: "1:20 PM",
    color: "var(--chart-5)",
    init: "M",
    online: true,
  },
  {
    name: "David Hernandez",
    msg: "I would like to upgrade my...",
    time: "10:00 AM",
    color: "var(--chart-1)",
    init: "D",
    online: false,
  },
  {
    name: "Alexandra Green",
    msg: "Our company is interested i...",
    time: "9:10 PM",
    color: "var(--chart-2)",
    init: "A",
    online: true,
  },
]

export function Messages() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Messages</CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-0.5">
        {messages.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition hover:bg-accent"
          >
            <div className="relative shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className="text-xs font-bold text-white"
                  style={{ backgroundColor: m.color }}
                >
                  {m.init}
                </AvatarFallback>
              </Avatar>
              {m.online && (
                <div className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="truncate text-xs font-semibold text-foreground">
                  {m.name}
                </span>
                <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                  {m.time}
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{m.msg}</p>
            </div>

            <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary")}>
              <span className="text-xs font-bold text-primary-foreground">1</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
