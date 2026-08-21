from enum import StrEnum

from pydantic import BaseModel, Field


class RiskLevel(StrEnum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'


class RiskSeverity(StrEnum):
    LOW = 'LOW'
    MEDIUM = 'MEDIUM'
    HIGH = 'HIGH'


class RiskRecommendation(StrEnum):
    PROCEED = 'PROCEED'
    REVIEW = 'REVIEW'
    VERIFY_RECIPIENT = 'VERIFY_RECIPIENT'


class RiskSignalCode(StrEnum):
    NEW_RECIPIENT = 'NEW_RECIPIENT'
    RECIPIENT_AMOUNT_ANOMALY = 'RECIPIENT_AMOUNT_ANOMALY'
    USER_AMOUNT_ANOMALY = 'USER_AMOUNT_ANOMALY'
    UNUSUAL_PAYMENT_FREQUENCY = 'UNUSUAL_PAYMENT_FREQUENCY'
    POSSIBLE_DUPLICATE_PAYMENT = 'POSSIBLE_DUPLICATE_PAYMENT'
    FIRST_TIME_LARGE_PAYMENT = 'FIRST_TIME_LARGE_PAYMENT'


class RiskSignal(BaseModel):
    code: RiskSignalCode
    severity: RiskSeverity
    title: str
    description: str


class RiskEvaluationRequest(BaseModel):
    recipient_id: int
    amount: float = Field(gt=0)
    note: str | None = Field(default=None, max_length=240)


class RiskEvaluationResponse(BaseModel):
    risk_level: RiskLevel
    risk_score: int = Field(ge=0, le=100)
    recommendation: RiskRecommendation
    signals: list[RiskSignal]
    successful_recipient_payments: int
    recipient_median_amount: float | None
    recipient_max_amount: float | None
