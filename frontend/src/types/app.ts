export type TransactionStatus = 'Success' | 'Pending' | 'Failed'
export type TransactionDirection = 'Paid' | 'Received'

export interface User {
  name: string
  phone: string
  initials: string
  accountLabel: string
  balance: number
}

export interface Recipient {
  id: string
  name: string
  upiId: string
  initials: string
  accent: string
  category: string
}

export interface Transaction {
  id: string
  name: string
  upiId: string
  initials: string
  accent: string
  amount: number
  direction: TransactionDirection
  status: TransactionStatus
  type: string
  date: string
  time: string
  note: string
  method: string
}
