import * as React from 'react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { flushSync } from 'react-dom'
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
  const currentUserQuery = useQuery(currentUserQueryOptions)
  const [data, setData] = React.useState<CurrentUserResponse | null>()
  const isAuthenticated = !!data
  function setUser(user: AuthUser) {
    flushSync(() => {
      setData(user ? { user } : null)
    })
  }

  React.useEffect(() => {
    setData(data)
  }, [currentUserQuery.data])
  console.log(data)
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
