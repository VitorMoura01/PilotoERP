from sqlalchemy.orm import Session
from app.database.models import MenuItem
from app.schemas.menu_item import MenuItemCreate

def get_menu_item(db: Session, menu_item_id: int):
    return db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()

def get_menu_items_by_restaurant(db: Session, restaurant_id: int):
    return db.query(MenuItem).filter(MenuItem.restaurant_id == restaurant_id).all()

def create_menu_item(db: Session, menu_item: MenuItemCreate):
    db_menu_item = MenuItem(
        restaurant_id=menu_item.restaurant_id,
        name=menu_item.name,
        price=menu_item.price,
        cost=menu_item.cost,
        category=menu_item.category,
        is_available=menu_item.is_available
    )
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item
