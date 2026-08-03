import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import {
  AtSign,
  BadgeCheck,
  Camera,
  Check,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import api from "@/lib/axios"
import { cn } from "@/lib/utils"

type ProfileUser = {
  id?: string
  name: string
  picture: string
  role: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  username?: string
  isAuthorized?: boolean
  isActive?: boolean
}

const DEFAULT_BIO = ""
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://joytrips.site"

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
  const [username, setUsername] = useState(() => user?.username || "")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/profile/me")
        setUser(response.data)
        setFullName(response.data.name || "")
        setPhone(response.data.phone || "")
        setAddress(response.data.address || "")
        setBio(response.data.bio || DEFAULT_BIO)
        setUsername(response.data.username || "")
        localStorage.setItem("user", JSON.stringify(response.data))
      } catch (error) {
        console.error("Failed to fetch fresh user profile:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-secondary-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  const name = fullName || user?.name || ""
  const role = user?.role || "Agent"
  const email = user?.email || ""
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
        username: username.trim() || undefined,
      })
      const updatedUser = response.data.user as ProfileUser
      setUser(updatedUser)
      setFullName(updatedUser.name || "")
      setPhone(updatedUser.phone || "")
      setAddress(updatedUser.address || "")
      setBio(updatedUser.bio || DEFAULT_BIO)
      setUsername(updatedUser.username || "")
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    } catch (error: any) {
      console.error("Profile save failed:", error)
      setSaveError(error?.response?.data?.message || "Could not save your changes. Please try again.")
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
    ? "border-border bg-background text-foreground focus-visible:border-primary focus-visible:ring-primary/15"
    : "cursor-default border-border/80 bg-background/40 text-foreground"

  const profileStats = [
    { label: "Profile health", value: user?.phone && user?.address ? "100%" : "50%", detail: user?.phone && user?.address ? "Complete" : "Needs Update" },
    { label: "Account type", value: role.toUpperCase(), detail: "Guide Level" },
    { label: "Guide Status", value: user?.isAuthorized ? "ACTIVE" : "PENDING", detail: user?.isAuthorized ? "Approved Agent" : "In Verification" },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      <Card className="overflow-hidden py-0">
        <div className="relative min-h-72 bg-gradient-to-br from-primary via-primary to-primary/70 p-6 sm:p-8">
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-5 top-5 z-10 h-9 rounded-full border border-white/20 bg-white/15 px-4 text-white shadow-sm backdrop-blur-md hover:bg-white/25"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change Cover
          </Button>

          <div className="relative z-10 mt-14 grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-end">
            <div className="group/avatar relative justify-self-center lg:justify-self-start">
              <Avatar className="h-36 w-36 border-4 border-white/25 shadow-2xl shadow-black/30">
                <AvatarImage src={user?.picture} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-4xl font-extrabold text-primary-foreground">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white/20 bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0 text-center text-primary-foreground lg:text-left">
              <Badge
                variant="secondary"
                className="mb-4 gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur-md hover:bg-white/15"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Travel Partner Profile
              </Badge>
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{name}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-white/85 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 backdrop-blur-md">
                  <Shield className="h-4 w-4" />
                  {role}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md",
                  user?.isAuthorized
                    ? "border-success/30 bg-success/20 text-success"
                    : "border-warning/30 bg-warning/20 text-warning"
                )}>
                  {user?.isAuthorized ? (
                    <>
                      <BadgeCheck className="h-4 w-4" />
                      Authorized Guide
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 animate-pulse" />
                      Awaiting Approval
                    </>
                  )}
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

        <div className="grid gap-px bg-border sm:grid-cols-3">
          {profileStats.map((stat) => (
            <div key={stat.label} className="bg-card px-6 py-5">
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-black tracking-tight text-foreground">{stat.value}</span>
                <span className="pb-1 text-sm font-bold text-primary">{stat.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and how others see you.</CardDescription>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="icon"
            onClick={handleEditButtonClick}
            disabled={isSaving || (isEditing && !canSave)}
            className="h-10 w-10 shrink-0 rounded-full"
            title={isEditing ? "Save personal information" : "Edit personal information"}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {saveError && (
            <Alert variant="destructive">
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileField label="Full Name">
              <Input
                type="text"
                value={fullName}
                readOnly={!isEditing}
                onChange={(event) => setFullName(event.target.value)}
                className={cn("h-12 rounded-2xl px-4 text-sm font-bold", editableInputClass)}
              />
            </ProfileField>

            <ProfileField label="Email Address">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  readOnly
                  aria-readonly="true"
                  title="Email is managed by your Google account"
                  className="h-12 cursor-not-allowed rounded-2xl border-border bg-muted/60 pl-10 pr-32 text-sm font-bold text-muted-foreground"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                  Google account
                </span>
              </div>
            </ProfileField>

            <ProfileField label="Phone Number">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="tel"
                  value={phone}
                  readOnly={!isEditing}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Add phone number"
                  className={cn("h-12 rounded-2xl pl-10 pr-4 text-sm font-bold", editableInputClass)}
                />
              </div>
            </ProfileField>

            <ProfileField label="Location">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={address}
                  readOnly={!isEditing}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Add location"
                  className={cn("h-12 rounded-2xl pl-10 pr-4 text-sm font-bold", editableInputClass)}
                />
              </div>
            </ProfileField>

            <ProfileField label="Channel Username">
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  readOnly={!isEditing}
                  onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="e.g. rahul_treks"
                  className={cn("h-12 rounded-2xl pl-10 pr-4 text-sm font-bold", editableInputClass)}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Your public channel page: {SITE_URL}/guide/{username || "your-username"}
              </p>
            </ProfileField>
          </div>

          <div className="space-y-2 border-t border-border pt-6">
            <Label className="text-xs font-bold uppercase tracking-wider text-foreground/70">Bio</Label>
            <Textarea
              rows={4}
              value={bio}
              readOnly={!isEditing}
              onChange={(event) => setBio(event.target.value)}
              className={cn("min-h-32 resize-none rounded-2xl p-4 text-sm font-bold leading-6", editableInputClass)}
            />
          </div>

          {/* Public channel page */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background/30 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Public Channel Page</p>
                <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
                  {user?.isAuthorized && user?.username
                    ? `Your channel is live at ${SITE_URL}/guide/${user.username}, showcasing your bio and all of your published tour plans in one place — like a YouTube channel for your guiding business.`
                    : "Once you're an authorized guide with a username set above, your channel page goes live automatically — no extra step needed."}
                </p>
                {user?.isAuthorized && user?.username && (
                  <a
                    href={`${SITE_URL}/guide/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    View your channel <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {!user?.isAuthorized && (
                <Badge variant="outline" className="shrink-0 gap-1.5 self-end border-warning/30 bg-warning/10 text-warning sm:self-center">
                  <Shield className="h-3.5 w-3.5" /> Requires Authorization
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-foreground/70">{label}</Label>
      {children}
    </div>
  )
}

export default Profile
