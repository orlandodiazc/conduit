import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import type { CurrentUserResponse } from './api/gen'

type AuthUser = CurrentUserResponse['user'] | null | undefined

export interface AuthContext {
  isAuthenticated: boolean
  user: AuthUser
  setUser: (user: AuthUser) => void
}

const AuthContext = React.createContext<AuthContext | null>(null)

export const authKey = 'auth.token'

export function getStoredToken() {
  return localStorage.getItem(authKey)
}

export function removeStoredToken() {
  localStorage.removeItem(authKey)
}

export function setStoredToken(token: string) {
  localStorage.setItem(authKey, token)
}

export const currentUserQueryOptions = queryOptions({
  queryKey: [{ url: '/user' }],
  queryFn: async (): Promise<CurrentUserResponse | null> => {
    const response = await fetch('http://localhost:8080/user', {
      headers: { Authorization: 'Bearer ' + getStoredToken() },
    })
    if (response.ok) return await response.json()
    return null
  },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery(currentUserQueryOptions)
  const queryClient = useQueryClient()
  function setUser(user: AuthUser) {
    queryClient.setQueryData(
      currentUserQueryOptions.queryKey,
      user ? { user } : null,
    )
    if (user) {
      setStoredToken(user.token)
    } else {
      removeStoredToken()
    }
  }
  const isAuthenticated = !!data
  return (
    <AuthContext.Provider
      value={{ user: data?.user, setUser, isAuthenticated }}
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
