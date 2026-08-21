from datetime import datetime, timezone
from enum import StrEnum

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class TransactionType(StrEnum):
    SEND = 'SEND'
    RECEIVE = 'RECEIVE'
    BILL_PAYMENT = 'BILL_PAYMENT'
    RECHARGE = 'RECHARGE'


class TransactionStatus(StrEnum):
    SUCCESS = 'SUCCESS'
    PENDING = 'PENDING'
    FAILED = 'FAILED'


class PaymentMethod(StrEnum):
    UPI = 'UPI'
    WALLET = 'WALLET'
    BANK_ACCOUNT = 'BANK_ACCOUNT'


class Transaction(Base):
    __tablename__ = 'transactions'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False, index=True)
    recipient_id: Mapped[int | None] = mapped_column(ForeignKey('recipients.id'), index=True)
    recipient_name: Mapped[str] = mapped_column(String(120), nullable=False)
    recipient_upi_id: Mapped[str] = mapped_column(String(160), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), nullable=False, index=True)
    status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus), nullable=False, index=True)
    payment_method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)
    transaction_reference: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    user: Mapped['User'] = relationship(back_populates='transactions')
    recipient: Mapped['Recipient | None'] = relationship(back_populates='transactions')
