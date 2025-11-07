from sqlalchemy.orm import Session
from app.database.models import InventoryItem
from app.schemas.inventory_item import InventoryItemCreate

def get_inventory_item(db: Session, inventory_item_id: int):
    return db.query(InventoryItem).filter(InventoryItem.id == inventory_item_id).first()

def get_inventory_items_by_restaurant(db: Session, restaurant_id: int):
    return db.query(InventoryItem).filter(InventoryItem.restaurant_id == restaurant_id).all()

def create_inventory_item(db: Session, inventory_item: InventoryItemCreate):
    db_inventory_item = InventoryItem(
        restaurant_id=inventory_item.restaurant_id,
        name=inventory_item.name,
        quantity=inventory_item.quantity,
        unit=inventory_item.unit,
        unit_cost=inventory_item.unit_cost,
        min_threshold=inventory_item.min_threshold,
        last_updated=inventory_item.last_updated
    )
    db.add(db_inventory_item)
    db.commit()
    db.refresh(db_inventory_item)
    return db_inventory_item
