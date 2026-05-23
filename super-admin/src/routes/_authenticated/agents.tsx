import { createFileRoute } from '@tanstack/react-router'
import { AgentsListPage } from '@/features/agents'

export const Route = createFileRoute('/_authenticated/agents')({
  component: AgentsListPage,
})
