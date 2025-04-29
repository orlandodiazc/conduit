import { setupWorker } from 'msw/browser'
import { handlers } from '@/api/gen/handlers'

export const worker = setupWorker(...handlers)
