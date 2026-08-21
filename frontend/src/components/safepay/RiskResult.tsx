import { AlertTriangle, CheckCircle2, ChevronDown, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import type { RiskEvaluationResponse } from '../../types/api'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

interface RiskResultProps { result: RiskEvaluationResponse; onContinue: () => void; onCancel: () => void }

const levelCopy = {
  LOW: { icon: CheckCircle2, title: 'Payment looks okay', subtitle: 'Low risk based on the available transaction signals.', action: 'Continue Payment' },
  MEDIUM: { icon: AlertTriangle, title: 'Review this payment', subtitle: 'SafePay noticed something slightly unusual.', action: 'Review & Continue' },
  HIGH: { icon: ShieldAlert, title: 'Something looks unusual', subtitle: 'SafePay noticed a few unusual payment signals.', action: 'Continue Anyway' },
}

export function RiskResult({ result, onContinue, onCancel }: RiskResultProps) {
  const [expanded, setExpanded] = useState(false)
  const copy = levelCopy[result.risk_level]
  const Icon = copy.icon
  return <div className={`risk-result risk-${result.risk_level.toLowerCase()}`}>
    <Card className="risk-summary"><span className="risk-icon"><Icon size={25} /></span><span className="micro-label">SafePay assessment</span><h2>{copy.title}</h2><p>{copy.subtitle}</p><div className="risk-meter"><span>Risk: <strong>{result.risk_level.charAt(0) + result.risk_level.slice(1).toLowerCase()}</strong></span><b>{result.risk_score}/100</b></div></Card>
    <button className="why-risk-button" onClick={() => setExpanded(!expanded)}>Why is this risky? <ChevronDown size={16} className={expanded ? 'rotated' : ''} /></button>
    {expanded && <Card className="signal-list"><span className="signal-list-title">What SafePay noticed</span>{result.signals.length ? result.signals.map((signal) => <div className="signal-item" key={signal.code}><span className="signal-warning"><AlertTriangle size={15} /></span><div><strong>{signal.title}</strong><p>{signal.description}</p></div></div>) : <p className="no-signals">No unusual signals were found in the available history.</p>}</Card>}
    <div className="risk-actions"><Button onClick={onContinue}>{copy.action}</Button><Button variant="quiet" onClick={onCancel}>Cancel</Button></div>
  </div>
}
