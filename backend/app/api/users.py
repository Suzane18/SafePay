from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserResponse
from app.services.user_service import get_demo_user

router = APIRouter(prefix='/users', tags=['users'])


@router.get('/me', response_model=UserResponse)
def get_current_user(database_session: Session = Depends(get_db)) -> UserResponse:
    try:
        return get_demo_user(database_session)
    except LookupError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail='Demo database is not initialized') from error
