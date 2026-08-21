from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction import PaymentMethod, TransactionStatus, TransactionType


class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    recipient_id: int | None
    recipient_name: str
    recipient_upi_id: str
    amount: float
    transaction_type: TransactionType
    status: TransactionStatus
    payment_method: PaymentMethod
    note: str | None
    transaction_reference: str
    created_at: datetime


class SimulatePaymentRequest(BaseModel):
    recipient_id: int
    amount: float = Field(gt=0)
    note: str | None = Field(default=None, max_length=240)


class SimulatePaymentResponse(BaseModel):
    success: bool
    transaction: TransactionResponse
