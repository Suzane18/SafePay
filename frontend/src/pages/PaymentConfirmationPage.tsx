import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { simulatePayment } from '../services/transactionService'
import { evaluateRisk } from '../services/riskService'
import type { RiskEvaluationResponse } from '../types/api'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { PaymentSummary } from '../components/payment/PaymentSummary'
import type { Recipient } from '../types/app'
import { ErrorState } from '../components/common/LoadingState'
import { RiskResult } from '../components/safepay/RiskResult'

interface PaymentState { recipient?: Recipient; amount?: number; note?: string }

export function PaymentConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = (location.state ?? {}) as PaymentState
  const recipient = state.recipient
  const amount = state.amount ?? 0
  const [status, setStatus] = useState<'idle' | 'checking' | 'risk' | 'paying' | 'success'>('idle')
  const [riskResult, setRiskResult] = useState<RiskEvaluationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  if (!recipient) return <div className="page"><ErrorState message="This payment session is incomplete. Please choose a recipient again." onRetry={() => navigate('/payments')} /></div>
  const pay = () => { setStatus('checking'); setError(null); evaluateRisk({ recipient_id: Number(recipient.id), amount, note: state.note }).then((result) => { setRiskResult(result); setStatus('risk') }).catch(() => { setStatus('idle'); setError('Unable to complete the SafePay check. Please try again.') }) }
  const continuePayment = () => { setStatus('paying'); setError(null); simulatePayment({ recipient_id: Number(recipient.id), amount, note: state.note }).then(() => setStatus('success')).catch(() => { setStatus('risk'); setError('Unable to simulate this payment. Please try again.') }) }
  if (status === 'success') return <div className="page page-confirm payment-success"><div className="detail-status detail-success"><span className="detail-status-icon"><ShieldCheck size={25} /></span><strong>Payment simulated successfully</strong><span>SafePay recorded this demo transaction</span></div><Button onClick={() => navigate('/transactions')}>View transactions</Button><button className="edit-payment" onClick={() => navigate('/')}>Back to home</button></div>
  if (status === 'checking') return <div className="page page-confirm checking-state"><div className="checking-orb"><ShieldCheck size={34} /></div><span className="micro-label">SafePay protection</span><h2>SafePay is checking this payment...</h2><p>Reviewing the available transaction signals before anything is sent.</p></div>
  if (status === 'risk' && riskResult) return <div className="page page-confirm"><div className="confirm-kicker"><span><LockKeyhole size={13} /> SafePay result</span><small>Step 2 of 2</small></div>{error && <ErrorState message={error} />}{<RiskResult result={riskResult} onContinue={continuePayment} onCancel={() => { setStatus('idle'); setRiskResult(null) }} />}</div>
  return <div className="page page-confirm"><div className="confirm-kicker"><span><LockKeyhole size={13} /> Simulated payment</span><small>Step 1 of 2</small></div><PaymentSummary recipient={recipient} amount={amount} note={state.note ?? ''} /><Card className="check-placeholder"><div className="check-placeholder-icon"><ShieldCheck size={22} /></div><div><span className="micro-label">SafePay AI Check</span><strong>Before you pay, SafePay checks whether this payment looks unusual.</strong><p>Your payment will be reviewed here before the simulated payment is created.</p></div><ArrowRight size={18} className="muted-icon" /></Card>{error && <ErrorState message={error} />}<Button className="pay-button" disabled={!amount || status === 'paying'} onClick={pay}>{status === 'paying' ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}</Button><button className="edit-payment" onClick={() => navigate('/payments')}>Edit payment</button></div>
}
