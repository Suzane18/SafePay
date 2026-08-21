from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.recipient import RecipientResponse
from app.services.recipient_service import get_recipient, list_recipients

router = APIRouter(prefix='/recipients', tags=['recipients'])


@router.get('', response_model=list[RecipientResponse])
def get_recipients(database_session: Session = Depends(get_db)) -> list[RecipientResponse]:
    return list_recipients(database_session)


@router.get('/{recipient_id}', response_model=RecipientResponse)
def get_one_recipient(recipient_id: int, database_session: Session = Depends(get_db)) -> RecipientResponse:
    recipient = get_recipient(database_session, recipient_id)
    if recipient is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Recipient not found')
    return recipient
