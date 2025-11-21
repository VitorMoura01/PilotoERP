from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, restaurant, sale, order, menu_item, order_item, inventory_item, kpi
from app.database.session import engine
from app.database.models import Base
from fastapi.openapi.utils import get_openapi
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Dashboard API",
        version="1.0.0",
        description="API for managing restaurant dashboards",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Include routers
app.include_router(user.router, prefix="/general", tags=["Users"])
app.include_router(restaurant.router, prefix="/general", tags=["Restaurants"])
app.include_router(sale.router, prefix="/general", tags=["Sales"])
app.include_router(order.router, prefix="/general", tags=["Orders"])
app.include_router(menu_item.router, prefix="/general", tags=["Menu Items"])
app.include_router(order_item.router, prefix="/general", tags=["Order Items"])
app.include_router(inventory_item.router, prefix="/general", tags=["Inventory Items"])
app.include_router(kpi.router, prefix="/dashboard", tags=["KPIs"])


@app.get("/")
def read_root():
    return {"message": "Welcome to Pilot API"}

@app.get("/ping")
def ping():
    return {"status": "ok"}
