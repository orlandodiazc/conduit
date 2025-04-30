import { useAuth } from '@/auth'
import { Link } from '@tanstack/react-router'
import { Newspaper, Settings } from 'lucide-react'
import UserAvatar from './UserAvatar'

export default function Header() {
  const { user } = useAuth()
  return (
    <header className="flex justify-between py-5 px-10">
      <Link to="/" className="font-bold text-lg">
        Conduit
      </Link>
      <nav className="flex gap-4 items-center">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link
              className="text-muted-foreground [&.active]:text-foreground flex gap-1 items-center"
              to="/articles/create"
            >
              <Newspaper size={18} />
              Create article
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
                className="[&.active]:text-foreground flex gap-2 items-center"
                to="/profile/$username"
                params={{ username: user.username }}
              >
                <UserAvatar src={user.image} fallbackName={user.username} />
                <span className="text-sm">{user.username}</span>
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
