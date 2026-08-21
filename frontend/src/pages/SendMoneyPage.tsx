import { AtSign, Search, UserRoundPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecipients } from '../services/recipientService'
import { mapRecipient } from '../utils/apiMappers'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { RecipientCard } from '../components/payment/RecipientCard'
import type { Recipient } from '../types/app'
import { ErrorState, LoadingState } from '../components/common/LoadingState'

export function SendMoneyPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filteredRecipients = useMemo(() => availableRecipients.filter((recipient) => `${recipient.name} ${recipient.upiId}`.toLowerCase().includes(query.toLowerCase())), [availableRecipients, query])
  const continueToConfirmation = () => { if (selectedRecipient && Number(amount) > 0) navigate('/payments/confirm', { state: { recipient: selectedRecipient, amount: Number(amount), note } }) }
  useEffect(() => { getRecipients().then((items) => setAvailableRecipients(items.map(mapRecipient))).catch(() => setError('Unable to load recipients. Please try again.')).finally(() => setLoading(false)) }, [])
  if (loading) return <LoadingState label="Loading your recipients..." />
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>

  return <div className="page page-payment"><div className="page-intro"><span className="micro-label">Quick & secure</span><h1>Who do you want to pay?</h1><p>Choose a contact or use their UPI ID.</p></div>
    <label className="search-field"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone or UPI ID" aria-label="Search recipient" /></label>
    <div className="payment-tabs"><button className="active">Contacts</button><button><AtSign size={15} /> UPI ID</button><button><UserRoundPlus size={15} /> New</button></div>
    <section><div className="mini-section-header"><span>Recent recipients</span><small>{filteredRecipients.length} saved</small></div><Card className="recipient-list">{filteredRecipients.map((recipient) => <RecipientCard key={recipient.id} recipient={recipient} onClick={() => setSelectedRecipient(recipient)} />)}</Card></section>
    {selectedRecipient && <Card className="amount-composer"><div className="selected-recipient"><Avatar initials={selectedRecipient.initials} accent={selectedRecipient.accent} size="small" /><div><strong>{selectedRecipient.name}</strong><small>{selectedRecipient.upiId}</small></div><button onClick={() => setSelectedRecipient(null)}>Change</button></div><label className="amount-field"><span>₹</span><input type="number" min="1" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value)} aria-label="Payment amount" autoFocus /></label><label className="note-field"><input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note (optional)" aria-label="Payment note" /></label><Button onClick={continueToConfirmation} disabled={!amount || Number(amount) <= 0}>Continue</Button></Card>}
  </div>
}
