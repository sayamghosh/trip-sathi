import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, MailX, ChevronRight, ChevronLeft, CheckCircle2, Circle } from 'lucide-react'
import api from '@/lib/api'

interface ContactMessage {
  _id: string
  email: string
  message: string
  status: 'new' | 'resolved'
  createdAt: string
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [unresolvedCount, setUnresolvedCount] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      let query = `?page=${page}&limit=20`
      if (statusFilter !== 'all') {
        query += `&status=${statusFilter}`
      }
      const response = await api.get(`/super-admin/contact-messages${query}`)
      setMessages(response.data.messages)
      setTotalPages(response.data.pages)
      setTotal(response.data.total)
      setUnresolvedCount(response.data.unresolvedCount)
    } catch (error: any) {
      toast.error('Failed to load contact messages: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  const toggleStatus = async (id: string, currentStatus: 'new' | 'resolved') => {
    if (updatingId) return
    const nextStatus = currentStatus === 'new' ? 'resolved' : 'new'
    setUpdatingId(id)
    try {
      await api.patch(`/super-admin/contact-messages/${id}/status`, { status: nextStatus })
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: nextStatus } : m))
      setUnresolvedCount(prev => nextStatus === 'resolved' ? Math.max(0, prev - 1) : prev + 1)
      toast.success(`Marked as ${nextStatus}`)
    } catch (error: any) {
      toast.error('Failed to update status: ' + (error.response?.data?.message || error.message))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2 font-semibold text-lg text-primary me-auto'>
          <Mail className='h-5 w-5 text-indigo-500' />
          <span>Super Admin Control Panel</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full'>
        <div>
          <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Contact Messages
          </h2>
          <p className='text-muted-foreground mt-1'>
            Messages submitted through the Contact Us form on the traveler site.
            {unresolvedCount > 0 && (
              <span className='ml-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full align-middle'>
                {unresolvedCount} unresolved
              </span>
            )}
          </p>
        </div>

        <div className='bg-card border rounded-xl p-4 shadow-sm flex items-center gap-4'>
          <span className='text-sm font-medium text-muted-foreground'>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className='h-10 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          >
            <option value='all'>All</option>
            <option value='new'>New</option>
            <option value='resolved'>Resolved</option>
          </select>
        </div>

        <div className='bg-card border rounded-xl shadow-sm overflow-hidden'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent'></div>
              <span className='text-sm text-muted-foreground'>Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center gap-2'>
              <MailX className='h-12 w-12 text-muted-foreground opacity-50' />
              <h3 className='font-semibold text-lg'>No Messages Found</h3>
              <p className='text-muted-foreground text-sm max-w-sm'>
                No contact messages matched your filter.
              </p>
            </div>
          ) : (
            <div className='divide-y'>
              {messages.map((m) => (
                <div key={m._id} className='p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-semibold text-foreground'>{m.email}</span>
                      {m.status === 'new' ? (
                        <span className='inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full'>
                          <Circle className='h-2.5 w-2.5 fill-current' /> New
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full'>
                          <CheckCircle2 className='h-3 w-3' /> Resolved
                        </span>
                      )}
                    </div>
                    <p className='mt-1.5 text-sm text-foreground/90 whitespace-pre-wrap'>{m.message}</p>
                    <p className='mt-1.5 text-xs text-muted-foreground'>{new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={updatingId === m._id}
                    onClick={() => toggleStatus(m._id, m.status)}
                    className='shrink-0 h-8 px-3 text-xs'
                  >
                    Mark as {m.status === 'new' ? 'Resolved' : 'New'}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className='border-t p-4 flex items-center justify-between text-sm text-muted-foreground'>
              <span>Showing {messages.length} of {total} messages</span>
              <div className='flex items-center gap-2'>
                <Button variant='outline' size='sm' disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className='h-8 w-8 p-0'>
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <span className='font-medium text-foreground px-2'>Page {page} of {totalPages}</span>
                <Button variant='outline' size='sm' disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className='h-8 w-8 p-0'>
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
