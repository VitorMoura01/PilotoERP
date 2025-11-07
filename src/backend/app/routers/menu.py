from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database.session import get_db
from app.database import models
from app.schemas import menu

router = APIRouter()

# Added route
@router.get("/restaurants/{restaurant_id}/menu/performance", response_model=List[menu.MenuItemPerformance])
def get_menu_performance(restaurant_id: int, days: int = 30, db: Session = Depends(get_db)):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    # Get total orders for popularity calculation
    total_orders = db.query(func.count(models.Order.id))\
        .filter(
            models.Order.restaurant_id == restaurant_id,
            models.Order.timestamp.between(start_date, end_date)
        ).scalar() or 1  # Avoid division by zero
    
    # Get performance metrics for each menu item
    menu_items = db.query(
        models.MenuItem.id,
        models.MenuItem.name,
        models.MenuItem.price,
        models.MenuItem.cost,
        func.count(models.OrderItem.id).label('order_count'),
        func.sum(models.OrderItem.quantity).label('total_quantity')
    ).outerjoin(
        models.OrderItem, models.MenuItem.id == models.OrderItem.menu_item_id
    ).outerjoin(
        models.Order, models.OrderItem.order_id == models.Order.id
    ).filter(
        models.MenuItem.restaurant_id == restaurant_id,
        models.Order.timestamp.between(start_date, end_date)
    ).group_by(
        models.MenuItem.id
    ).all()
    
    result = []
    for item in menu_items:
        popularity = (item.order_count / total_orders) * 100
        profitability = ((item.price - item.cost) / item.price) * 100 if item.price > 0 else 0
        
        # Categorize items based on popularity and profitability
        if popularity >= 50 and profitability >= 10:
            category = "Stars"
        elif popularity >= 50:
            category = "Plowhorses"
        elif profitability >= 10:
            category = "Puzzles"
        else:
            category = "Dogs"
        
        result.append({
            "name": item.name,
            "popularity": popularity,
            "profitability": profitability,
            "category": category
        })
    
    return result