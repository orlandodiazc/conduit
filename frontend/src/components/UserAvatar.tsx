import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { User } from '@/api/gen'

export default function UserAvatar({
  src,
  fallbackName,
}: {
  src: User['image']
  fallbackName: User['username']
}) {
  console.log(src)
  return (
    <Avatar className="rounded-md">
      <AvatarImage src={src} />
      <AvatarFallback className="rounded-md">{fallbackName[0]}</AvatarFallback>
    </Avatar>
  )
}
