# Frontend-Backend Integration Guide

## Overview
This guide documents the integration between the frontend dashboard and the backend API using the `/dashboard/kpis` endpoint.

## API Endpoint

### GET /dashboard/kpis
Fetches key performance indicators for a specific restaurant.

**Query Parameters:**
- `restaurant_id` (integer, required): The ID of the restaurant

**Response:**
```json
{
  "revenue_today": 0.0,
  "orders_today": 0,
  "low_stock_items": 0,
  "revenue_this_year": [
    {
      "date": "2025-01-01",
      "year_month": "2025-01",
      "revenue": 1234.56
    },
    {
      ...
    },
    ...
  ]
}
```

## Frontend Integration

### Components Updated
- `components/dashboard-view.tsx`: Main dashboard component
  - Added state management for KPI data
  - Added loading and error states
  - Integrated data into KPI cards
  - Updated revenue chart with real data
  - Updated inventory panel with low stock count

### API Client
- `lib/api.ts`: Added `fetchKPIs()` function and `KPIData` interface

### Features Implemented

#### 1. Revenue Today Card
- Displays revenue data from `revenue_today`

#### 2. Orders Today Card
- Displays live order count from `orders_today`

#### 3. Average Ticket Card
- Calculated dynamically: `revenue_today / orders_today`

#### 4. Revenue Chart
- Uses `revenue_this_year` data
- Displays daily revenue over time

#### 5. Low Stock Items
- Shows count in "Gestão Abrangente de Estoque" panel
- Displays message when no items are below threshold

## Setup Instructions

### 1. Backend Setup
```bash
# Navigate to Modulo 3 directory
cd "Modulo 3"

# Start services with Docker Compose
docker-compose up -d

# Check if backend is running
curl http://localhost:8000/
```

### 2. Seed Database (Optional)
```bash
# Run seed script to populate with test data
docker-compose exec backend python scripts/seed.py
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
pnpm install

# Run development server
pnpm dev
```

### 4. Environment Variables
Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Testing the Integration

### 1. Verify Backend is Running
```bash
# Test the KPI endpoint
curl "http://localhost:8000/dashboard/kpis?restaurant_id=1"
```

### 2. Access Frontend
Open http://localhost:3000 in your browser

### 3. Verify Data Display
- Check "Geral" panel for live KPIs
- Verify revenue chart displays data
- Check "Gestão Abrangente de Estoque" for low stock count

## CORS Configuration

The backend has been configured to allow requests from the frontend:
- Allowed origin: `http://localhost:3000`
- All methods and headers allowed
- Credentials supported

## Current Limitations

1. **Restaurant ID Hardcoded**: Currently set to `1` in the frontend. Should be replaced with authentication context.
2. **Sample Data for Other Panels**: Only the General and Inventory panels use live data. Other panels still show sample data.
3. **No Auto-refresh**: Data is fetched once on component mount. Consider adding polling or WebSocket for real-time updates.
4. **Error Handling**: Basic error handling implemented. Could be enhanced with retry logic and user-friendly error messages.

## Next Steps

1. Add authentication to get dynamic restaurant_id
2. Implement additional API endpoints for other dashboard panels
3. Add real-time data updates (WebSocket or polling)
4. Implement data caching and optimistic updates
5. Add unit tests for API integration
6. Implement error boundaries for better error handling

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify CORS settings in `backend/app/main.py`
- Check `.env.local` has correct API URL

### No data displayed
- Run seed script to populate database
- Verify restaurant with ID=1 exists
- Check browser console for errors
- Verify API response in Network tab

### CORS errors
- Ensure backend CORS middleware is configured
- Verify frontend origin matches allowed origins
- Restart backend after CORS changes
