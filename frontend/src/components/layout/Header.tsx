import { Bell, ChevronLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../common/Avatar'

const titles: Record<string, string> = {
  '/': 'Good afternoon, Aarav',
  '/payments': 'Send money',
  '/payments/confirm': 'Review payment',
  '/scan': 'Scan & Pay',
  '/transactions': 'Transactions',
  '/profile': 'Profile',
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const title = titles[location.pathname] ?? (location.pathname.startsWith('/transactions/') ? 'Transaction details' : 'SafePay')

  return (
    <header className="app-header">
      {isHome ? <div className="safe-logo"><span>✦</span> SafePay</div> : <button className="icon-button" aria-label="Go back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>}
      <div className="header-title">{!isHome && title}</div>
      <div className="header-actions">
        {isHome && <span className="notification-wrap"><Bell size={20} /><i /></span>}
        {isHome && <button className="profile-button" aria-label="Open SafePay profile" onClick={() => navigate('/profile')}><Avatar initials="AM" accent="#1b62bf" size="small" /></button>}
        {!isHome && <span className="header-mark">SP</span>}
      </div>
    </header>
  )
}
