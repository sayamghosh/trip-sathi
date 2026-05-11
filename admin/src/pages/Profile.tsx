import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  BadgeCheck,
  Camera,
  Check,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import api from "@/lib/axios"

type ProfileUser = {
  id?: string
  name: string
  picture: string
  role: string
  email?: string
  phone?: string
  address?: string
  bio?: string
}

const DEFAULT_BIO = "Senior Administrator managing global travel operations. Passionate about ensuring seamless travel experiences."

export function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [fullName, setFullName] = useState(() => user?.name || "")
  const [phone, setPhone] = useState(() => user?.phone || "")
  const [address, setAddress] = useState(() => user?.address || "")
  const [bio, setBio] = useState(() => user?.bio || DEFAULT_BIO)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "RH"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-[24px] border border-dashed border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-secondary-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  const name = fullName || user?.name || "Ruben Herwitz"
  const role = user?.role || "Administrator"
  const email = user?.email || "admin@tripsathi.com"
  const displayAddress = address || "Location not added"
  const canSave = isEditing && Boolean(fullName.trim() && phone.trim() && address.trim() && !isSaving)

  const handleSaveChanges = async () => {
    if (!canSave) return

    try {
      setIsSaving(true)
      setSaveError("")
      const response = await api.patch("/api/profile/guide", {
        name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        bio: bio.trim(),
      })
      const updatedUser = response.data.user as ProfileUser
      setUser(updatedUser)
      setFullName(updatedUser.name || "")
      setPhone(updatedUser.phone || "")
      setAddress(updatedUser.address || "")
      setBio(updatedUser.bio || DEFAULT_BIO)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    } catch (error) {
      console.error("Profile save failed:", error)
      setSaveError("Could not save your changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditButtonClick = () => {
    if (isEditing) {
      void handleSaveChanges()
      return
    }

    setSaveError("")
    setIsEditing(true)
  }

  const editableInputClass = isEditing
    ? "border-border bg-background text-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
    : "cursor-default border-border/80 bg-background/40 text-foreground"

  const profileStats = [
    { label: "Profile health", value: "96%", detail: "Ready for review" },
    { label: "Response time", value: "8m", detail: "Top performer" },
    { label: "Trust score", value: "4.9", detail: "Verified admin" },
  ]

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 pb-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 shadow-sm backdrop-blur-sm">
        <div className="group relative min-h-[290px] bg-linear-to-br from-[#1d4ed8] via-primary to-[#7c3aed] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_78%_8%,rgba(255,255,255,0.16),transparent_24%)]" />
          <Button variant="secondary" size="sm" className="absolute right-5 top-5 z-10 h-9 rounded-full border-white/20 bg-white/15 px-4 text-white shadow-sm backdrop-blur-md hover:bg-white/25">
            <ImageIcon className="mr-2 h-4 w-4" />
            Change Cover
          </Button>

          <div className="relative z-10 mt-14 grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-end">
            <div className="group/avatar relative justify-self-center lg:justify-self-start">
              <div className="h-36 w-36 overflow-hidden rounded-full border-[6px] border-white/25 bg-card shadow-2xl shadow-black/30">
                {user?.picture ? (
                  <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary to-[#818CF8]">
                    <span className="text-[44px] font-extrabold text-white">{getInitials(name)}</span>
                  </div>
                )}
              </div>
              <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white/20 bg-primary text-white shadow-lg transition-all hover:scale-105 hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0 text-center text-white lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Agent Profile
              </div>
              <h1 className="text-[36px] font-black leading-tight tracking-tight sm:text-[44px]">{name}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[14px] font-bold text-white/85 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 backdrop-blur-md">
                  <Shield className="h-4 w-4" />
                  {role}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 backdrop-blur-md">
                  <BadgeCheck className="h-4 w-4" />
                  Verified
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 backdrop-blur-md">
                  <MapPin className="h-4 w-4" />
                  {displayAddress}
                </span>
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>
        </div>

        <div className="grid gap-px bg-border/70 sm:grid-cols-3">
          {profileStats.map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-5">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-black tracking-tight text-foreground">{stat.value}</span>
                <span className="pb-1 text-[13px] font-bold text-primary">{stat.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        <div className="rounded-3xl border border-border bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Personal Information</h2>
              <p className="mt-1 text-[13px] font-medium text-muted-foreground">Update your personal details and how others see you.</p>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="icon"
              onClick={handleEditButtonClick}
              disabled={isSaving || (isEditing && !canSave)}
              className="h-10 w-10 rounded-full bg-background text-muted-foreground hover:text-primary data-[variant=default]:bg-primary data-[variant=default]:text-white data-[variant=default]:hover:bg-primary/90"
              title={isEditing ? "Save personal information" : "Edit personal information"}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>

          {isEditing && (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-[13px] font-bold text-primary">
              Editing is enabled. Click the check button to keep your updates.
            </div>
          )}

          {saveError && (
            <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-[13px] font-bold text-destructive">
              {saveError}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ProfileField label="Full Name">
                <input
                  type="text"
                  value={fullName}
                  readOnly={!isEditing}
                  onChange={(event) => setFullName(event.target.value)}
                  className={`h-12 w-full rounded-2xl border px-4 text-[14px] font-bold outline-none transition-all ${editableInputClass}`}
                />
              </ProfileField>

              <ProfileField label="Email Address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    aria-readonly="true"
                    title="Email is managed by your Google account"
                    className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted/60 pl-10 pr-32 text-[14px] font-bold text-muted-foreground outline-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-extrabold text-primary">
                    Google account
                  </span>
                </div>
              </ProfileField>

              <ProfileField label="Phone Number">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    readOnly={!isEditing}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Add phone number"
                    className={`h-12 w-full rounded-2xl border pl-10 pr-4 text-[14px] font-bold outline-none transition-all placeholder:text-muted-foreground/60 ${editableInputClass}`}
                  />
                </div>
              </ProfileField>

              <ProfileField label="Location">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={address}
                    readOnly={!isEditing}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Add location"
                    className={`h-12 w-full rounded-2xl border pl-10 pr-4 text-[14px] font-bold outline-none transition-all placeholder:text-muted-foreground/60 ${editableInputClass}`}
                  />
                </div>
              </ProfileField>
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-6">
              <label className="text-[12px] font-bold uppercase tracking-wider text-foreground/70">Bio</label>
              <textarea
                rows={4}
                value={bio}
                readOnly={!isEditing}
                onChange={(event) => setBio(event.target.value)}
                className={`min-h-32 w-full resize-none rounded-2xl border p-4 text-[14px] font-bold leading-6 outline-none transition-all ${editableInputClass}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[12px] font-bold uppercase tracking-wider text-foreground/70">{label}</label>
      {children}
    </div>
  )
}
