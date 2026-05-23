import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  UserCog, 
  Search as SearchIcon, 
  Check, 
  X, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function AgentsListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  // Local state for pagination, filters, and searches
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  
  const limit = 10

  // Build backend query params
  const buildParams = () => {
    const params: any = { page, limit }
    if (search.trim() !== '') params.search = search.trim()
    if (statusFilter !== 'all') params.status = statusFilter
    if (activeFilter !== 'all') params.isActive = activeFilter === 'active'
    return params
  }

  // React Query to fetch agents
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['agents', page, search, statusFilter, activeFilter],
    queryFn: async () => {
      const response = await api.get('/super-admin/agents', { params: buildParams() })
      return response.data
    },
    placeholderData: (previousData) => previousData, // smooth transitions
  })

  // Mutation to verify/approve/reject guide
  const verifyMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      return await api.patch(`/super-admin/agents/${id}/verify`, { status })
    },
    onSuccess: (_, variables) => {
      toast.success(`Agent successfully ${variables.status === 'approved' ? 'approved' : 'rejected'}!`)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      queryClient.invalidateQueries({ queryKey: ['pending-agents-count'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update verification status.')
    }
  })

  // Mutation to toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await api.patch(`/super-admin/agents/${id}/status`, { isActive })
    },
    onSuccess: (_, variables) => {
      toast.success(`Agent account set to ${variables.isActive ? 'Active' : 'Inactive'}!`)
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to update account status.')
    }
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1) // reset page on search
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleActiveFilterChange = (value: string) => {
    setActiveFilter(value)
    setPage(1)
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant='outline' className='bg-green-500/10 text-green-500 hover:bg-green-500/15 border-green-500/20 px-2.5 py-0.5 rounded-full font-medium text-xs'>Approved</Badge>
      case 'rejected':
        return <Badge variant='outline' className='bg-destructive/10 text-destructive hover:bg-destructive/15 border-destructive/20 px-2.5 py-0.5 rounded-full font-medium text-xs'>Rejected</Badge>
      default:
        return <Badge variant='outline' className='bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 border-amber-500/20 px-2.5 py-0.5 rounded-full font-medium text-xs animate-pulse'>Pending</Badge>
    }
  }

  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header fixed>
        <div className='flex items-center gap-2 me-auto'>
          <UserCog className='h-5 w-5 text-muted-foreground' />
          <span className='text-sm font-semibold text-muted-foreground hidden sm:inline-block'>Agent Operations</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
        {/* Page title and description */}
        <div className='flex flex-col gap-1.5'>
          <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent'>Agent Management</h2>
          <p className='text-sm text-muted-foreground'>
            Verify new travel guides, activate/deactivate agent profiles, and inspect metrics.
          </p>
        </div>

        {/* Filter controls bar */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card border rounded-xl p-4 shadow-sm'>
          <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-center'>
            {/* Search Input */}
            <div className='relative w-full sm:max-w-xs'>
              <SearchIcon className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name or email...'
                value={search}
                onChange={handleSearchChange}
                className='pl-9 h-9 w-full rounded-lg'
              />
            </div>
            
            {/* Status dropdown */}
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className='w-full sm:w-[150px] h-9 rounded-lg'>
                <SelectValue placeholder='Verification Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Verifications</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='approved'>Approved</SelectItem>
                <SelectItem value='rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Active status dropdown */}
            <Select value={activeFilter} onValueChange={handleActiveFilterChange}>
              <SelectTrigger className='w-full sm:w-[150px] h-9 rounded-lg'>
                <SelectValue placeholder='Account Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Accounts</SelectItem>
                <SelectItem value='active'>Active Only</SelectItem>
                <SelectItem value='inactive'>Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Table */}
        <div className='rounded-xl border bg-card shadow-sm overflow-hidden'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>Loading travel agents...</p>
            </div>
          ) : isError ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <ShieldAlert className='h-10 w-10 text-destructive' />
              <p className='text-sm font-semibold'>Failed to fetch agents</p>
              <Button onClick={() => refetch()} variant='outline' size='sm'>Retry</Button>
            </div>
          ) : !data || data.agents.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-24 text-center gap-1.5'>
              <UserCog className='h-12 w-12 text-muted-foreground/45 mb-2' />
              <p className='text-base font-semibold'>No agents found</p>
              <p className='text-sm text-muted-foreground max-w-xs'>
                Try modifying your query or check back later when new guides sign up.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader className='bg-muted/30'>
                  <TableRow>
                    <TableHead className='w-[250px]'>Guide Details</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className='text-center'>Verification Status</TableHead>
                    <TableHead className='text-center'>Active Status</TableHead>
                    <TableHead className='text-right pr-6'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.agents.map((agent: any) => (
                    <TableRow key={agent._id} className='hover:bg-muted/10 transition-colors'>
                      {/* Guide Name, Email & Picture */}
                      <TableCell className='font-medium py-3.5'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-9 w-9 border'>
                            <AvatarImage src={agent.picture} alt={agent.name} />
                            <AvatarFallback className='bg-primary/5 text-primary text-xs font-semibold'>
                              {agent.name ? agent.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AG'}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span className='text-sm font-semibold text-foreground leading-tight'>{agent.name || 'Anonymous Guide'}</span>
                            <span className='text-xs text-muted-foreground'>{agent.email}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Phone */}
                      <TableCell className='text-sm text-muted-foreground'>
                        {agent.phone || '—'}
                      </TableCell>

                      {/* Address */}
                      <TableCell className='text-sm text-muted-foreground'>
                        {agent.address || '—'}
                      </TableCell>

                      {/* Verification Status */}
                      <TableCell className='text-center'>
                        {renderStatusBadge(agent.verificationStatus)}
                      </TableCell>

                      {/* Active Status Switch */}
                      <TableCell className='text-center'>
                        <div className='flex items-center justify-center'>
                          <Switch
                            checked={agent.isActive !== false}
                            onCheckedChange={(checked) => 
                              toggleActiveMutation.mutate({ id: agent._id, isActive: checked })
                            }
                            disabled={toggleActiveMutation.isPending}
                          />
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='text-right pr-6'>
                        <div className='flex items-center justify-end gap-2.5'>
                          {agent.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size='icon'
                                variant='outline'
                                className='h-8 w-8 border-green-500/20 hover:bg-green-500/10 text-green-500 hover:text-green-600 rounded-lg'
                                onClick={() => verifyMutation.mutate({ id: agent._id, status: 'approved' })}
                                disabled={verifyMutation.isPending}
                                title='Approve Verification'
                              >
                                <Check className='h-4 w-4' />
                              </Button>
                              <Button
                                size='icon'
                                variant='outline'
                                className='h-8 w-8 border-destructive/20 hover:bg-destructive/10 text-destructive rounded-lg'
                                onClick={() => verifyMutation.mutate({ id: agent._id, status: 'rejected' })}
                                disabled={verifyMutation.isPending}
                                title='Reject Verification'
                              >
                                <X className='h-4 w-4' />
                              </Button>
                            </>
                          )}
                          <Button
                            size='sm'
                            variant='secondary'
                            className='h-8 font-medium gap-1 rounded-lg'
                            onClick={() => navigate({ to: '/agents/$agentId', params: { agentId: agent._id } })}
                          >
                            <Eye className='h-3.5 w-3.5' />
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {data && data.total > limit && (
          <div className='flex items-center justify-between bg-card border rounded-xl p-4 shadow-sm'>
            <span className='text-xs text-muted-foreground'>
              Showing page <strong className='text-foreground font-semibold'>{page}</strong> of <strong className='text-foreground font-semibold'>{data.pages}</strong> ({data.total} total guides)
            </span>
            <div className='flex items-center gap-1.5'>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-lg'
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 rounded-lg'
                disabled={page >= data.pages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </Main>
    </div>
  )
}
