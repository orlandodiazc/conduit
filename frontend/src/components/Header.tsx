import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Newspaper, Notebook, Settings } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { useAuth } from '@/auth'
import { getCurrentUserQueryOptions } from '@/api/gen'

export default function Header() {
  const { isAuthenticated, user } = useAuth()
  return (
    <header className="flex justify-between px-12 py-4">
      <Link to="/" className="font-bold text-lg">
        Conduit
      </Link>
      <nav className="flex gap-4 items-center">
        <div>
          <Link
            className="text-muted-foreground [&.active]:text-foreground"
            to="/"
          >
            Home
          </Link>
        </div>
        {isAuthenticated ? (
          <AuthenticatedLinks />
        ) : (
          <>
            <Link
              className="text-muted-foreground [&.active]:text-foreground"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="text-muted-foreground [&.active]:text-foreground"
              to="/register"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

function AuthenticatedLinks() {
  const {
    data: { user },
  } = useSuspenseQuery(getCurrentUserQueryOptions())
  return (
    <>
      <div>
        <Link
          className="text-muted-foreground [&.active]:text-foreground flex gap-1.5 items-center"
          to="/articles/create"
        >
          <Newspaper size={20} />
          Create article
        </Link>
      </div>
      <div>
        <Link
          className="text-muted-foreground [&.active]:text-foreground flex gap-1 items-center"
          to="/settings"
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
      <div className="ms-4">
        <Link
          className="text-muted-foreground [&.active]:text-foreground flex gap-1 items-center"
          to="/profile/$username"
          params={{ username: user.username }}
        >
          <UserAvatar src={user.image} fallbackName={user.username} />
          <span className="text-sm">{user.username}</span>
        </Link>
      </div>
    </>
  )
}
