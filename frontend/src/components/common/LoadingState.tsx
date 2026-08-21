import { LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Loading your SafePay data...' }: { label?: string }) {
  return <div className="loading-state" role="status"><LoaderCircle size={24} /><span>{label}</span></div>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="error-state" role="alert"><strong>{message}</strong>{onRetry && <button onClick={onRetry}>Try again</button>}</div>
}
