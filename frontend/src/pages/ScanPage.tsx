import { Camera, ImageUp, Keyboard, QrCode, ScanLine } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getRecipients } from '../services/recipientService'
import { mapRecipient } from '../utils/apiMappers'
import type { Recipient } from '../types/app'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ErrorState } from '../components/common/LoadingState'

export function ScanPage() {
  const navigate = useNavigate()
  const [demoActive, setDemoActive] = useState(false)
  const [merchant, setMerchant] = useState<Recipient | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { getRecipients().then((items) => setMerchant(mapRecipient(items.find((item) => item.name === 'Local Kirana Store') ?? items[0]))).catch(() => setError('Unable to load the demo QR recipient. Please try again.')) }, [])
  const useDemoQr = () => { if (!merchant) return; setDemoActive(true); navigate('/payments/confirm', { state: { recipient: merchant, amount: 350, note: 'Demo QR payment' } }) }
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  return <div className="page page-scan"><div className="scan-intro"><span className="micro-label">SafePay scanner</span><h1>Pay in a scan</h1><p>Point your camera at a QR code to pay securely.</p></div><div className="scanner-frame"><div className="scan-corner top-left" /><div className="scan-corner top-right" /><div className="scan-corner bottom-left" /><div className="scan-corner bottom-right" /><div className="scan-line" /><QrCode size={82} strokeWidth={1.2} /><span>Scan a QR code</span></div><div className="scan-actions"><button><span><ImageUp size={19} /></span>Upload QR</button><button><span><Keyboard size={19} /></span>Enter UPI ID manually</button></div><Card className="demo-qr-card"><div className="demo-qr-icon"><Camera size={20} /></div><div><strong>Trying a demo?</strong><p>Use a sample merchant QR to preview the payment flow.</p></div><Button variant="secondary" onClick={useDemoQr}>{demoActive ? 'Added' : 'Use Demo QR'}</Button></Card><div className="scan-note"><ScanLine size={14} /> Camera access is disabled in this prototype</div></div>
}
