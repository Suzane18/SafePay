import type { HealthResponse } from '../types/api'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, { headers: { 'Content-Type': 'application/json', ...options?.headers }, ...options })
    if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
    return await response.json() as T
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Unable to connect to SafePay services')
    throw error
  }
}

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health')
}
