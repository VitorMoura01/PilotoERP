from sqlalchemy.orm import Session
from app.database.models import OrderItem
from app.schemas.order_item import OrderItemCreate

def get_order_item(db: Session, order_item_id: int):
    return db.query(OrderItem).filter(OrderItem.id == order_item_id).first()

def get_order_items_by_order(db: Session, order_id: int):
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

def create_order_item(db: Session, order_item: OrderItemCreate):
    db_order_item = OrderItem(
        order_id=order_item.order_id,
        menu_item_id=order_item.menu_item_id,
        quantity=order_item.quantity,
        unit_price=order_item.unit_price
    )
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item
