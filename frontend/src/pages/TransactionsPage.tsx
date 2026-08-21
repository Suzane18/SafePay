import { CalendarDays, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTransactions } from '../services/transactionService'
import { mapTransaction } from '../utils/apiMappers'
import { Card } from '../components/common/Card'
import { ErrorState, LoadingState } from '../components/common/LoadingState'
import { TransactionList } from '../components/transactions/TransactionList'
import type { TransactionStatus } from '../types/app'

export function TransactionsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | TransactionStatus>('All')
  const [items, setItems] = useState<import('../types/app').Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { setLoading(true); getTransactions({ search: query || undefined, status: filter === 'All' ? undefined : filter.toUpperCase(), limit: 100 }).then((results) => setItems(results.map(mapTransaction))).catch(() => setError('Unable to load transactions. Please try again.')).finally(() => setLoading(false)) }, [filter, query])
  const grouped = useMemo(() => items.reduce<Record<string, import('../types/app').Transaction[]>>((groups, transaction) => { (groups[transaction.date] ??= []).push(transaction); return groups }, {}), [items])
  if (loading) return <LoadingState label="Loading your transactions..." />
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  return <div className="page page-transactions"><div className="transactions-heading"><div><span className="micro-label">Your money trail</span><h1>Transactions</h1></div><button className="circle-control" aria-label="Choose date"><CalendarDays size={18} /></button></div><label className="search-field"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" /><SlidersHorizontal size={18} /></label><div className="filter-row">{(['All', 'Success', 'Pending', 'Failed'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>{Object.entries(grouped).map(([date, groupItems]) => <section className="transaction-group" key={date}><div className="group-label">{date}<span>{groupItems.length} payment{groupItems.length > 1 ? 's' : ''}</span></div><Card><TransactionList items={groupItems} onSelect={(transaction) => navigate(`/transactions/${transaction.id}`)} /></Card></section>)}{!Object.keys(grouped).length && <Card><TransactionList items={[]} onSelect={() => undefined} /></Card>}</div>
}
