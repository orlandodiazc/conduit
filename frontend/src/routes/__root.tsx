import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import Header from '../components/Header'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
  isAuthenticated: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div className="container m-auto">
      <Header />
      <Outlet />
    </div>
  ),
})
