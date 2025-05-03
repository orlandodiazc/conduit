import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { AuthProvider, useAuth } from './auth.tsx'
import ThemeProvider from './components/ThemeProvider.tsx'

const queryClient = new QueryClient()

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    isAuthenticated: false,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const { isAuthenticated } = useAuth()
  return <RouterProvider router={router} context={{ isAuthenticated }} />
}

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

const rootElement = document.getElementById('app')

enableMocking().then(() => {
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider defaultTheme="dark">
              <InnerApp />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </StrictMode>,
    )
  }
})

// Render the app

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
