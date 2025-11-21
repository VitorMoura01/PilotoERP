# Railway Environment Variables Configuration

## Backend Service

Add these environment variables to your Railway backend service:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
ALLOWED_ORIGINS=https://your-frontend-url.railway.app,http://localhost:3000
PORT=8000
```

**Important:**
- Replace `DATABASE_URL` with your actual Railway PostgreSQL connection string
- Replace `https://your-frontend-url.railway.app` with your actual Railway frontend URL
- Keep `http://localhost:3000` for local development

## Frontend Service

Add these environment variables to your Railway frontend service:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
PORT=3000
```

**Important:**
- Replace `https://your-backend-url.railway.app` with your actual Railway backend URL

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Select the service (backend or frontend)
3. Go to the "Variables" tab
4. Add each environment variable
5. Redeploy the service

## Testing the Connection

After setting the environment variables and redeploying:

1. The frontend should be able to connect to the backend
2. CORS errors should be resolved
3. API calls should work properly

## Local Development

For local development, create `.env` files:

### Backend `.env` (src/backend/.env)
```
DATABASE_URL=postgresql://pilotuser:pilotpass@db:5432/pilotdb
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env.local` (src/frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
