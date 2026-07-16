import { createFileRoute } from '@tanstack/react-router'
import { Newsletter } from '@/features/newsletter'

export const Route = createFileRoute('/_authenticated/newsletter/')({
  component: Newsletter,
})
