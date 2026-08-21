from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models import PaymentMethod, Recipient, Transaction, TransactionStatus, TransactionType
from app.services.user_service import DEMO_USER_ID


def list_transactions(
	database_session: Session,
	*,
	search: str | None = None,
	status: TransactionStatus | None = None,
	transaction_type: TransactionType | None = None,
	limit: int = 20,
	offset: int = 0,
) -> list[Transaction]:
	statement = select(Transaction).where(Transaction.user_id == DEMO_USER_ID)
	if search:
		search_term = f'%{search}%'
		statement = statement.where(or_(Transaction.recipient_name.ilike(search_term), Transaction.recipient_upi_id.ilike(search_term), Transaction.note.ilike(search_term)))
	if status:
		statement = statement.where(Transaction.status == status)
	if transaction_type:
		statement = statement.where(Transaction.transaction_type == transaction_type)
	statement = statement.order_by(Transaction.created_at.desc()).offset(offset).limit(limit)
	return list(database_session.scalars(statement).all())


def get_transaction(database_session: Session, transaction_id: int) -> Transaction | None:
	transaction = database_session.get(Transaction, transaction_id)
	if transaction is None or transaction.user_id != DEMO_USER_ID:
		return None
	return transaction


def create_simulated_transaction(database_session: Session, recipient_id: int, amount: float, note: str | None) -> Transaction:
	recipient = database_session.get(Recipient, recipient_id)
	if recipient is None:
		raise LookupError('Recipient not found')
	latest_id = database_session.scalar(select(Transaction.id).order_by(Transaction.id.desc())) or 0
	transaction = Transaction(
		user_id=DEMO_USER_ID,
		recipient_id=recipient.id,
		recipient_name=recipient.name,
		recipient_upi_id=recipient.upi_id,
		amount=amount,
		transaction_type=TransactionType.SEND,
		status=TransactionStatus.SUCCESS,
		payment_method=PaymentMethod.WALLET,
		note=note,
		transaction_reference=f'SPTXN-SIM-{latest_id + 1:06d}',
	)
	database_session.add(transaction)
	database_session.commit()
	database_session.refresh(transaction)
	return transaction
