import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getCurrentUserQueryOptions } from './api/gen'
import type { User } from './api/gen'

export interface AuthContext {
  isAuthenticated: boolean
  setTokenValue: (username: string) => void
  user?: User
  logout: () => void
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = 'auth.user'

export function getStoredToken() {
  return localStorage.getItem(key)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(key, token)
  } else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = React.useState(!!getStoredToken())
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    ...getCurrentUserQueryOptions(),
    retry: false,
    enabled: hasToken,
    staleTime: 10 * 60 * 1000,
  })

  function invalidateCurrentUserQuery() {
    queryClient.invalidateQueries({
      queryKey: getCurrentUserQueryOptions().queryKey,
    })
  }

  const logout = React.useCallback(() => {
    setStoredToken(null)
    setHasToken(false)
    invalidateCurrentUserQuery()
  }, [queryClient])

  const setTokenValue = React.useCallback(
    (token: string) => {
      setStoredToken(token)
      setHasToken(true)
      invalidateCurrentUserQuery()
    },
    [queryClient],
  )

  useEffect(() => {
    if (isError && error.status === 401) {
      logout()
    }
  }, [isError])

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1>Error</h1>
  const isAuthenticated = hasToken && !!data?.user
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setTokenValue, logout, user: data?.user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
