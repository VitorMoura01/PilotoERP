from pydantic import BaseModel

class MenuItemBase(BaseModel):
    name: str
    price: float
    cost: float
    category: str | None
    is_available: bool

class MenuItemCreate(MenuItemBase):
    restaurant_id: int

class MenuItemResponse(MenuItemBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True
