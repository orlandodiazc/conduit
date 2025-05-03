import { Link } from '@tanstack/react-router'
import { Newspaper, Settings } from 'lucide-react'
import UserAvatar from './UserAvatar'
import { useAuth } from '@/auth'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="flex justify-between py-5">
      <Link to="/" className="font-extrabold text-2xl">
        conduit
      </Link>
      <nav className="flex gap-4 items-center">
        <Link
          to="/"
          className="text-muted-foreground [&.active]:text-foreground"
        >
          Home
        </Link>
        {user ? (
          <>
            <Link
              className="text-muted-foreground [&.active]:text-foreground flex gap-1 items-center"
              to="/articles/create"
            >
              <Newspaper size={18} />
              New article
            </Link>
            <Link
              className="text-muted-foreground [&.active]:text-foreground flex gap-1 items-center"
              to="/settings"
            >
              <Settings size={18} />
              Settings
            </Link>
            <div className="ms-4">
              <Link
                className="flex gap-2 items-center"
                to="/profile/$username"
                params={{ username: user.username }}
              >
                <UserAvatar
                  src={user.image}
                  fallbackName={user.username}
                  className="size-7"
                />
                <span className="text-sm text-foreground/90">
                  {user.username}
                </span>
              </Link>
            </div>
          </>
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
