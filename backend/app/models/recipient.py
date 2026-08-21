from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Recipient(Base):
    __tablename__ = 'recipients'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    upi_id: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30))
    avatar: Mapped[str | None] = mapped_column(String(20))
    is_favorite: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    transactions: Mapped[list['Transaction']] = relationship(back_populates='recipient')
