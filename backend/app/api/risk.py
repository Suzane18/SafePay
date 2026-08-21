from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.risk import RiskEvaluationRequest, RiskEvaluationResponse
from app.services.risk_service import evaluate_risk

router = APIRouter(prefix='/risk', tags=['risk'])


@router.post('/evaluate', response_model=RiskEvaluationResponse)
def evaluate_payment_risk(payload: RiskEvaluationRequest, database_session: Session = Depends(get_db)) -> RiskEvaluationResponse:
    try:
        return evaluate_risk(database_session, payload.recipient_id, payload.amount)
    except LookupError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Recipient not found') from error
