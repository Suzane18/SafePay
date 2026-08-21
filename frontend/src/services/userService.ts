import { apiRequest } from './api'
import type { ApiUser } from '../types/api'

export function getCurrentUser(): Promise<ApiUser> {
  return apiRequest<ApiUser>('/users/me')
}
