from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InventoryItemBase(BaseModel):
    name: str
    quantity: float
    unit: str
    unit_cost: Optional[float] = None
    min_threshold: float
    last_updated: datetime

class InventoryItemCreate(InventoryItemBase):
    restaurant_id: int

class InventoryItemResponse(InventoryItemBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True
