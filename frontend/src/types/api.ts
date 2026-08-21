export interface HealthResponse { status: string; service: string }
export interface ApiUser { id: number; name: string; phone: string; email: string; avatar: string | null; created_at: string }
export interface ApiRecipient { id: number; name: string; upi_id: string; phone: string | null; avatar: string | null; is_favorite: boolean; created_at: string }
export type ApiTransactionType = 'SEND' | 'RECEIVE' | 'BILL_PAYMENT' | 'RECHARGE'
export type ApiTransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED'
export type ApiPaymentMethod = 'UPI' | 'WALLET' | 'BANK_ACCOUNT'
export interface ApiTransaction { id: number; user_id: number; recipient_id: number | null; recipient_name: string; recipient_upi_id: string; amount: number; transaction_type: ApiTransactionType; status: ApiTransactionStatus; payment_method: ApiPaymentMethod; note: string | null; transaction_reference: string; created_at: string }
export interface SimulatePaymentRequest { recipient_id: number; amount: number; note?: string }
export interface SimulatePaymentResponse { success: boolean; transaction: ApiTransaction }
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH'
export type RiskRecommendation = 'PROCEED' | 'REVIEW' | 'VERIFY_RECIPIENT'
export type RiskSignalCode = 'NEW_RECIPIENT' | 'RECIPIENT_AMOUNT_ANOMALY' | 'USER_AMOUNT_ANOMALY' | 'UNUSUAL_PAYMENT_FREQUENCY' | 'POSSIBLE_DUPLICATE_PAYMENT' | 'FIRST_TIME_LARGE_PAYMENT'
export interface RiskSignal { code: RiskSignalCode; severity: RiskSeverity; title: string; description: string }
export interface RiskEvaluationRequest { recipient_id: number; amount: number; note?: string }
export interface RiskEvaluationResponse { risk_level: RiskLevel; risk_score: number; recommendation: RiskRecommendation; signals: RiskSignal[]; successful_recipient_payments: number; recipient_median_amount: number | null; recipient_max_amount: number | null }
