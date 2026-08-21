from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import TransactionStatus, TransactionType
from app.schemas.transaction import TransactionResponse
from app.services.transaction_service import get_transaction, list_transactions

router = APIRouter(prefix='/transactions', tags=['transactions'])


@router.get('', response_model=list[TransactionResponse])
def get_transactions(
    search: str | None = None,
    transaction_status: TransactionStatus | None = Query(default=None, alias='status'),
    transaction_type: TransactionType | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    database_session: Session = Depends(get_db),
) -> list[TransactionResponse]:
    return list_transactions(database_session, search=search, status=transaction_status, transaction_type=transaction_type, limit=limit, offset=offset)


@router.get('/{transaction_id}', response_model=TransactionResponse)
def get_one_transaction(transaction_id: int, database_session: Session = Depends(get_db)) -> TransactionResponse:
    transaction = get_transaction(database_session, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Transaction not found')
    return transaction
