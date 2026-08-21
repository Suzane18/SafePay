from datetime import datetime, timedelta

from app.models import PaymentMethod, Transaction, TransactionStatus, TransactionType
from app.schemas.risk import RiskLevel, RiskRecommendation, RiskSignalCode
from app.services.risk_engine import evaluate_payment

NOW = datetime(2026, 8, 21, 13, 42)


def payment(name: str, amount: float, *, minutes_ago: int = 60, status: TransactionStatus = TransactionStatus.SUCCESS) -> Transaction:
    return Transaction(
        user_id=1,
        recipient_id=1,
        recipient_name=name,
        recipient_upi_id=f'{name.lower().replace(" ", ".")}@upi',
        amount=amount,
        transaction_type=TransactionType.SEND,
        status=status,
        payment_method=PaymentMethod.WALLET,
        transaction_reference=f'TEST-{name}-{amount}-{minutes_ago}',
        created_at=NOW - timedelta(minutes=minutes_ago),
    )


def codes(result):
    return {signal.code for signal in result.signals}


def test_low_risk_normal_payment() -> None:
    result = evaluate_payment(recipient_name='Rahul Sharma', amount=800, history=[payment('Rahul Sharma', value, minutes_ago=minutes) for value, minutes in [(500, 100), (700, 200), (1000, 300), (800, 400)]], now=NOW)
    assert result.risk_level == RiskLevel.LOW
    assert result.risk_score == 0
    assert result.recommendation == RiskRecommendation.PROCEED


def test_new_recipient() -> None:
    result = evaluate_payment(recipient_name='Demo Merchant', amount=500, history=[payment('Rahul Sharma', 800)], now=NOW)
    assert RiskSignalCode.NEW_RECIPIENT in codes(result)
    assert result.risk_level == RiskLevel.MEDIUM


def test_recipient_amount_anomaly() -> None:
    result = evaluate_payment(recipient_name='Rahul Sharma', amount=25000, history=[payment('Rahul Sharma', value, minutes_ago=index * 100) for index, value in enumerate([500, 700, 1000, 800], start=1)], now=NOW)
    assert RiskSignalCode.RECIPIENT_AMOUNT_ANOMALY in codes(result)
    assert result.risk_level == RiskLevel.HIGH


def test_user_amount_anomaly() -> None:
    result = evaluate_payment(recipient_name='Priya Reddy', amount=20000, history=[payment('Rahul Sharma', value, minutes_ago=index * 100) for index, value in enumerate([300, 500, 800, 1200], start=1)], now=NOW)
    assert RiskSignalCode.NEW_RECIPIENT in codes(result)
    assert RiskSignalCode.USER_AMOUNT_ANOMALY in codes(result)
    assert result.risk_level == RiskLevel.HIGH


def test_unusual_payment_frequency() -> None:
    result = evaluate_payment(recipient_name='Rahul Sharma', amount=800, history=[payment('Rahul Sharma', 800, minutes_ago=value) for value in [5, 10, 20]], now=NOW)
    assert RiskSignalCode.UNUSUAL_PAYMENT_FREQUENCY in codes(result)


def test_duplicate_payment() -> None:
    result = evaluate_payment(recipient_name='Rahul Sharma', amount=2500, history=[payment('Rahul Sharma', 2500, minutes_ago=3)], now=NOW)
    assert RiskSignalCode.POSSIBLE_DUPLICATE_PAYMENT in codes(result)
    assert result.risk_level == RiskLevel.HIGH


def test_first_time_large_payment() -> None:
    result = evaluate_payment(recipient_name='Demo Merchant', amount=25000, history=[payment('Rahul Sharma', value, minutes_ago=index * 100) for index, value in enumerate([300, 500, 800, 1200], start=1)], now=NOW)
    assert RiskSignalCode.FIRST_TIME_LARGE_PAYMENT in codes(result)
    assert result.risk_level == RiskLevel.HIGH
    assert result.recommendation == RiskRecommendation.VERIFY_RECIPIENT


def test_score_is_capped_and_recommendation_is_derived() -> None:
    result = evaluate_payment(recipient_name='Demo Merchant', amount=25000, history=[payment('Rahul Sharma', value, minutes_ago=value) for value in [1, 2, 3]], now=NOW)
    assert result.risk_score == 100
    assert result.risk_level == RiskLevel.HIGH
    assert result.recommendation == RiskRecommendation.VERIFY_RECIPIENT
