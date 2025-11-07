from sqlalchemy.orm import Session
from app.database.models import Sale
from app.schemas.sale import SaleCreate

def get_sale(db: Session, sale_id: int):
    return db.query(Sale).filter(Sale.id == sale_id).first()

def get_sales_by_restaurant(db: Session, restaurant_id: int):
    return db.query(Sale).filter(Sale.restaurant_id == restaurant_id).all()

def create_sale(db: Session, sale: SaleCreate):
    db_sale = Sale(
        restaurant_id=sale.restaurant_id,
        amount=sale.amount,
        timestamp=sale.timestamp,
        order_id=sale.order_id
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale
