import { useState, useEffect } from "react"
import { Camera, Mail, Phone, MapPin, Building, Shield, Bell, Key, Loader2, Edit3, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Profile() {
  const [user, setUser] = useState<{ name: string; picture: string; role: string; email?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // Simulating data fetch
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setTimeout(() => setIsLoading(false), 600)
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "RH"
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-[24px] border border-dashed border-border bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-secondary-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Loading profile…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto">
      {/* Header section with gradient cover */}
      <div className="relative rounded-[24px] bg-card border border-border shadow-sm overflow-hidden">
        {/* Cover Background */}
        <div className="h-48 w-full bg-linear-to-r from-primary/80 via-primary to-[#818CF8] relative cursor-pointer group">
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
          <Button variant="secondary" size="sm" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-none shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
        </div>

        {/* Profile Info Overlay */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-32 w-32 rounded-full border-4 border-card bg-card overflow-hidden shadow-xl">
                {user?.picture ? (
                  <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary to-[#818CF8] flex items-center justify-center">
                    <span className="text-[40px] font-bold text-white">{getInitials(user?.name || "Ruben Herwitz")}</span>
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info details */}
            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-[28px] font-extrabold text-foreground tracking-tight">{user?.name || "Ruben Herwitz"}</h1>
              <p className="text-[14px] font-medium text-primary mt-1 flex items-center justify-center sm:justify-start gap-2">
                <Shield className="h-4 w-4" />
                {user?.role || "Administrator"}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mb-2">
              <Button variant="outline" className="h-10 px-6 rounded-xl border-border font-bold text-[13px]">View Public Profile</Button>
              <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-primary/20 shadow-lg text-[13px]">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Nav */}
        <aside className="space-y-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${activeTab === 'general' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
          >
            <Building className="h-5 w-5" />
            General Info
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${activeTab === 'security' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
          >
            <Key className="h-5 w-5" />
            Security
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all ${activeTab === 'notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
          >
            <Bell className="h-5 w-5" />
            Notifications
          </button>
        </aside>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === "general" && (
            <div className="rounded-[24px] border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-[20px] font-extrabold text-foreground">Personal Information</h2>
                  <p className="text-[13px] text-muted-foreground mt-1">Update your personal details and how others see you.</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        defaultValue={user?.name || "Ruben Herwitz"}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-[14px] font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input 
                        type="email" 
                        defaultValue={user?.email || "admin@tripsathi.com"}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[14px] font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[14px] font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Location</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue="Mumbai, India"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[14px] font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 pt-4 border-t border-border mt-6">
                  <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Bio</label>
                  <textarea 
                    rows={4}
                    defaultValue="Senior Administrator managing global travel operations. Passionate about ensuring seamless travel experiences."
                    className="w-full p-4 rounded-xl border border-border bg-background text-[14px] font-medium text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-[24px] border border-border bg-card p-8 shadow-sm">
              <h2 className="text-[20px] font-extrabold text-foreground mb-1">Security Settings</h2>
              <p className="text-[13px] text-muted-foreground mb-8">Manage your password and security preferences.</p>
              
              <div className="max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border border-border bg-background text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-foreground/70 uppercase tracking-wider">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border border-border bg-background text-[14px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <Button className="h-10 px-6 rounded-xl bg-primary text-white font-bold shadow-sm text-[13px]">Update Password</Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-[24px] border border-border bg-card p-8 shadow-sm flex items-center justify-center h-64">
              <div className="text-center">
                <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-[14px] font-medium text-muted-foreground">Notification settings coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
