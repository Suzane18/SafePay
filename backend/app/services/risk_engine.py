from dataclasses import dataclass
from datetime import datetime, timedelta
from statistics import median

from app.models import Transaction, TransactionStatus
from app.schemas.risk import RiskLevel, RiskRecommendation, RiskSeverity, RiskSignal, RiskSignalCode

RISK_WEIGHTS: dict[RiskSignalCode, int] = {
    RiskSignalCode.NEW_RECIPIENT: 35,
    RiskSignalCode.RECIPIENT_AMOUNT_ANOMALY: 30,
    RiskSignalCode.USER_AMOUNT_ANOMALY: 30,
    RiskSignalCode.UNUSUAL_PAYMENT_FREQUENCY: 10,
    RiskSignalCode.POSSIBLE_DUPLICATE_PAYMENT: 60,
    RiskSignalCode.FIRST_TIME_LARGE_PAYMENT: 40,
}
LOW_RISK_MAX = 29
MEDIUM_RISK_MAX = 59
DUPLICATE_WINDOW = timedelta(minutes=5)
FREQUENCY_WINDOW = timedelta(minutes=30)
FREQUENCY_COUNT_THRESHOLD = 3
LARGE_PAYMENT_MULTIPLIER = 5.0


@dataclass(frozen=True)
class RiskEvaluation:
    risk_level: RiskLevel
    risk_score: int
    recommendation: RiskRecommendation
    signals: list[RiskSignal]
    successful_recipient_payments: int
    recipient_median_amount: float | None
    recipient_max_amount: float | None


def evaluate_payment(
    *,
    recipient_name: str,
    amount: float,
    history: list[Transaction],
    now: datetime,
) -> RiskEvaluation:
    successful = [item for item in history if item.status == TransactionStatus.SUCCESS]
    recipient_history = [item for item in successful if item.recipient_name == recipient_name and item.transaction_type.value == 'SEND']
    user_amounts = [float(item.amount) for item in successful if item.transaction_type.value in {'SEND', 'BILL_PAYMENT', 'RECHARGE'}]
    recipient_amounts = [float(item.amount) for item in recipient_history]
    recipient_median = median(recipient_amounts) if recipient_amounts else None
    recipient_max = max(recipient_amounts) if recipient_amounts else None
    user_median = median(user_amounts) if user_amounts else None
    signals: list[RiskSignal] = []
    is_new_recipient = not recipient_history

    if is_new_recipient:
        signals.append(RiskSignal(code=RiskSignalCode.NEW_RECIPIENT, severity=RiskSeverity.HIGH, title='First-time recipient', description='You have never made a successful payment to this recipient before.'))

    recipient_anomaly = bool(recipient_median and amount > recipient_median * 3 and (recipient_max is None or amount >= recipient_max))
    if recipient_anomaly:
        signals.append(RiskSignal(code=RiskSignalCode.RECIPIENT_AMOUNT_ANOMALY, severity=RiskSeverity.HIGH, title='Unusually large payment', description=f'You usually pay this recipient around ₹{recipient_median:,.0f}. This payment is ₹{amount:,.0f}.'))

    user_anomaly = bool(user_median and amount > user_median * LARGE_PAYMENT_MULTIPLIER)
    if user_anomaly:
        severity = RiskSeverity.HIGH if amount > user_median * 15 else RiskSeverity.MEDIUM
        signals.append(RiskSignal(code=RiskSignalCode.USER_AMOUNT_ANOMALY, severity=severity, title='Higher than your usual payment', description=f'This payment is much larger than your usual payment of around ₹{user_median:,.0f}.'))

    recent_successes = [item for item in successful if now - item.created_at <= FREQUENCY_WINDOW and item.created_at <= now]
    if len(recent_successes) >= FREQUENCY_COUNT_THRESHOLD:
        signals.append(RiskSignal(code=RiskSignalCode.UNUSUAL_PAYMENT_FREQUENCY, severity=RiskSeverity.MEDIUM, title='Several recent payments', description='You have made several successful payments in a short period.'))

    duplicate = next((item for item in recipient_history if now - item.created_at <= DUPLICATE_WINDOW and item.created_at <= now and float(item.amount) == amount), None)
    if duplicate:
        signals.append(RiskSignal(code=RiskSignalCode.POSSIBLE_DUPLICATE_PAYMENT, severity=RiskSeverity.HIGH, title='Possible duplicate payment', description=f'A similar ₹{amount:,.0f} payment to {recipient_name} was made a few minutes ago.'))

    if is_new_recipient and user_median and amount > user_median * LARGE_PAYMENT_MULTIPLIER:
        signals.append(RiskSignal(code=RiskSignalCode.FIRST_TIME_LARGE_PAYMENT, severity=RiskSeverity.HIGH, title='Large first-time payment', description='This is a large payment to a recipient you have not paid before.'))

    score = min(100, sum(RISK_WEIGHTS[signal.code] for signal in signals))
    risk_level = RiskLevel.LOW if score <= LOW_RISK_MAX else RiskLevel.MEDIUM if score <= MEDIUM_RISK_MAX else RiskLevel.HIGH
    recommendation = RiskRecommendation.PROCEED if risk_level == RiskLevel.LOW else RiskRecommendation.REVIEW if risk_level == RiskLevel.MEDIUM else RiskRecommendation.VERIFY_RECIPIENT
    return RiskEvaluation(risk_level, score, recommendation, signals, len(recipient_history), float(recipient_median) if recipient_median else None, recipient_max)
