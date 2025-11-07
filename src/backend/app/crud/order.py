from sqlalchemy.orm import Session
from app.database.models import Order, OrderItem
from app.schemas.order import OrderCreate
from app.schemas.order_item import OrderItemCreate

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_restaurant(db: Session, restaurant_id: int):
    return db.query(Order).filter(Order.restaurant_id == restaurant_id).all()

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()

def create_order(db: Session, order: OrderCreate, items: list[OrderItemCreate]):
    db_order = Order(
        restaurant_id=order.restaurant_id,
        customer_name=order.customer_name,
        total_amount=order.total_amount,
        timestamp=order.timestamp,
        status=order.status
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in items:
        db_item = OrderItem(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(db_item)
    db.commit()
    return db_order
