import { useParams, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  X,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  Loader2,
  Package,
  Layers,
  Award,
  CircleDollarSign,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AgentDetailPage() {
  const { agentId } = useParams({ from: '/_authenticated/agents/$agentId' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Query 1: Fetch specific agent profile details
  const { data: agent, isLoading: isLoadingAgent, isError: isErrorAgent } = useQuery({
    queryKey: ['agent-detail', agentId],
    queryFn: async () => {
      const response = await api.get(`/super-admin/agents/${agentId}`)
      return response.data
    }
  })

  // Query 2: Fetch agent packages metrics
  const { data: metrics } = useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: async () => {
      const response = await api.get(`/super-admin/agents/${agentId}/metrics`)
      return response.data
    }
  })

  // Query 3: Fetch all packages created by agent (public & drafts)
  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ['agent-packages', agentId],
    queryFn: async () => {
      const response = await api.get(`/super-admin/agents/${agentId}/packages`)
      return response.data
    }
  })

  // Mutation to verify/approve/reject guide
  const verifyMutation = useMutation({
    mutationFn: async (status: 'approved' | 'rejected') => {
      return await api.patch(`/super-admin/agents/${agentId}/verify`, { status })
    },
    onSuccess: (_, status) => {
      toast.success(`Agent successfully ${status === 'approved' ? 'approved' : 'rejected'}!`)
      queryClient.invalidateQueries({ queryKey: ['agent-detail', agentId] })
      queryClient.invalidateQueries({ queryKey: ['pending-agents-count'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update verification status.')
    }
  })

  // Mutation to toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      return await api.patch(`/super-admin/agents/${agentId}/status`, { isActive })
    },
    onSuccess: (_, isActive) => {
      toast.success(`Agent account set to ${isActive ? 'Active' : 'Inactive'}!`)
      queryClient.invalidateQueries({ queryKey: ['agent-detail', agentId] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update account status.')
    }
  })

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant='outline' className='bg-green-500/10 text-green-500 hover:bg-green-500/15 border-green-500/20 px-3 py-1 rounded-full font-semibold text-sm'>Approved Profile</Badge>
      case 'rejected':
        return <Badge variant='outline' className='bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20 px-3 py-1 rounded-full font-semibold text-sm'>Verification Rejected</Badge>
      default:
        return <Badge variant='outline' className='bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 border-amber-500/20 px-3 py-1 rounded-full font-semibold text-sm animate-pulse'>Pending Verification</Badge>
    }
  }

  if (isLoadingAgent) {
    return (
      <div className='flex flex-col min-h-screen w-full'>
        <Header fixed>
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/agents' })}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Header>
        <div className='flex flex-col items-center justify-center flex-1 py-20 gap-3'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Retrieving agent details...</p>
        </div>
      </div>
    )
  }

  if (isErrorAgent || !agent) {
    return (
      <div className='flex flex-col min-h-screen w-full'>
        <Header fixed>
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/agents' })}>
            <ArrowLeft className='h-4 w-4' />
          </Button>
        </Header>
        <div className='flex flex-col items-center justify-center flex-1 py-20 gap-3'>
          <X className='h-10 w-10 text-destructive' />
          <p className='text-base font-semibold'>Failed to load agent profile</p>
          <Button onClick={() => navigate({ to: '/agents' })} variant='outline' size='sm'>Go back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header fixed>
        <div className='flex items-center gap-3 me-auto'>
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/agents' })} className='h-8 w-8 rounded-lg'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <span className='text-sm font-semibold text-muted-foreground'>Agent Details</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
        {/* Profile header block */}
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16 border-2 shadow-sm'>
              <AvatarImage src={agent.picture} alt={agent.name} />
              <AvatarFallback className='bg-primary/5 text-primary text-xl font-bold'>
                {agent.name ? agent.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AG'}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-1'>
              <h2 className='text-2xl font-bold tracking-tight'>{agent.name || 'Anonymous Guide'}</h2>
              <div className='flex flex-wrap items-center gap-2'>
                {renderStatusBadge(agent.verificationStatus)}
                {agent.isActive !== false ? (
                  <Badge variant='outline' className='bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5 rounded-full text-xs'>Active</Badge>
                ) : (
                  <Badge variant='outline' className='bg-muted text-muted-foreground border-muted-foreground/20 px-2 py-0.5 rounded-full text-xs'>Inactive</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Column Main Grid Layout */}
        <div className='grid gap-6 md:grid-cols-3'>
          {/* Left Hand: Core Info Card */}
          <div className='flex flex-col gap-6 md:col-span-1'>
            {/* Biography & Details */}
            <Card className='shadow-sm rounded-xl overflow-hidden'>
              <CardHeader className='bg-muted/10 border-b pb-4'>
                <CardTitle className='text-base font-semibold'>Contact & Bio</CardTitle>
                <CardDescription>Personal details and onboarding metadata.</CardDescription>
              </CardHeader>
              <CardContent className='pt-5 flex flex-col gap-4.5'>
                {agent.bio && (
                  <div className='flex flex-col gap-1 border-b pb-3.5'>
                    <span className='text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5'>
                      <FileText className='h-3.5 w-3.5' /> About
                    </span>
                    <p className='text-sm text-foreground leading-relaxed'>{agent.bio}</p>
                  </div>
                )}
                
                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                  <Mail className='h-4 w-4 text-muted-foreground/60 shrink-0' />
                  <span className='truncate text-foreground'>{agent.email}</span>
                </div>
                
                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                  <Phone className='h-4 w-4 text-muted-foreground/60 shrink-0' />
                  <span className='text-foreground'>{agent.phone || 'No phone number'}</span>
                </div>

                <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                  <MapPin className='h-4 w-4 text-muted-foreground/60 shrink-0' />
                  <span className='text-foreground'>{agent.address || 'No address specified'}</span>
                </div>

                <div className='flex items-center gap-3 text-sm text-muted-foreground border-t pt-3.5'>
                  <Calendar className='h-4 w-4 text-muted-foreground/60 shrink-0' />
                  <span>Joined {new Date(agent.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card (Verify & Activation Status) */}
            <Card className='shadow-sm rounded-xl overflow-hidden border-primary/10'>
              <CardHeader className='bg-primary/5 border-b pb-4'>
                <CardTitle className='text-base font-semibold flex items-center gap-1.5 text-primary'>
                  <UserCheck className='h-4 w-4' /> Admin Controls
                </CardTitle>
                <CardDescription>Approve agent credentials or deactivate access.</CardDescription>
              </CardHeader>
              <CardContent className='pt-5 flex flex-col gap-5.5'>
                {/* Account status switch */}
                <div className='flex items-center justify-between border-b pb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-sm font-semibold'>Activate Guide Profile</span>
                    <span className='text-xs text-muted-foreground'>Enable/disable agent access.</span>
                  </div>
                  <Switch
                    checked={agent.isActive !== false}
                    onCheckedChange={(checked) => toggleActiveMutation.mutate(checked)}
                    disabled={toggleActiveMutation.isPending}
                  />
                </div>

                {/* Verification controls */}
                <div className='flex flex-col gap-3'>
                  <span className='text-sm font-semibold'>Verification Actions</span>
                  <div className='flex gap-2.5'>
                    <Button
                      className='flex-1 gap-1.5 font-medium shadow-sm bg-green-600 hover:bg-green-700 text-white rounded-lg'
                      onClick={() => verifyMutation.mutate('approved')}
                      disabled={verifyMutation.isPending || agent.verificationStatus === 'approved'}
                    >
                      <Check className='h-4 w-4' />
                      Approve
                    </Button>
                    <Button
                      variant='destructive'
                      className='flex-1 gap-1.5 font-medium shadow-sm rounded-lg'
                      onClick={() => verifyMutation.mutate('rejected')}
                      disabled={verifyMutation.isPending || agent.verificationStatus === 'rejected'}
                    >
                      <X className='h-4 w-4' />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Hand: Metrics & Tour Packages */}
          <div className='flex flex-col gap-6 md:col-span-2'>
            {/* Quick Agent Metrics Cards */}
            <div className='grid gap-4 sm:grid-cols-4'>
              {/* Total Packages */}
              <Card className='shadow-sm rounded-xl overflow-hidden'>
                <CardContent className='p-4.5 flex items-center gap-3.5'>
                  <div className='p-2 rounded-lg bg-blue-500/10 text-blue-500'>
                    <Package className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-muted-foreground leading-none font-medium mb-1'>Total Plans</span>
                    <span className='text-2xl font-bold tracking-tight leading-none'>{metrics?.totalPackages ?? 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Active Packages */}
              <Card className='shadow-sm rounded-xl overflow-hidden'>
                <CardContent className='p-4.5 flex items-center gap-3.5'>
                  <div className='p-2 rounded-lg bg-green-500/10 text-green-500'>
                    <Layers className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-muted-foreground leading-none font-medium mb-1'>Published</span>
                    <span className='text-2xl font-bold tracking-tight leading-none'>{metrics?.activePackages ?? 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings */}
              <Card className='shadow-sm rounded-xl overflow-hidden'>
                <CardContent className='p-4.5 flex items-center gap-3.5'>
                  <div className='p-2 rounded-lg bg-purple-500/10 text-purple-500'>
                    <Award className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-muted-foreground leading-none font-medium mb-1'>Bookings</span>
                    <span className='text-2xl font-bold tracking-tight leading-none'>{metrics?.totalBookings ?? 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue */}
              <Card className='shadow-sm rounded-xl overflow-hidden'>
                <CardContent className='p-4.5 flex items-center gap-3.5'>
                  <div className='p-2 rounded-lg bg-amber-500/10 text-amber-500'>
                    <CircleDollarSign className='h-5 w-5' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs text-muted-foreground leading-none font-medium mb-1'>Revenue</span>
                    <span className='text-2xl font-bold tracking-tight leading-none'>${metrics?.revenue ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tour Packages List */}
            <Card className='shadow-sm rounded-xl overflow-hidden flex flex-col flex-1'>
              <CardHeader className='bg-muted/10 border-b pb-4'>
                <CardTitle className='text-base font-semibold'>Tour Packages & Plans</CardTitle>
                <CardDescription>Created tour packages by this agent.</CardDescription>
              </CardHeader>
              <CardContent className='p-6 flex flex-col gap-4 flex-1 justify-start'>
                {isLoadingPackages ? (
                  <div className='flex flex-col items-center justify-center py-20 gap-2.5'>
                    <Loader2 className='h-6 w-6 animate-spin text-primary' />
                    <span className='text-xs text-muted-foreground'>Loading tour plans...</span>
                  </div>
                ) : !packages || packages.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-20 text-center gap-2'>
                    <Package className='h-10 w-10 text-muted-foreground/30' />
                    <p className='text-sm font-semibold'>No packages listed</p>
                    <p className='text-xs text-muted-foreground max-w-xs'>
                      This agent has not created any travel packages yet.
                    </p>
                  </div>
                ) : (
                  <div className='grid gap-4 sm:grid-cols-2'>
                    {packages.map((pkg: any) => (
                      <Card key={pkg._id} className='overflow-hidden border border-muted-foreground/10 hover:border-primary/20 transition-all shadow-sm flex flex-col'>
                        <div className='h-32 bg-muted relative overflow-hidden'>
                          {pkg.bannerImages && pkg.bannerImages.length > 0 ? (
                            <img src={pkg.bannerImages[0]} alt={pkg.title} className='w-full h-full object-cover' />
                          ) : (
                            <div className='flex items-center justify-center h-full text-muted-foreground bg-primary/5'>
                              <Package className='h-8 w-8 text-primary/25' />
                            </div>
                          )}
                          <div className='absolute top-2.5 right-2.5'>
                            {pkg.isPublic ? (
                              <Badge className='bg-green-600 text-white rounded-lg shadow-sm border-0 font-medium px-2 py-0.5 text-2xs'>Published</Badge>
                            ) : (
                              <Badge variant='secondary' className='rounded-lg shadow-sm font-medium px-2 py-0.5 text-2xs'>Draft</Badge>
                            )}
                          </div>
                        </div>
                        <CardHeader className='p-4.5 pb-2.5'>
                          <CardTitle className='text-sm font-bold line-clamp-1'>{pkg.title}</CardTitle>
                          <CardDescription className='text-2xs font-semibold uppercase text-primary tracking-wider mt-0.5'>
                            {pkg.durationDays} Days / {pkg.durationNights} Nights
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='px-4.5 pb-4 pt-0 mt-auto flex items-center justify-between border-t border-muted/50 pt-3'>
                          <span className='text-2xs text-muted-foreground'>
                            {pkg.locations?.length || 0} Locations
                          </span>
                          <span className='text-sm font-bold text-foreground'>
                            ${pkg.basePrice}
                          </span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </div>
  )
}
