import { ChevronRight } from 'lucide-react'
import type { Recipient } from '../../types/app'
import { Avatar } from '../common/Avatar'

interface RecipientCardProps {
  recipient: Recipient
  onClick: () => void
}

export function RecipientCard({ recipient, onClick }: RecipientCardProps) {
  return <button className="recipient-card" onClick={onClick}><Avatar initials={recipient.initials} accent={recipient.accent} /><span className="recipient-copy"><strong>{recipient.name}</strong><small>{recipient.upiId}</small></span><ChevronRight size={18} className="muted-icon" /></button>
}
