"""Payment simulation boundary for the Phase 3 API."""

from sqlalchemy.orm import Session

from app.models import Transaction
from app.services.transaction_service import create_simulated_transaction


def simulate_payment(database_session: Session, recipient_id: int, amount: float, note: str | None) -> Transaction:
	return create_simulated_transaction(database_session, recipient_id, amount, note)
