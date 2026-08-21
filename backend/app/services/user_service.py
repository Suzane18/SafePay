from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import User


DEMO_USER_ID = 1


def get_demo_user(database_session: Session) -> User:
    user = database_session.scalar(select(User).where(User.id == DEMO_USER_ID))
    if user is None:
        raise LookupError('Demo user was not initialized')
    return user
