import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'
import { Header } from './Header'

export function AppShell() {
  return (
    <div className="browser-stage">
      <div className="mobile-app">
        <Header />
        <main className="screen-content"><Outlet /></main>
        <BottomNavigation />
      </div>
    </div>
  )
}
