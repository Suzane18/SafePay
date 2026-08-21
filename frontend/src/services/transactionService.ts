import { apiRequest } from './api'
import type { ApiTransaction, SimulatePaymentRequest, SimulatePaymentResponse } from '../types/api'

export interface TransactionQuery { search?: string; status?: string; transactionType?: string; limit?: number; offset?: number }

export function getTransactions(query: TransactionQuery = {}): Promise<ApiTransaction[]> {
  const params = new URLSearchParams()
  if (query.search) params.set('search', query.search)
  if (query.status) params.set('status', query.status)
  if (query.transactionType) params.set('transaction_type', query.transactionType)
  if (query.limit !== undefined) params.set('limit', String(query.limit))
  if (query.offset !== undefined) params.set('offset', String(query.offset))
  const queryString = params.toString()
  return apiRequest<ApiTransaction[]>(`/transactions${queryString ? `?${queryString}` : ''}`)
}

export function getTransaction(transactionId: number): Promise<ApiTransaction> {
  return apiRequest<ApiTransaction>(`/transactions/${transactionId}`)
}

export function simulatePayment(payload: SimulatePaymentRequest): Promise<SimulatePaymentResponse> {
  return apiRequest<SimulatePaymentResponse>('/payments/simulate', { method: 'POST', body: JSON.stringify(payload) })
}
