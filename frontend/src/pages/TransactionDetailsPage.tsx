import { ArrowDownLeft, CalendarDays, Copy, Download, Flag, Hash, Landmark, RefreshCcw, StickyNote, UserRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTransaction } from '../services/transactionService'
import { mapTransaction } from '../utils/apiMappers'
import type { Transaction } from '../types/app'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { TransactionStatus } from '../components/transactions/TransactionStatus'
import { ErrorState, LoadingState } from '../components/common/LoadingState'

export function TransactionDetailsPage() {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { const id = Number(transactionId); if (!Number.isInteger(id)) { setError('Transaction not found.'); return } getTransaction(id).then((item) => setTransaction(mapTransaction(item))).catch(() => setError('Unable to load this transaction. Please try again.')) }, [transactionId])
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => navigate('/transactions')} /></div>
  if (!transaction) return <LoadingState label="Loading transaction details..." />
  return <div className="page page-details"><div className={`detail-status detail-${transaction.status.toLowerCase()}`}><span className="detail-status-icon">{transaction.status === 'Success' ? <ArrowDownLeft size={25} /> : <RefreshCcw size={24} />}</span><strong>{transaction.status === 'Success' ? 'Payment successful' : `Payment ${transaction.status.toLowerCase()}`}</strong><span>{transaction.date} · {transaction.time}</span></div><Card className="detail-amount"><span>{transaction.direction === 'Received' ? 'Received from' : 'Paid to'}</span><strong>{transaction.direction === 'Received' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}</strong><TransactionStatus status={transaction.status} /></Card><Card className="detail-info"><div className="detail-person"><Avatar initials={transaction.initials} accent={transaction.accent} size="large" /><div><strong>{transaction.name}</strong><span>{transaction.upiId}</span></div></div><div className="info-row"><UserRound size={17} /><span>Transaction type</span><b>{transaction.type}</b></div><div className="info-row"><Landmark size={17} /><span>Payment method</span><b>{transaction.method}</b></div><div className="info-row"><CalendarDays size={17} /><span>Date & time</span><b>{transaction.date} · {transaction.time}</b></div><div className="info-row"><StickyNote size={17} /><span>Note</span><b>{transaction.note}</b></div><div className="info-row"><Hash size={17} /><span>Transaction ID</span><b className="id-value">{transaction.id}<Copy size={14} /></b></div></Card><div className="detail-actions"><Button variant="secondary"><Download size={17} />Download Receipt</Button><Button variant="quiet"><Flag size={17} />Report Issue</Button><Button onClick={() => navigate('/payments')}>Pay Again</Button></div></div>
}
