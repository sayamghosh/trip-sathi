import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Search as SearchIcon, 
  UserX, 
  ChevronRight, 
  ChevronLeft, 
  UserCog, 
  ShieldCheck, 
  ShieldAlert 
} from 'lucide-react'
import api from '@/lib/api'

interface Agent {
  _id: string
  name: string
  email: string
  picture?: string
  phone?: string
  address?: string
  isAuthorized: boolean
  isActive: boolean
  createdAt: string
}

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAuthorizedFilter, setIsAuthorizedFilter] = useState<string>('all')
  const [isActiveFilter, setIsActiveFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchAgents = async () => {
    setLoading(true)
    try {
      let query = `?page=${page}&limit=10`
      if (search.trim() !== '') {
        query += `&search=${encodeURIComponent(search.trim())}`
      }
      if (isAuthorizedFilter !== 'all') {
        query += `&isAuthorized=${isAuthorizedFilter}`
      }
      if (isActiveFilter !== 'all') {
        query += `&isActive=${isActiveFilter}`
      }

      const response = await api.get(`/super-admin/agents${query}`)
      setAgents(response.data.agents)
      setTotalPages(response.data.pages)
      setTotal(response.data.total)
    } catch (error: any) {
      toast.error('Failed to load agents list: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [page, isAuthorizedFilter, isActiveFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchAgents()
  }

  const toggleAuthorization = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus
    try {
      const response = await api.patch(`/super-admin/agents/${id}/authorize`, {
        isAuthorized: updatedStatus
      })
      toast.success(response.data.message || `Agent authorization set to ${updatedStatus}`)
      // Update local state
      setAgents(prev => prev.map(agent => agent._id === id ? { ...agent, isAuthorized: updatedStatus } : agent))
    } catch (error: any) {
      toast.error('Failed to update authorization status: ' + (error.response?.data?.message || error.message))
    }
  }

  const toggleActivation = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus
    try {
      const response = await api.patch(`/super-admin/agents/${id}/status`, {
        isActive: updatedStatus
      })
      toast.success(response.data.message || `Agent active status set to ${updatedStatus}`)
      // Update local state
      setAgents(prev => prev.map(agent => agent._id === id ? { ...agent, isActive: updatedStatus } : agent))
    } catch (error: any) {
      toast.error('Failed to update activation status: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2 font-semibold text-lg text-primary me-auto'>
          <UserCog className='h-5 w-5 text-indigo-500' />
          <span>Super Admin Control Panel</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 sm:p-8 max-w-7xl mx-auto w-full'>
        <div>
          <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Agents Management
          </h2>
          <p className='text-muted-foreground mt-1'>
            Search, filter, authorize or toggle active status of all tour guide agents.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between'>
          <form onSubmit={handleSearchSubmit} className='flex items-center gap-2 flex-1 max-w-md relative'>
            <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input 
              type='text' 
              placeholder='Search agent name or email...' 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='pl-10 h-10 w-full'
            />
            <Button type='submit' size='sm' className='h-10 px-4'>Search</Button>
          </form>

          <div className='flex flex-wrap items-center gap-4'>
            {/* Filter by Authorization */}
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-muted-foreground'>Authorization:</span>
              <select 
                value={isAuthorizedFilter} 
                onChange={(e) => { setIsAuthorizedFilter(e.target.value); setPage(1); }}
                className='h-10 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              >
                <option value='all'>All</option>
                <option value='true'>Authorized</option>
                <option value='false'>Unauthorized</option>
              </select>
            </div>

            {/* Filter by Activation */}
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-muted-foreground'>Status:</span>
              <select 
                value={isActiveFilter} 
                onChange={(e) => { setIsActiveFilter(e.target.value); setPage(1); }}
                className='h-10 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              >
                <option value='all'>All</option>
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className='bg-card border rounded-xl shadow-sm overflow-hidden'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent'></div>
              <span className='text-sm text-muted-foreground'>Retrieving agents database...</span>
            </div>
          ) : agents.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center gap-2'>
              <UserX className='h-12 w-12 text-muted-foreground opacity-50' />
              <h3 className='font-semibold text-lg'>No Agents Found</h3>
              <p className='text-muted-foreground text-sm max-w-sm'>
                No tour guide agents matched your search query or filters. Try adjusting your parameters.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse text-left'>
                <thead>
                  <tr className='border-b bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    <th className='py-4 px-6'>Name</th>
                    <th className='py-4 px-4'>Email</th>
                    <th className='py-4 px-4'>Contact & Address</th>
                    <th className='py-4 px-4 text-center'>Authorized</th>
                    <th className='py-4 px-4 text-center'>Account Status</th>
                    <th className='py-4 px-6 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y text-sm'>
                  {agents.map((agent) => (
                    <tr key={agent._id} className='hover:bg-muted/10 transition-colors'>
                      <td className='py-4 px-6'>
                        <div className='flex items-center gap-3'>
                          <img 
                            src={agent.picture || '/avatars/shadcn.jpg'} 
                            alt={agent.name} 
                            className='h-10 w-10 rounded-full border shadow-sm object-cover'
                          />
                          <div>
                            <span className='font-semibold text-foreground block'>{agent.name}</span>
                            <span className='text-xs text-muted-foreground'>Joined {new Date(agent.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className='py-4 px-4 text-muted-foreground'>{agent.email}</td>
                      <td className='py-4 px-4'>
                        <div className='text-xs text-foreground font-medium'>{agent.phone || 'No phone'}</div>
                        <div className='text-xs text-muted-foreground line-clamp-1 max-w-[200px]'>{agent.address || 'No address'}</div>
                      </td>
                      <td className='py-4 px-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <Switch 
                            checked={agent.isAuthorized}
                            onCheckedChange={() => toggleAuthorization(agent._id, agent.isAuthorized)}
                            className='data-[state=checked]:bg-green-500'
                          />
                          {agent.isAuthorized ? (
                            <span className='inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full'>
                              <ShieldCheck className='h-3 w-3' /> Authorized
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full'>
                              <ShieldAlert className='h-3 w-3' /> Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='py-4 px-4 text-center'>
                        <div className='flex items-center justify-center gap-3'>
                          <Switch 
                            checked={agent.isActive}
                            onCheckedChange={() => toggleActivation(agent._id, agent.isActive)}
                            className='data-[state=checked]:bg-indigo-600'
                          />
                          {agent.isActive ? (
                            <span className='inline-flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-0.5 rounded-full'>
                              Active
                            </span>
                          ) : (
                            <span className='inline-flex items-center text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 rounded-full'>
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='py-4 px-6 text-right'>
                        <Button variant='outline' size='sm' asChild className='h-8 px-3 text-xs gap-1 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20'>
                          <Link to='/agents/$agentId' params={{ agentId: agent._id }}>
                            View Profile <ChevronRight className='h-3.5 w-3.5' />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className='border-t p-4 flex items-center justify-between text-sm text-muted-foreground'>
              <span>Showing {agents.length} of {total} agents</span>
              <div className='flex items-center gap-2'>
                <Button 
                  variant='outline' 
                  size='sm' 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className='h-8 w-8 p-0'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <span className='font-medium text-foreground px-2'>Page {page} of {totalPages}</span>
                <Button 
                  variant='outline' 
                  size='sm' 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className='h-8 w-8 p-0'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Main>
    </>
  )
}
