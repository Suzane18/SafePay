from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Recipient


def list_recipients(database_session: Session) -> list[Recipient]:
    statement = select(Recipient).order_by(Recipient.is_favorite.desc(), Recipient.name.asc())
    return list(database_session.scalars(statement).all())


def get_recipient(database_session: Session, recipient_id: int) -> Recipient | None:
    return database_session.get(Recipient, recipient_id)
