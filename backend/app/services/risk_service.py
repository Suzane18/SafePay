from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Recipient, Transaction
from app.schemas.risk import RiskEvaluationResponse
from app.services.risk_engine import evaluate_payment
from app.services.user_service import DEMO_USER_ID


def evaluate_risk(database_session: Session, recipient_id: int, amount: float) -> RiskEvaluationResponse:
	recipient = database_session.get(Recipient, recipient_id)
	if recipient is None:
		raise LookupError('Recipient not found')
	history_statement = select(Transaction).where(Transaction.user_id == DEMO_USER_ID).order_by(Transaction.created_at.desc())
	history = list(database_session.scalars(history_statement).all())
	result = evaluate_payment(recipient_name=recipient.name, amount=amount, history=history, now=datetime.now(timezone.utc).replace(tzinfo=None))
	return RiskEvaluationResponse(
		risk_level=result.risk_level,
		risk_score=result.risk_score,
		recommendation=result.recommendation,
		signals=result.signals,
		successful_recipient_payments=result.successful_recipient_payments,
		recipient_median_amount=result.recipient_median_amount,
		recipient_max_amount=result.recipient_max_amount,
	)
