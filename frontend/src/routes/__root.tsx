import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import Header from '../components/Header'

import type { AuthContext } from '@/auth'
import { currentUserQueryOptions } from '@/auth'
import ThemeToggle from '@/components/ThemeToggle'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(currentUserQueryOptions)
  },
  component: () => (
    <div className="container m-auto flex flex-col h-full">
      <Header />
      <div className="grow">
        <Outlet />
      </div>
      <footer className="py-6 flex items-center justify-between">
        <span className="text-sm">Built with React and Spring Boot</span>
        <ThemeToggle />
      </footer>
    </div>
  ),
})
