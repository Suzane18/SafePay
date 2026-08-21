import type { Recipient, Transaction, User } from '../types/app'

export const currentUser: User = {
  name: 'Aarav Mehta',
  phone: '+91 98••• 4821',
  initials: 'AM',
  accountLabel: 'SafePay Wallet •••• 2048',
  balance: 24580.5,
}

export const recipients: Recipient[] = [
  { id: 'rahul', name: 'Rahul Sharma', upiId: 'rahul.sharma@okaxis', initials: 'RS', accent: '#246bce', category: 'Friend' },
  { id: 'priya', name: 'Priya Reddy', upiId: 'priya.reddy@ybl', initials: 'PR', accent: '#d27655', category: 'Friend' },
  { id: 'arjun', name: 'Arjun Kumar', upiId: 'arjun.kumar@oksbi', initials: 'AK', accent: '#6573c3', category: 'Friend' },
  { id: 'mom', name: 'Mom', upiId: 'mom.mehta@okhdfcbank', initials: 'M', accent: '#e0a052', category: 'Family' },
  { id: 'kirana', name: 'Local Kirana Store', upiId: 'localstore@paytm', initials: 'LK', accent: '#438b72', category: 'Shop' },
]

export const transactions: Transaction[] = [
  { id: 'tx-1001', name: 'Swiggy', upiId: 'swiggy@axisbank', initials: 'S', accent: '#ed774c', amount: 486, direction: 'Paid', status: 'Success', type: 'Food & Dining', date: 'Today', time: '1:42 PM', note: 'Lunch order', method: 'SafePay Wallet' },
  { id: 'tx-1002', name: 'Rahul Sharma', upiId: 'rahul.sharma@okaxis', initials: 'RS', accent: '#246bce', amount: 1200, direction: 'Received', status: 'Success', type: 'Transfer', date: 'Today', time: '11:18 AM', note: 'Weekend plans', method: 'HDFC Bank •••• 8821' },
  { id: 'tx-1003', name: 'Amazon', upiId: 'amazon@apl', initials: 'A', accent: '#e0a052', amount: 2199, direction: 'Paid', status: 'Pending', type: 'Shopping', date: 'Yesterday', time: '8:05 PM', note: 'Order #408-921', method: 'SafePay Wallet' },
  { id: 'tx-1004', name: 'Priya Stores', upiId: 'priyastores@okicici', initials: 'PS', accent: '#6573c3', amount: 780, direction: 'Paid', status: 'Success', type: 'Shopping', date: 'Yesterday', time: '6:36 PM', note: 'Household supplies', method: 'SafePay Wallet' },
  { id: 'tx-1005', name: 'Electricity Board', upiId: 'bescom@paytm', initials: 'EB', accent: '#438b72', amount: 1425, direction: 'Paid', status: 'Success', type: 'Bills', date: '12 Aug 2026', time: '9:12 AM', note: 'July bill', method: 'HDFC Bank •••• 8821' },
  { id: 'tx-1006', name: 'Metro Recharge', upiId: 'namma.metro@upi', initials: 'MR', accent: '#246bce', amount: 500, direction: 'Paid', status: 'Failed', type: 'Travel', date: '10 Aug 2026', time: '7:20 AM', note: 'Monthly pass', method: 'SafePay Wallet' },
]
