import type { ApiRecipient, ApiTransaction, ApiUser } from '../types/api'
import type { Recipient, Transaction, User } from '../types/app'

const accents = ['#246bce', '#d27655', '#6573c3', '#e0a052', '#438b72', '#ed774c']
function accentFor(id: number) { return accents[id % accents.length] }
function initialsFor(name: string) { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }

export function mapUser(user: ApiUser): User { return { name: user.name, phone: user.phone, initials: user.avatar ?? initialsFor(user.name), accountLabel: 'SafePay Wallet •••• 2048', balance: 24580.5 } }
export function mapRecipient(recipient: ApiRecipient): Recipient { return { id: String(recipient.id), name: recipient.name, upiId: recipient.upi_id, initials: recipient.avatar ?? initialsFor(recipient.name), accent: accentFor(recipient.id), category: recipient.is_favorite ? 'Favorite' : 'Contact' } }
export function mapTransaction(transaction: ApiTransaction): Transaction { return { id: String(transaction.id), name: transaction.recipient_name, upiId: transaction.recipient_upi_id, initials: initialsFor(transaction.recipient_name), accent: accentFor(transaction.recipient_id ?? transaction.id), amount: Number(transaction.amount), direction: transaction.transaction_type === 'RECEIVE' ? 'Received' : 'Paid', status: transaction.status === 'SUCCESS' ? 'Success' : transaction.status === 'PENDING' ? 'Pending' : 'Failed', type: transaction.transaction_type === 'BILL_PAYMENT' ? 'Bills' : transaction.transaction_type === 'RECHARGE' ? 'Recharge' : 'Transfer', date: formatDate(transaction.created_at), time: formatTime(transaction.created_at), note: transaction.note ?? '', method: transaction.payment_method } }
function formatDate(value: string) { const date = new Date(value); const today = new Date('2026-08-21T23:59:59'); const difference = Math.floor((today.getTime() - date.getTime()) / 86400000); return difference === 0 ? 'Today' : difference === 1 ? 'Yesterday' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
function formatTime(value: string) { return new Date(value).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }) }
