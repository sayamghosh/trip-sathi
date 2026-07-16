import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { auth } = useAuthStore()

  // The _authenticated route guard always populates auth.user before this
  // renders, but keep a neutral fallback (never a hardcoded fake person)
  // in case of a render before that resolves.
  const dynamicUser = auth.user
    ? {
        name: auth.user.name || auth.user.email,
        email: auth.user.email,
        avatar: auth.user.picture || '',
      }
    : { name: 'Admin', email: '', avatar: '' }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dynamicUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
