interface AvatarProps {
  initials: string
  accent: string
  size?: 'small' | 'medium' | 'large'
}

export function Avatar({ initials, accent, size = 'medium' }: AvatarProps) {
  return <span className={`avatar avatar-${size}`} style={{ backgroundColor: accent }}>{initials}</span>
}
