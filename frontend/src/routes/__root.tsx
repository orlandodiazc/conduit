import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import Header from '../components/Header'

import type { QueryClient } from '@tanstack/react-query'
import ThemeToggle from '@/components/ThemeToggle'

interface MyRouterContext {
  queryClient: QueryClient
  isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
