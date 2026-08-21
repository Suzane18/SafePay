import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { PaymentConfirmationPage } from './pages/PaymentConfirmationPage'
import { ProfilePage } from './pages/ProfilePage'
import { ScanPage } from './pages/ScanPage'
import { SendMoneyPage } from './pages/SendMoneyPage'
import { TransactionDetailsPage } from './pages/TransactionDetailsPage'
import { TransactionsPage } from './pages/TransactionsPage'

function App() {
  return <BrowserRouter><Routes><Route element={<AppShell />}><Route path="/" element={<HomePage />} /><Route path="/payments" element={<SendMoneyPage />} /><Route path="/payments/confirm" element={<PaymentConfirmationPage />} /><Route path="/scan" element={<ScanPage />} /><Route path="/transactions" element={<TransactionsPage />} /><Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes></BrowserRouter>
}

export default App
