import { apiRequest } from './api'
import type { RiskEvaluationRequest, RiskEvaluationResponse } from '../types/api'

export function evaluateRisk(payload: RiskEvaluationRequest): Promise<RiskEvaluationResponse> {
  return apiRequest<RiskEvaluationResponse>('/risk/evaluate', { method: 'POST', body: JSON.stringify(payload) })
}
