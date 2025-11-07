from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.inventory_item import get_inventory_item, get_inventory_items_by_restaurant, create_inventory_item
from app.schemas.inventory_item import InventoryItemCreate, InventoryItemResponse
from typing import List

router = APIRouter()

@router.post("/inventory-items/", response_model=InventoryItemResponse)
def create_new_inventory_item(inventory_item: InventoryItemCreate, db: Session = Depends(get_db)):
    return create_inventory_item(db, inventory_item=inventory_item)

@router.get("/inventory-items/{inventory_item_id}", response_model=InventoryItemResponse)
def read_inventory_item(inventory_item_id: int, db: Session = Depends(get_db)):
    db_inventory_item = get_inventory_item(db, inventory_item_id=inventory_item_id)
    if db_inventory_item is None:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return db_inventory_item

@router.get("/inventory-items/restaurant/{restaurant_id}", response_model=List[InventoryItemResponse])
def read_inventory_items_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    return get_inventory_items_by_restaurant(db, restaurant_id=restaurant_id)
