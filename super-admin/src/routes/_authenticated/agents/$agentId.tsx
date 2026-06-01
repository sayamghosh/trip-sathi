import { createFileRoute } from '@tanstack/react-router'
import { AgentDetail } from '@/features/agents/detail'

export const Route = createFileRoute('/_authenticated/agents/$agentId')({
  component: AgentDetail,
})
