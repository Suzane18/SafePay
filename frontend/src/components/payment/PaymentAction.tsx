import type { LucideIcon } from 'lucide-react'

interface PaymentActionProps {
  label: string
  icon: LucideIcon
  tint: string
  onClick?: () => void
}

export function PaymentAction({ label, icon: Icon, tint, onClick }: PaymentActionProps) {
  return <button className="payment-action" onClick={onClick}><span className="action-icon" style={{ color: tint, backgroundColor: `${tint}15` }}><Icon size={21} /></span><span>{label}</span></button>
}
