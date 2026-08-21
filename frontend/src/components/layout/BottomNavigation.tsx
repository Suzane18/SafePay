import { ArrowDownToLine, Home, ScanLine, UserRound, WalletCards } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Payments', to: '/payments', icon: WalletCards },
  { label: 'Scan', to: '/scan', icon: ScanLine, featured: true },
  { label: 'Transactions', to: '/transactions', icon: ArrowDownToLine },
  { label: 'Profile', to: '/profile', icon: UserRound },
]

export function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navigation.map(({ label, to, icon: Icon, featured }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${featured ? 'nav-item-featured' : ''} ${isActive ? 'active' : ''}`}>
          <span className="nav-icon"><Icon size={featured ? 22 : 19} strokeWidth={featured ? 2.4 : 2} /></span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
