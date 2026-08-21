import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Card } from '../common/Card'

interface SafePayProtectionCardProps { onClick?: () => void }

export function SafePayProtectionCard({ onClick }: SafePayProtectionCardProps) {
  return <Card className="protection-card"><div className="protection-icon"><ShieldCheck size={22} /></div><div className="protection-copy"><span className="micro-label">Your payment companion</span><strong>Protected by SafePay AI</strong><p>Check your payment before you send it.</p><button onClick={onClick}>Try SafePay Check <ArrowRight size={16} /></button></div><div className="protection-spark">✦</div></Card>
}
