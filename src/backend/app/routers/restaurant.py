from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.restaurant import get_restaurant, get_restaurants_by_owner, create_restaurant, get_restaurants
from app.schemas.restaurant import RestaurantCreate, RestaurantResponse
from typing import List

router = APIRouter()

@router.post("/restaurants/", response_model=RestaurantResponse)
def create_new_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db)):
    return create_restaurant(db, restaurant=restaurant)

@router.get("/restaurants/{restaurant_id}", response_model=RestaurantResponse)
def read_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    db_restaurant = get_restaurant(db, restaurant_id=restaurant_id)
    if db_restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return db_restaurant

@router.get("/restaurants/owner/{owner_id}", response_model=List[RestaurantResponse])
def read_restaurants_by_owner(owner_id: int, db: Session = Depends(get_db)):
    return get_restaurants_by_owner(db, owner_id=owner_id)

@router.get("/restaurants/", response_model=List[RestaurantResponse])
def read_restaurants(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_restaurants(db, skip=skip, limit=limit)