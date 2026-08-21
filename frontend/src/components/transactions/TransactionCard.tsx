import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react'
import type { Transaction } from '../../types/app'
import { Avatar } from '../common/Avatar'
import { TransactionStatus } from './TransactionStatus'

interface TransactionCardProps { transaction: Transaction; onClick: () => void }

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const isReceived = transaction.direction === 'Received'
  return <button className="transaction-card" onClick={onClick}><Avatar initials={transaction.initials} accent={transaction.accent} /><span className="transaction-copy"><strong>{transaction.name}</strong><small>{transaction.type} · {transaction.time}</small><TransactionStatus status={transaction.status} /></span><span className={`transaction-amount ${isReceived ? 'received' : ''}`}>{isReceived ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}<ChevronRight size={16} /></span><span className={`direction-icon ${isReceived ? 'received' : ''}`}>{isReceived ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}</span></button>
}
