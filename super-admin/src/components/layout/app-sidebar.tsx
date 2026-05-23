import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/api'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const token = useAuthStore((state) => state.auth.accessToken)
  const currentUser = useAuthStore((state) => state.auth.user)

  // Fetch pending agents count from the backend
  const { data: pendingAgentsData } = useQuery({
    queryKey: ['pending-agents-count'],
    queryFn: async () => {
      const response = await api.get('/super-admin/agents?status=pending&limit=1')
      return response.data
    },
    enabled: !!token,
    refetchInterval: 15000, // refresh every 15s to keep it dynamic and fresh!
  })

  const pendingCount = pendingAgentsData?.total

  // Dynamically attach pending agent counts to the Agents sidebar navigation item
  const dynamicNavGroups = sidebarData.navGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => {
      if (item.title === 'Agents') {
        return {
          ...item,
          badge: pendingCount && pendingCount > 0 ? String(pendingCount) : undefined,
        }
      }
      return item
    }),
  }))

  const displayUser = currentUser
    ? {
        name: currentUser.name,
        email: currentUser.email,
        avatar: '', // let default initials handle rendering if no image is defined
      }
    : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {dynamicNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
