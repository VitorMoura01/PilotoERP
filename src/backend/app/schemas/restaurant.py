from pydantic import BaseModel
from typing import List

class RestaurantBase(BaseModel):
    name: str

class RestaurantCreate(RestaurantBase):
    owner_id: int

class RestaurantResponse(RestaurantBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
