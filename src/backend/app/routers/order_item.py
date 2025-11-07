from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.order_item import get_order_item, get_order_items_by_order, create_order_item
from app.schemas.order_item import OrderItemCreate, OrderItemResponse
from typing import List

router = APIRouter()

@router.post("/order-items/", response_model=OrderItemResponse)
def create_new_order_item(order_item: OrderItemCreate, db: Session = Depends(get_db)):
    return create_order_item(db, order_item=order_item)

@router.get("/order-items/{order_item_id}", response_model=OrderItemResponse)
def read_order_item(order_item_id: int, db: Session = Depends(get_db)):
    db_order_item = get_order_item(db, order_item_id=order_item_id)
    if db_order_item is None:
        raise HTTPException(status_code=404, detail="Order item not found")
    return db_order_item

@router.get("/order-items/order/{order_id}", response_model=List[OrderItemResponse])
def read_order_items_by_order(order_id: int, db: Session = Depends(get_db)):
    return get_order_items_by_order(db, order_id=order_id)
