import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Send, MailX, ChevronRight, ChevronLeft, Copy, CheckCircle2, XCircle } from 'lucide-react'
import api from '@/lib/api'

interface NewsletterSubscriber {
  _id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  createdAt: string
}

export function Newsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('subscribed')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [subscribedCount, setSubscribedCount] = useState(0)
  const [copying, setCopying] = useState(false)

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      let query = `?page=${page}&limit=20`
      if (statusFilter !== 'all') {
        query += `&status=${statusFilter}`
      }
      const response = await api.get(`/super-admin/newsletter-subscribers${query}`)
      setSubscribers(response.data.subscribers)
      setTotalPages(response.data.pages)
      setTotal(response.data.total)
      setSubscribedCount(response.data.subscribedCount)
    } catch (error: any) {
      toast.error('Failed to load newsletter subscribers: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  const copyAllSubscribedEmails = async () => {
    setCopying(true)
    try {
      const response = await api.get('/super-admin/newsletter-subscribers?page=1&limit=100000&status=subscribed')
      const emails = (response.data.subscribers as NewsletterSubscriber[]).map((s) => s.email)
      if (emails.length === 0) {
        toast.error('No subscribed emails to copy')
        return
      }
      await navigator.clipboard.writeText(emails.join(', '))
      toast.success(`Copied ${emails.length} email${emails.length === 1 ? '' : 's'} to clipboard`)
    } catch (error: any) {
      toast.error('Failed to copy emails: ' + (error.response?.data?.message || error.message))
    } finally {
      setCopying(false)
    }
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center gap-2 font-semibold text-lg text-primary me-auto'>
          <Send className='h-5 w-5 text-indigo-500' />
          <span>Super Admin Control Panel</span>
        </div>
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-4 sm:p-8 max-w-5xl mx-auto w-full'>
        <div>
          <h2 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Newsletter Subscribers
          </h2>
          <p className='text-muted-foreground mt-1'>
            Emails collected from the "Get Fresh Deals & Travel Tips" signup in the site footer.
            {subscribedCount > 0 && (
              <span className='ml-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full align-middle'>
                {subscribedCount} subscribed
              </span>
            )}
          </p>
        </div>

        <div className='bg-card border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium text-muted-foreground'>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className='h-10 rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            >
              <option value='all'>All</option>
              <option value='subscribed'>Subscribed</option>
              <option value='unsubscribed'>Unsubscribed</option>
            </select>
          </div>

          <Button variant='outline' size='sm' onClick={copyAllSubscribedEmails} disabled={copying} className='gap-2'>
            <Copy className='h-3.5 w-3.5' />
            {copying ? 'Copying...' : 'Copy all subscribed emails'}
          </Button>
        </div>

        <div className='bg-card border rounded-xl shadow-sm overflow-hidden'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent'></div>
              <span className='text-sm text-muted-foreground'>Loading subscribers...</span>
            </div>
          ) : subscribers.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center gap-2'>
              <MailX className='h-12 w-12 text-muted-foreground opacity-50' />
              <h3 className='font-semibold text-lg'>No Subscribers Found</h3>
              <p className='text-muted-foreground text-sm max-w-sm'>
                No newsletter subscribers matched your filter.
              </p>
            </div>
          ) : (
            <div className='divide-y'>
              {subscribers.map((s) => (
                <div key={s._id} className='p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <span className='font-semibold text-foreground'>{s.email}</span>
                      {s.status === 'subscribed' ? (
                        <span className='inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full'>
                          <CheckCircle2 className='h-3 w-3' /> Subscribed
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full'>
                          <XCircle className='h-3 w-3' /> Unsubscribed
                        </span>
                      )}
                    </div>
                    <p className='mt-1.5 text-xs text-muted-foreground'>
                      Joined {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className='border-t p-4 flex items-center justify-between text-sm text-muted-foreground'>
              <span>Showing {subscribers.length} of {total} subscribers</span>
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
