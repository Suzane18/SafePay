from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.transaction import SimulatePaymentRequest, SimulatePaymentResponse
from app.services.payment_service import simulate_payment as run_payment_simulation

router = APIRouter(prefix='/payments', tags=['payments'])


@router.post('/simulate', response_model=SimulatePaymentResponse)
def simulate_payment(payload: SimulatePaymentRequest, database_session: Session = Depends(get_db)) -> SimulatePaymentResponse:
    try:
        transaction = run_payment_simulation(database_session, payload.recipient_id, payload.amount, payload.note)
    except LookupError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Recipient not found') from error
    return SimulatePaymentResponse(success=True, transaction=transaction)
