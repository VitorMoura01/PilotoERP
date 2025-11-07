import random
import sys
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add the app directory to the Python path
sys.path.insert(0, "/app")

from app.database import session, models

fake = Faker('pt_BR')

def seed_database(db: Session):
    """
    Clears existing data and populates the database with realistic mock data.
    """
    print("Clearing old data...")
    # Clear data in reverse order of dependencies to avoid foreign key constraints
    db.query(models.OrderItem).delete()
    db.query(models.Sale).delete()
    db.query(models.Order).delete()
    db.query(models.MenuItem).delete()
    db.query(models.InventoryItem).delete()
    db.query(models.Restaurant).delete()
    db.query(models.User).delete()
    db.commit()
    
    # Reset ID sequences to start from 1
    print("Resetting ID sequences...")
    try:
        db.execute(text("ALTER SEQUENCE users_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE restaurants_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE inventory_items_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE menu_items_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE orders_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE sales_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE order_items_id_seq RESTART WITH 1"))
        db.commit()
        print("ID sequences reset successfully.")
    except Exception as e:
        print(f"Warning: Could not reset sequences: {e}")
        db.rollback()
    
    print("Old data cleared and sequences reset.")

    # --- Create Base Entities ---
    print("Creating base entities (Users, Restaurant)...")
    
    # Create admin user
    admin = models.User(
        email="admin@pilot.com",
        hashed_password="fakehashedpassword",
        first_name="Admin",
        last_name="System",
        phone=fake.phone_number(),
        address=fake.address(),
        role="admin"
    )
    db.add(admin)
    
    # Create manager user
    manager = models.User(
        email="manager@pilot.com",
        hashed_password="fakehashedpassword",
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        phone=fake.phone_number(),
        address=fake.address(),
        role="manager"
    )
    db.add(manager)
    
    # Create some staff users
    for _ in range(3):
        staff = models.User(
            email=fake.email(),
            hashed_password="fakehashedpassword",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone=fake.phone_number(),
            address=fake.address(),
            role="staff"
        )
        db.add(staff)
    
    db.commit()
    
    # Use the manager as the restaurant owner
    user = manager

    restaurant = models.Restaurant(
        name="Example Restaurant",
        owner_id=user.id
    )
    db.add(restaurant)
    db.commit()

    # --- Create Inventory and Menu ---
    print("Creating inventory and menu items...")
    inventory_items_data = [
        {"name": "Tomate", "quantity": 50.0, "min_threshold": 10.0, "unit": "kg"},
        {"name": "Queijo Mussarela", "quantity": 25.5, "min_threshold": 5.0, "unit": "kg"},
        {"name": "Farinha de Trigo", "quantity": 100.0, "min_threshold": 20.0, "unit": "kg"},
        {"name": "Frango", "quantity": 40.0, "min_threshold": 15.0, "unit": "kg"},
        {"name": "Batata", "quantity": 8.0, "min_threshold": 10.0, "unit": "kg"}, # Example of low stock
    ]
    for item_data in inventory_items_data:
        item = models.InventoryItem(**item_data, restaurant_id=restaurant.id)
        db.add(item)
    db.commit()

    menu_items_data = [
        {"name": "Pizza de Mussarela", "price": 45.50, "cost": 20.00, "category": "Pizzas"},
        {"name": "Frango a Parmegiana", "price": 55.00, "cost": 25.00, "category": "Pratos Principais"},
        {"name": "Batata Frita", "price": 25.00, "cost": 8.00, "category": "Acompanhamentos"},
        {"name": "Suco de Laranja", "price": 12.00, "cost": 4.00, "category": "Bebidas"},
    ]
    menu_items = []
    for item_data in menu_items_data:
        item = models.MenuItem(**item_data, restaurant_id=restaurant.id)
        menu_items.append(item)
        db.add(item)
    db.commit()

    # --- Generate Historical Sales and Orders ---
    print("Generating historical orders and sales for the last 90 days...")
    today = datetime.now()
    for i in range(90): # Generate data for the past 90 days
        current_date = today - timedelta(days=i)
        # Simulate more orders on weekends
        num_orders = random.randint(20, 50) if current_date.weekday() < 5 else random.randint(50, 100)

        for _ in range(num_orders):
            order_time = fake.date_time_between(start_date=current_date.replace(hour=11), end_date=current_date.replace(hour=22))
            order = models.Order(
                timestamp=order_time,
                restaurant_id=restaurant.id,
                total_amount=0  # Will be updated after adding items
            )
            db.add(order)
            db.flush() # Use flush to get the order.id before committing

            total_order_value = 0
            num_order_items = random.randint(1, 4)
            for _ in range(num_order_items):
                menu_item = random.choice(menu_items)
                quantity = random.randint(1, 2)
                order_item = models.OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity
                )
                db.add(order_item)
                total_order_value += menu_item.price * quantity

            sale = models.Sale(
                amount=total_order_value,
                timestamp=order_time,
                order_id=order.id,
                restaurant_id=restaurant.id
            )
            db.add(sale)

    db.commit()
    print("Database seeding complete!")


if __name__ == "__main__":
    db_session = next(session.get_db())
    try:
        seed_database(db_session)
    finally:
        db_session.close()
