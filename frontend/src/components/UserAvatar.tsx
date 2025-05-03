import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { AvatarProps } from './ui/avatar'
import type { User } from '@/api/gen'

export default function UserAvatar({
  src,
  fallbackName,
  ...props
}: AvatarProps & {
  src: User['image']
  fallbackName: User['username']
}) {
  return (
    <Avatar {...props}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallbackName[0]}</AvatarFallback>
    </Avatar>
  )
}
