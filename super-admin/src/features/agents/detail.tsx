import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Eye, 
  BookOpen, 
  DollarSign, 
  ShieldCheck, 
  ShieldAlert, 
  Globe, 
  Lock 
} from 'lucide-react'
import api from '@/lib/api'

interface AgentProfile {
  _id: string
  name: string
  email: string
  picture?: string
  phone?: string
  address?: string
  bio?: string
  isAuthorized: boolean
  isActive: boolean
  createdAt: string
}

interface TourPlan {
  _id: string
  title: string
  description: string
  basePrice: number
  durationDays: number
  durationNights: number
  locations: string[]
  isPublic: boolean
  createdAt: string
}

interface Metrics {
  totalPackages: number
  activePackages: number
  totalBookings: number
  revenue: number
}

export function AgentDetail() {
  const { agentId } = useParams({ from: '/_authenticated/agents/$agentId' })
  const navigate = useNavigate()
  
  const [agent, setAgent] = useState<AgentProfile | null>(null)
  const [packages, setPackages] = useState<TourPlan[]>([])
  const [metrics, setMetrics] = useState<Metrics>({ totalPackages: 0, activePackages: 0, totalBookings: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  const fetchAgentData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Agent Profile
      const agentRes = await api.get(`/super-admin/agents/${agentId}`)
      setAgent(agentRes.data)

      // 2. Fetch Agent Metrics
      const metricsRes = await api.get(`/super-admin/agents/${agentId}/metrics`)
      setMetrics(metricsRes.data)

      // 3. Fetch Agent Packages
      const packagesRes = await api.get(`/super-admin/agents/${agentId}/packages`)
      setPackages(packagesRes.data)
    } catch (error: any) {
      toast.error('Failed to load agent profile data: ' + (error.response?.data?.message || error.message))
      navigate({ to: '/agents' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (agentId) {
      fetchAgentData()
    }
  }, [agentId])

  const toggleAuthorization = async () => {
    if (!agent) return
    const updatedStatus = !agent.isAuthorized
    try {
      const response = await api.patch(`/super-admin/agents/${agentId}/authorize`, {
        isAuthorized: updatedStatus
      })
      toast.success(response.data.message || `Agent authorization set to ${updatedStatus}`)
      setAgent(prev => prev ? { ...prev, isAuthorized: updatedStatus } : null)
      // Sync metrics immediately since active packages counts depend on authorization status
      const metricsRes = await api.get(`/super-admin/agents/${agentId}/metrics`)
      setMetrics(metricsRes.data)
    } catch (error: any) {
      toast.error('Failed to update authorization: ' + (error.response?.data?.message || error.message))
    }
  }

  const toggleActivation = async () => {
    if (!agent) return
    const updatedStatus = !agent.isActive
    try {
      const response = await api.patch(`/super-admin/agents/${agentId}/status`, {
        isActive: updatedStatus
      })
      toast.success(response.data.message || `Agent account status set to ${updatedStatus}`)
      setAgent(prev => prev ? { ...prev, isActive: updatedStatus } : null)
      // Sync metrics
      const metricsRes = await api.get(`/super-admin/agents/${agentId}/metrics`)
      setMetrics(metricsRes.data)
    } catch (error: any) {
      toast.error('Failed to update active status: ' + (error.response?.data?.message || error.message))
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-3 bg-background'>
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent'></div>
        <span className='text-sm text-muted-foreground'>Loading agent details database...</span>
      </div>
    )
  }

  if (!agent) return null

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2 font-semibold text-lg text-primary me-auto'>
          <Button variant='ghost' size='sm' asChild className='h-8 px-2 text-muted-foreground hover:text-foreground'>
            <Link to='/agents'>
              <ChevronLeft className='h-4 w-4 mr-1' /> Back to Agents
            </Link>
          </Button>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto w-full'>
        {/* Breadcrumb Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              Agent Profile Details
            </h2>
            <p className='text-muted-foreground mt-1'>
              Full lifecycle management and verification logs for {agent.name}.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            {agent.isAuthorized ? (
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-full border border-green-200'>
                <ShieldCheck className='h-4 w-4' /> Fully Authorized
              </span>
            ) : (
              <span className='inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-full border border-amber-200'>
                <ShieldAlert className='h-4 w-4' /> Awaiting Authorization
              </span>
            )}
          </div>
        </div>

        {/* Profile Card and Verification Toggles */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Info */}
          <div className='bg-card border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center lg:col-span-1'>
            <img 
              src={agent.picture || '/avatars/shadcn.jpg'} 
              alt={agent.name} 
              className='h-32 w-32 rounded-full border-4 border-indigo-100 shadow-md object-cover mb-4'
            />
            <h3 className='font-bold text-2xl text-foreground'>{agent.name}</h3>
            <span className='text-sm text-indigo-500 font-semibold uppercase tracking-wider mt-1'>Tour Guide Agent</span>
            
            <div className='w-full border-t my-6'></div>
            
            {/* Contact details */}
            <div className='w-full flex flex-col gap-4 text-left text-sm text-muted-foreground'>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-indigo-500 shrink-0' />
                <span className='truncate font-medium text-foreground'>{agent.email}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-indigo-500 shrink-0' />
                <span className='font-medium text-foreground'>{agent.phone || 'No phone provided'}</span>
              </div>
              <div className='flex items-center gap-3'>
                <MapPin className='h-4 w-4 text-indigo-500 shrink-0' />
                <span className='font-medium text-foreground line-clamp-2'>{agent.address || 'No address provided'}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Calendar className='h-4 w-4 text-indigo-500 shrink-0' />
                <span className='font-medium text-foreground'>Registered {new Date(agent.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {agent.bio && (
              <>
                <div className='w-full border-t my-6'></div>
                <div className='w-full text-left'>
                  <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2'>Biography</span>
                  <p className='text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg border'>
                    "{agent.bio}"
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action Control Panel */}
          <div className='lg:col-span-2 flex flex-col gap-6'>
            {/* Authorization controls & account controls */}
            <div className='bg-card border rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Auth switch */}
              <div className='border rounded-xl p-5 flex flex-col justify-between gap-4 bg-muted/10'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    {agent.isAuthorized ? (
                      <ShieldCheck className='h-5 w-5 text-green-500' />
                    ) : (
                      <ShieldAlert className='h-5 w-5 text-amber-500' />
                    )}
                    <h4 className='font-bold text-lg'>Authorization Toggle</h4>
                  </div>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    {agent.isAuthorized 
                      ? 'Authorized agents can publish their tour packages to the public marketplace immediately.' 
                      : 'Awaiting admin authorization. While pending, all tour packages will remain unpublished drafts.'}
                  </p>
                </div>
                <div className='flex items-center justify-between border-t pt-4'>
                  <span className='text-sm font-semibold'>{agent.isAuthorized ? 'Authorized' : 'Awaiting Approval'}</span>
                  <Switch 
                    checked={agent.isAuthorized}
                    onCheckedChange={toggleAuthorization}
                    className='data-[state=checked]:bg-green-500'
                  />
                </div>
              </div>

              {/* Status active switch */}
              <div className='border rounded-xl p-5 flex flex-col justify-between gap-4 bg-muted/10'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <User className='h-5 w-5 text-indigo-500' />
                    <h4 className='font-bold text-lg'>Account Activation</h4>
                  </div>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    Deactivating an agent immediately blocks their access to the admin portal and removes all public packages from being visible to travelers.
                  </p>
                </div>
                <div className='flex items-center justify-between border-t pt-4'>
                  <span className='text-sm font-semibold'>{agent.isActive ? 'Active Account' : 'Deactivated'}</span>
                  <Switch 
                    checked={agent.isActive}
                    onCheckedChange={toggleActivation}
                    className='data-[state=checked]:bg-indigo-600'
                  />
                </div>
              </div>
            </div>

            {/* Metrics cards grid */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Total Plans</span>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-2xl font-bold text-foreground'>{metrics.totalPackages}</span>
                  <Package className='h-5 w-5 text-indigo-500' />
                </div>
              </div>

              <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Active Public</span>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-2xl font-bold text-foreground'>{metrics.activePackages}</span>
                  <Eye className='h-5 w-5 text-green-500' />
                </div>
              </div>

              <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Total Bookings</span>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-2xl font-bold text-foreground'>{metrics.totalBookings}</span>
                  <BookOpen className='h-5 w-5 text-blue-500' />
                </div>
              </div>

              <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col gap-1'>
                <span className='text-xs text-muted-foreground font-medium uppercase tracking-wider'>Revenue</span>
                <div className='flex items-center justify-between mt-1'>
                  <span className='text-2xl font-bold text-foreground'>${metrics.revenue}</span>
                  <DollarSign className='h-5 w-5 text-emerald-500' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tour packages list */}
        <div className='bg-card border rounded-2xl shadow-sm overflow-hidden p-6'>
          <h3 className='font-bold text-xl mb-4 text-foreground flex items-center gap-2'>
            <Package className='h-5 w-5 text-indigo-500' />
            <span>Agent Tour Packages ({packages.length})</span>
          </h3>
          
          {packages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl gap-2 bg-muted/10'>
              <Package className='h-10 w-10 text-muted-foreground opacity-50' />
              <span className='font-semibold text-muted-foreground text-sm'>No packages created yet</span>
              <p className='text-xs text-muted-foreground max-w-xs'>
                This agent has not registered any tour plan packages inside the admin portal.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto border rounded-xl'>
              <table className='w-full border-collapse text-left text-sm'>
                <thead>
                  <tr className='border-b bg-muted/40 text-xs font-semibold uppercase text-muted-foreground'>
                    <th className='py-3 px-4'>Package Title</th>
                    <th className='py-3 px-4'>Locations</th>
                    <th className='py-3 px-4'>Duration</th>
                    <th className='py-3 px-4'>Base Price</th>
                    <th className='py-3 px-4 text-center'>Market Visibility</th>
                    <th className='py-3 px-4 text-right'>Created</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {packages.map(p => (
                    <tr key={p._id} className='hover:bg-muted/5 transition-colors'>
                      <td className='py-3.5 px-4 font-semibold text-foreground max-w-xs truncate'>{p.title}</td>
                      <td className='py-3.5 px-4 text-xs text-muted-foreground max-w-[200px] truncate'>{p.locations.join(', ')}</td>
                      <td className='py-3.5 px-4 text-xs font-medium text-foreground'>{p.durationDays} Days / {p.durationNights} Nights</td>
                      <td className='py-3.5 px-4 font-bold text-foreground'>${p.basePrice}</td>
                      <td className='py-3.5 px-4 text-center'>
                        {p.isPublic && agent.isAuthorized && agent.isActive ? (
                          <span className='inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200'>
                            <Globe className='h-3.5 w-3.5' /> Public Live
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200'>
                            <Lock className='h-3.5 w-3.5' /> Draft / Locked
                          </span>
                        )}
                      </td>
                      <td className='py-3.5 px-4 text-right text-xs text-muted-foreground'>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
