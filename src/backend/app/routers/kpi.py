from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Sale, Order, InventoryItem
from sqlalchemy.sql import func, text
from datetime import datetime, timedelta

router = APIRouter()

#future: bring this into crud functions
@router.get("/revenue-today", tags=["KPIs"])
def get_revenue_today(restaurant_id: int, db: Session = Depends(get_db)):
    query = text(
        """
        SELECT COALESCE(SUM(amount), 0) AS revenue_today
        FROM sales
        WHERE restaurant_id = :restaurant_id
          AND DATE(timestamp) = CURRENT_DATE
        """
    )
    result = db.execute(query, {"restaurant_id": restaurant_id}).fetchone()
    return {"revenue_today": result.revenue_today}

@router.get("/orders-today", tags=["KPIs"])
def get_orders_today(restaurant_id: int, db: Session = Depends(get_db)):
    query = text(
        """
        SELECT COUNT(id) AS orders_today
        FROM orders
        WHERE restaurant_id = :restaurant_id
          AND DATE(timestamp) = CURRENT_DATE
        """
    )
    result = db.execute(query, {"restaurant_id": restaurant_id}).fetchone()
    return {"orders_today": result.orders_today}

@router.get("/inventory-below-threshold", tags=["KPIs"])
def get_inventory_below_threshold(restaurant_id: int, db: Session = Depends(get_db)):
    query = text(
        """
        SELECT COUNT(*) AS items_below_threshold
        FROM inventory_items
        WHERE restaurant_id = :restaurant_id
          AND quantity < min_threshold
        """
    )
    result = db.execute(query, {"restaurant_id": restaurant_id}).fetchone()
    return {"items_below_threshold": result.items_below_threshold}

@router.get("/revenue-last-30-days", tags=["KPIs"])
def get_revenue_last_30_days(restaurant_id: int, db: Session = Depends(get_db)):
    query = text(
        """
        SELECT DATE(timestamp) AS date, SUM(amount) AS revenue
        FROM sales
        WHERE restaurant_id = :restaurant_id
          AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(timestamp)
        ORDER BY DATE(timestamp)
        """
    )
    result = db.execute(query, {"restaurant_id": restaurant_id}).fetchall()
    return {"revenue_last_30_days": [{"date": row.date, "revenue": row.revenue} for row in result]}

@router.get("/kpis", tags=["KPIs"])
def get_kpis(restaurant_id: int, db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    year_start = datetime(today.year, 1, 1).date()

    revenue_today = db.query(func.sum(Sale.amount)).filter(
        Sale.restaurant_id == restaurant_id,
        func.date(Sale.timestamp) == today
    ).scalar() or 0

    orders_today = db.query(func.count(Order.id)).filter(
        Order.restaurant_id == restaurant_id,
        func.date(Order.timestamp) == today
    ).scalar() or 0

    low_stock_items = db.query(InventoryItem).filter(
        InventoryItem.restaurant_id == restaurant_id,
        InventoryItem.quantity < InventoryItem.min_threshold
    ).count()

    revenue_this_year_query = text(
        """
        SELECT 
            DATE(timestamp) AS date,
            TO_CHAR(timestamp, 'YYYY-MM') AS year_month,
            SUM(amount) AS revenue
        FROM sales
        WHERE restaurant_id = :restaurant_id
          AND DATE(timestamp) >= :year_start
        GROUP BY DATE(timestamp), TO_CHAR(timestamp, 'YYYY-MM')
        ORDER BY DATE(timestamp)
        """
    )
    revenue_this_year_result = db.execute(
        revenue_this_year_query, 
        {"restaurant_id": restaurant_id, "year_start": year_start}
    ).fetchall()

    revenue_this_year = [
        {
            "date": row.date.isoformat() if hasattr(row.date, 'isoformat') else str(row.date),
            "year_month": row.year_month,
            "revenue": float(row.revenue)
        }
        for row in revenue_this_year_result
    ]

    return {
        "revenue_today": revenue_today,
        "orders_today": orders_today,
        "low_stock_items": low_stock_items,
        "revenue_this_year": revenue_this_year
    }
