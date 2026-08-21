import { Bell, ChevronRight, Fingerprint, HelpCircle, LockKeyhole, ShieldCheck, Smartphone, ToggleLeft } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getCurrentUser } from '../services/userService'
import { mapUser } from '../utils/apiMappers'
import type { User } from '../types/app'
import { Avatar } from '../components/common/Avatar'
import { Card } from '../components/common/Card'
import { ErrorState, LoadingState } from '../components/common/LoadingState'

const settings = [{ label: 'Payment settings', detail: 'Bank accounts & UPI IDs', icon: Smartphone }, { label: 'Security', detail: 'Passcode & biometrics', icon: Fingerprint }, { label: 'Notifications', detail: 'Payment alerts are on', icon: Bell }, { label: 'Help & support', detail: 'We are here to help', icon: HelpCircle }]

export function ProfilePage() {
  const [protectedPayments, setProtectedPayments] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => { getCurrentUser().then((apiUser) => setUser(mapUser(apiUser))).catch(() => setError('Unable to load your profile. Please try again.')) }, [])
  if (error) return <div className="page"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>
  if (!user) return <LoadingState label="Loading your profile..." />
  return <div className="page page-profile"><div className="profile-hero"><Avatar initials={user.initials} accent="#246bce" size="large" /><div><h1>{user.name}</h1><p>{user.phone}</p></div><button className="edit-profile">Edit</button></div><Card className="protection-setting"><div className="setting-leading"><span className="protection-setting-icon"><ShieldCheck size={20} /></span><div><strong>SafePay Protection</strong><p>AI-assisted payment safety checks</p></div></div><button className={`toggle ${protectedPayments ? 'on' : ''}`} role="switch" aria-checked={protectedPayments} aria-label="Toggle SafePay Protection" onClick={() => setProtectedPayments(!protectedPayments)}><span /></button></Card><section><span className="section-caption">Settings</span><Card className="settings-list">{settings.map(({ label, detail, icon: Icon }) => <button className="setting-row" key={label}><span className="setting-icon"><Icon size={18} /></span><span><strong>{label}</strong><small>{detail}</small></span><ChevronRight size={17} className="muted-icon" /></button>)}</Card></section><div className="profile-security"><LockKeyhole size={15} /> SafePay keeps your simulated payments private</div><span className="profile-version">SafePay prototype · v0.2</span></div>
}
