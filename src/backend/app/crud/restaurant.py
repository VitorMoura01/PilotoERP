from sqlalchemy.orm import Session
from app.database.models import Restaurant
from app.schemas.restaurant import RestaurantCreate

def get_restaurant(db: Session, restaurant_id: int):
    return db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

def get_restaurants_by_owner(db: Session, owner_id: int):
    return db.query(Restaurant).filter(Restaurant.owner_id == owner_id).all()

def get_restaurants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Restaurant).offset(skip).limit(limit).all()

def create_restaurant(db: Session, restaurant: RestaurantCreate):
    db_restaurant = Restaurant(name=restaurant.name, owner_id=restaurant.owner_id)
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant
