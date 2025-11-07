from pydantic import BaseModel
from typing import Optional

class OrderItemBase(BaseModel):
    quantity: int
    unit_price: Optional[float] = None

class OrderItemCreate(OrderItemBase):
    order_id: int
    menu_item_id: int

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int
    menu_item_id: int

    class Config:
        from_attributes = True
