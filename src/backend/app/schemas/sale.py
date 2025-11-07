from pydantic import BaseModel
from datetime import datetime

class SaleBase(BaseModel):
    amount: float
    timestamp: datetime

class SaleCreate(SaleBase):
    restaurant_id: int

class SaleResponse(SaleBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True
