import type { TransactionStatus as Status } from '../../types/app'

export function TransactionStatus({ status }: { status: Status }) {
  return <span className={`transaction-status status-${status.toLowerCase()}`}><i />{status}</span>
}
