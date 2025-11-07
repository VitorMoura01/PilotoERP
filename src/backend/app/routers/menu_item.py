from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.menu_item import get_menu_item, get_menu_items_by_restaurant, create_menu_item
from app.schemas.menu_item import MenuItemCreate, MenuItemResponse
from typing import List

router = APIRouter()

@router.post("/menu-items/", response_model=MenuItemResponse)
def create_new_menu_item(menu_item: MenuItemCreate, db: Session = Depends(get_db)):
    return create_menu_item(db, menu_item=menu_item)

@router.get("/menu-items/{menu_item_id}", response_model=MenuItemResponse)
def read_menu_item(menu_item_id: int, db: Session = Depends(get_db)):
    db_menu_item = get_menu_item(db, menu_item_id=menu_item_id)
    if db_menu_item is None:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return db_menu_item

@router.get("/menu-items/restaurant/{restaurant_id}", response_model=List[MenuItemResponse])
def read_menu_items_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    return get_menu_items_by_restaurant(db, restaurant_id=restaurant_id)
