import { ArrowDownLeft, ArrowUpRight, BanknoteArrowUp, Bolt, ChevronRight, CircleDollarSign, Droplets, FileText, Lightbulb, MoreHorizontal, QrCode, ReceiptIndianRupee, ScanLine, ShieldCheck, Smartphone, Tv, UserRound, Wifi } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/userService'
import { getTransactions } from '../services/transactionService'
import { mapTransaction, mapUser } from '../utils/apiMappers'
import type { Transaction, User } from '../types/app'
import { PaymentAction } from '../components/payment/PaymentAction'
import { SafePayProtectionCard } from '../components/safepay/SafePayProtectionCard'
import { Avatar } from '../components/common/Avatar'
import { Card } from '../components/common/Card'
import { SectionHeader } from '../components/common/SectionHeader'
import { TransactionCard } from '../components/transactions/TransactionCard'
import { ErrorState, LoadingState } from '../components/common/LoadingState'

const services = [
  { label: 'Recharge', icon: Smartphone, tint: '#246bce' }, { label: 'Electricity', icon: Bolt, tint: '#df9b3f' },
  { label: 'DTH', icon: Tv, tint: '#826ec7' }, { label: 'Water', icon: Droplets, tint: '#3793b3' },
  { label: 'Broadband', icon: Wifi, tint: '#488b71' }, { label: 'Insurance', icon: ShieldCheck, tint: '#e36e56' },
]

export function HomePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { Promise.all([getCurrentUser(), getTransactions({ limit: 3 })]).then(([apiUser, apiTransactions]) => { setUser(mapUser(apiUser)); setRecentTransactions(apiTransactions.map(mapTransaction)) }).catch(() => setError('Unable to load your SafePay home. Please try again.')) }, [])
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  if (!user) return <LoadingState />
  return <div className="page page-home">
    <div className="welcome-row"><div><span className="micro-label">Friday, 21 August</span><h1>{user.name.split(' ')[0]}<span className="wave">✦</span></h1></div><button className="balance-link" onClick={() => window.alert(`Your available balance is ₹${user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)}>View balance <ChevronRight size={15} /></button></div>
    <Card className="balance-card"><div className="balance-top"><span>{user.accountLabel}</span><CircleDollarSign size={19} /></div><strong>₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong><div className="balance-footer"><span>Available to spend</span><span className="balance-chip"><ShieldCheck size={13} /> Protected</span></div></Card>
    <div className="quick-actions"><PaymentAction label="Scan & Pay" icon={QrCode} tint="#246bce" onClick={() => navigate('/scan')} /><PaymentAction label="Send Money" icon={ArrowUpRight} tint="#e36e56" onClick={() => navigate('/payments')} /><PaymentAction label="Request" icon={ArrowDownLeft} tint="#488b71" /><PaymentAction label="Bank Transfer" icon={BanknoteArrowUp} tint="#826ec7" /></div>
    <section><SectionHeader title="Pay bills & recharge" action="See all" /><div className="service-grid">{services.map(({ label, icon: Icon, tint }) => <button key={label} className="service-item"><span style={{ backgroundColor: `${tint}15`, color: tint }}><Icon size={20} /></span><small>{label}</small></button>)}<button className="service-item"><span className="more-service"><MoreHorizontal size={20} /></span><small>More</small></button></div></section>
    <SafePayProtectionCard onClick={() => navigate('/payments')} />
    <section><SectionHeader title="Recent activity" action="View all" onAction={() => navigate('/transactions')} /><div className="recent-list">{recentTransactions.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} onClick={() => navigate(`/transactions/${transaction.id}`)} />)}</div></section>
    <div className="home-footnote"><FileText size={14} /> Demo data only · No real payments are processed</div>
  </div>
}
