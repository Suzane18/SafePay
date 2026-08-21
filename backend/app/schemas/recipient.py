from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RecipientResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    upi_id: str
    phone: str | None
    avatar: str | None
    is_favorite: bool
    created_at: datetime
