import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import api from '@/lib/api'
import { Users, ShieldAlert, Package } from 'lucide-react'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    pendingAgents: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allAgentsRes, pendingAgentsRes] = await Promise.all([
          api.get('/super-admin/agents?limit=1'),
          api.get('/super-admin/agents?isAuthorized=false&limit=1')
        ])
        setStats({
          totalAgents: allAgentsRes.data.total,
          pendingAgents: pendingAgentsRes.data.total,
        })
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} className='me-auto' />
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Super Admin Dashboard
          </h1>
          <div className='flex items-center space-x-2'>
            <Button>Download Report</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className='shadow-sm hover:shadow-md transition-shadow border-indigo-100/50'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-indigo-500'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$4,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card className='shadow-sm hover:shadow-md transition-shadow border-indigo-100/50'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Agents
                  </CardTitle>
                  <Users className='h-4 w-4 text-indigo-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.totalAgents}</div>
                  <p className='text-xs text-muted-foreground'>
                    Registered guide accounts in DB
                  </p>
                </CardContent>
              </Card>
              <Card className='shadow-sm hover:shadow-md transition-shadow border-indigo-100/50'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Pending Approvals
                  </CardTitle>
                  <ShieldAlert className='h-4 w-4 text-amber-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.pendingAgents}</div>
                  <p className='text-xs text-amber-500 font-medium'>
                    Awaiting guide authorization
                  </p>
                </CardContent>
              </Card>
              <Card className='shadow-sm hover:shadow-md transition-shadow border-indigo-100/50'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Active Tour Plans
                  </CardTitle>
                  <Package className='h-4 w-4 text-green-500' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>12</div>
                  <p className='text-xs text-muted-foreground'>
                    Published public tour plans
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4 shadow-sm'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3 shadow-sm'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
