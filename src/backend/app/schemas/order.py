from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class OrderItemResponse(BaseModel):
    id: int
    menu_item_id: int
    quantity: int
    unit_price: Optional[float] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    customer_name: str | None
    total_amount: float
    timestamp: datetime
    status: str

class OrderCreate(OrderBase):
    restaurant_id: int

class OrderResponse(OrderBase):
    id: int
    restaurant_id: int
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
