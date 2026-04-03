import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import CreatePlanPage from "@/components/dashboard/CreatePlanPage"
export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-bold">Create travel plan</h1>
          </div>
          <TopBar />
        </header>

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-6">
          <CreatePlanPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
