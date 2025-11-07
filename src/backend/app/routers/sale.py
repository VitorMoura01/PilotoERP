from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.crud.sale import get_sale, get_sales_by_restaurant, create_sale
from app.schemas.sale import SaleCreate, SaleResponse
from typing import List

router = APIRouter()

@router.post("/sales/", response_model=SaleResponse)
def create_new_sale(sale: SaleCreate, db: Session = Depends(get_db)):
    return create_sale(db, sale=sale)

@router.get("/sales/{sale_id}", response_model=SaleResponse)
def read_sale(sale_id: int, db: Session = Depends(get_db)):
    db_sale = get_sale(db, sale_id=sale_id)
    if db_sale is None:
        raise HTTPException(status_code=404, detail="Sale not found")
    return db_sale

@router.get("/sales/restaurant/{restaurant_id}", response_model=List[SaleResponse])
def read_sales_by_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    return get_sales_by_restaurant(db, restaurant_id=restaurant_id)
