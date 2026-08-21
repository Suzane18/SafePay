import { apiRequest } from './api'
import type { ApiRecipient } from '../types/api'

export function getRecipients(): Promise<ApiRecipient[]> {
  return apiRequest<ApiRecipient[]>('/recipients')
}

export function getRecipient(recipientId: number): Promise<ApiRecipient> {
  return apiRequest<ApiRecipient>(`/recipients/${recipientId}`)
}
