import { Banknote, FileText, ShieldCheck, UserRound } from 'lucide-react'
import type { Recipient } from '../../types/app'
import { Avatar } from '../common/Avatar'

interface PaymentSummaryProps {
  recipient: Recipient
  amount: number
  note: string
}

export function PaymentSummary({ recipient, amount, note }: PaymentSummaryProps) {
  return <div className="payment-summary">
    <div className="summary-recipient"><Avatar initials={recipient.initials} accent={recipient.accent} size="large" /><strong>{recipient.name}</strong><span>{recipient.upiId}</span></div>
    <div className="summary-amount"><small>Paying</small><strong>₹{amount.toLocaleString('en-IN')}</strong></div>
    <div className="summary-rows">
      <div><UserRound size={16} /><span>To</span><b>{recipient.name}</b></div>
      <div><Banknote size={16} /><span>Using</span><b>SafePay Wallet</b></div>
      {note && <div><FileText size={16} /><span>Note</span><b>{note}</b></div>}
      <div><ShieldCheck size={16} /><span>Protection</span><b className="blue-text">SafePay Check ready</b></div>
    </div>
  </div>
}
