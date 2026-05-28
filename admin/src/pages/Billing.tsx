import { useState, useEffect } from "react"
import {
  Coins,
  ShieldCheck,
  CalendarDays,
  Sparkles,
  Zap,
  Check,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/axios"
import { toast } from "sonner"

type BillingUser = {
  id?: string
  name: string
  picture: string
  role: string
  credits?: number
  planExpiresAt?: string
  createdAt?: string
}

export function Billing() {
  const [user, setUser] = useState<BillingUser | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const handleUpdate = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    window.addEventListener("user-updated", handleUpdate)
    return () => window.removeEventListener("user-updated", handleUpdate)
  }, [])

  const getIsFirst365Days = () => {
    if (!user?.createdAt) return true
    const createdTime = new Date(user.createdAt).getTime()
    const oneYearMs = 365 * 24 * 60 * 60 * 1000
    return Date.now() - createdTime < oneYearMs
  }

  const isFirstYearFree = getIsFirst365Days()

  const handleRecharge = async (tierId: string, credits: number, days: number, price: number) => {
    try {
      setIsProcessing(true)
      setSelectedPlan(tierId)
      
      // Simulate payment delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await api.post("/api/profile/recharge", { credits, days })
      const updatedUser = response.data.user
      
      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
        window.dispatchEvent(new Event("user-updated"))
        if (isFirstYearFree) {
          toast.success(`Plan claimed successfully for FREE as a new agent!`)
        } else {
          toast.success(`Plan purchased successfully! Paid $${price}.`)
        }
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Payment process failed. Please try again.")
    } finally {
      setIsProcessing(false)
      setSelectedPlan(null)
    }
  }

  const credits = user?.credits ?? 0
  const planExpiresAt = user?.planExpiresAt

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!planExpiresAt) return 0
    const diff = new Date(planExpiresAt).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const daysRemaining = getDaysRemaining()
  const hasAccess = credits > 0 || daysRemaining > 0

  const billingPackages = [
    {
      id: "credits-starter",
      name: "Starter Credits",
      description: "Pay-as-you-go display visibility.",
      price: 49,
      type: "credits",
      amountText: "50 Credits",
      credits: 50,
      days: 0,
      badge: "Best for Starters",
      features: [
        "Visible in search results",
        "Visible on landing pages",
        "Includes standard support",
        "Credits never expire"
      ]
    },
    {
      id: "credits-pro",
      name: "Pro Display Bundle",
      description: "High volume pay-as-you-go visibility.",
      price: 99,
      type: "credits",
      amountText: "180 Credits",
      credits: 180,
      days: 0,
      badge: "Popular Value",
      isPopular: true,
      features: [
        "30 Free bonus credits included",
        "Visible in search results",
        "Priority landing page slot",
        "Priority agent support",
        "Credits never expire"
      ]
    },
    {
      id: "sub-monthly",
      name: "Monthly Pass",
      description: "Unlimited public displays for 30 days.",
      price: 29,
      type: "subscription",
      amountText: "30 Days Validity",
      credits: 0,
      days: 30,
      features: [
        "Unlimited package listings",
        "Visible in all destinations",
        "Live stats overview",
        "Valid for exactly 30 days"
      ]
    },
    {
      id: "sub-annual",
      name: "Annual Premium",
      description: "Unlimited public displays for 365 days.",
      price: 199,
      type: "subscription",
      amountText: "365 Days Validity",
      credits: 0,
      days: 365,
      badge: "Save 42%",
      features: [
        "Unlimited package listings",
        "Featured 'Verified Pro' tag",
        "Top positions in search results",
        "24/7 dedicated support",
        "Valid for exactly 1 full year"
      ]
    }
  ]

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-8 pb-12">
      {/* Expiration Alerts */}
      {!hasAccess && (
        <div className="relative overflow-hidden rounded-[24px] border border-red-500/20 bg-linear-to-r from-red-500/10 to-red-500/5 p-6 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 shadow-inner">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-foreground">Visibility Status: HELD (Plans Hidden)</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your tour packages are currently hidden from travellers on the public portal. Recharge display credits or purchase a subscription pass below to instantly activate and republish your plans.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Core Credits Balance */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Credits</p>
              <h2 className="text-3xl font-black tracking-tight text-foreground mt-1">{credits} Credits</h2>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>Access Status</span>
              <span className={credits > 0 ? "text-emerald-500 font-extrabold" : "text-muted-foreground"}>
                {credits > 0 ? "Active (Pay-As-You-Go)" : "No Credits"}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Pass */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-28 w-28 rounded-full bg-violet-500/5 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subscription Pass</p>
              <h2 className="text-3xl font-black tracking-tight text-foreground mt-1">
                {daysRemaining > 0 ? `${daysRemaining} Days` : "No Active Pass"}
              </h2>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>Pass Validity</span>
              <span className={daysRemaining > 0 ? "text-emerald-500 font-extrabold" : "text-muted-foreground"}>
                {daysRemaining > 0 ? new Date(planExpiresAt!).toLocaleDateString() : "Expired"}
              </span>
            </div>
          </div>
        </div>

        {/* Visibility Status */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 shadow-sm backdrop-blur-sm">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Website Display</p>
              <h2 className="text-3xl font-black tracking-tight text-foreground mt-1">
                {hasAccess ? "PUBLISHED" : "HIDDEN"}
              </h2>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>Visibility Mode</span>
              <span className={hasAccess ? "text-emerald-500 font-extrabold" : "text-red-500 font-extrabold"}>
                {hasAccess ? "Active On Portal" : "Offline / Held"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Packages */}
      <div>
        <div className="mb-8 text-center max-w-xl mx-auto">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Credits & Passes
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Select Display Plan</h2>
          <p className="text-sm font-medium text-muted-foreground mt-2">
            Choose pay-as-you-go display credits or select an unlimited display pass to advertise your packages to travellers.
          </p>
        </div>

        {isFirstYearFree && (
          <div className="mb-8 mx-auto max-w-xl rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-emerald-500 backdrop-blur-md animate-in fade-in duration-500 flex items-center justify-center gap-2.5 shadow-sm">
            <Sparkles className="h-4 w-4 animate-pulse text-emerald-400" />
            <span className="text-xs font-black tracking-wide uppercase text-center leading-normal">
              🎉 New Guide Promo: Claim any display plan for FREE during your first 365 days!
            </span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {billingPackages.map((tier) => {
            const isTierProcessing = isProcessing && selectedPlan === tier.id
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col overflow-hidden rounded-3xl border bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                  tier.isPopular ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border"
                }`}
              >
                {/* Ribbon Tag */}
                {tier.badge && (
                  <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${
                    tier.isPopular ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-1 mt-4">
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  <p className="text-2xs text-muted-foreground font-medium pr-10">{tier.description}</p>
                </div>

                <div className="my-6 border-b border-border/80 pb-5">
                  <div className="flex items-baseline gap-2">
                    {isFirstYearFree ? (
                      <>
                        <span className="text-[24px] font-black tracking-tight text-foreground line-through opacity-40">${tier.price}</span>
                        <span className="text-[28px] font-black tracking-tight text-emerald-500">$0</span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                          FREE
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[28px] font-black tracking-tight text-foreground">${tier.price}</span>
                        <span className="text-xs font-bold text-muted-foreground ml-1">USD</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-primary/8 px-2.5 py-1 text-[11px] font-extrabold text-primary">
                    <Zap className="h-3 w-3 shrink-0" />
                    {tier.amountText}
                  </div>
                </div>

                <ul className="space-y-3.5 mb-8 flex-1 text-xs">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-medium leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleRecharge(tier.id, tier.credits, tier.days, tier.price)}
                  disabled={isProcessing}
                  className={`h-11 w-full rounded-2xl font-bold cursor-pointer transition-all ${
                    tier.isPopular 
                      ? "bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/25" 
                      : "bg-linear-to-r from-muted-foreground/10 to-muted-foreground/5 hover:from-muted-foreground/15 hover:to-muted-foreground/10 border border-border text-foreground hover:text-primary"
                  }`}
                >
                  {isTierProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isFirstYearFree ? `Claim Free Package` : `Purchase Package`
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
