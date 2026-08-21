import type { Transaction } from '../../types/app'
import { TransactionCard } from './TransactionCard'

interface TransactionListProps { items: Transaction[]; onSelect: (transaction: Transaction) => void }

export function TransactionList({ items, onSelect }: TransactionListProps) {
  if (!items.length) return <div className="empty-state"><span>⌁</span><strong>No transactions found</strong><p>Try changing your search or filter.</p></div>
  return <div className="transaction-list">{items.map((transaction) => <TransactionCard key={transaction.id} transaction={transaction} onClick={() => onSelect(transaction)} />)}</div>
}
