from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.order import get_order, get_orders_by_restaurant, create_order, get_orders
from app.schemas.order import OrderCreate, OrderResponse
from app.schemas.order_item import OrderItemCreate
from typing import List

router = APIRouter()

@router.post("/orders/", response_model=OrderResponse)
def create_new_order(order: OrderCreate, items: List[OrderItemCreate], db: Session = Depends(get_db)):
    return create_order(db, order=order, items=items)

@router.get("/orders/{order_id}", response_model=OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.get("/orders/restaurant/{restaurant_id}", response_model=List[OrderResponse])
def read_orders_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    return get_orders_by_restaurant(db, restaurant_id=restaurant_id)

@router.get("/orders/", response_model=List[OrderResponse])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_orders(db, skip=skip, limit=limit)