# Modulo 3

## Summary

This README provides an overview of the project, its architecture, user stories, and technical decisions. For more details, refer to the following documentation:

- [User Stories](../Modulo%203/Docs/User%20stories.md): Complete list of user stories, epics, and example tasks driving the project design.
- [Solution Implementation](../Modulo%203/Docs/Solution_Implementation.md): Technical mapping of user stories to backend/frontend implementation and architectural philosophy.
- [Piloto Bot: Conversational AI Assistant](../Modulo%203/Docs/Telegram%20bot.md): Vision, architecture, and roadmap for the Piloto Bot as the main data input channel.


## User stories progress
Ther project at it's current proof of concept state focused on adressing the main user epic, which has the owner/manager as the persona. This decision was made based on the team's short available development time and the user's most relevant pain points, that includes the business health visualization and KPIs monitoring:

For the full set of user stories and epics, see [User Stories](../Modulo%203/Docs/User%20stories.md).

### Epic 4: Finance & Accounting  

| Priority     | User Story                                                                 | Task Example | Frontend | Backend | Implementing Frontend Component | Implementing Backend Endpoint |
|--------------|-----------------------------------------------------------------------------|--------------|----------|---------|---------------------------------|-------------------------------|
| Must-have    | As a manager, I want to ask the AI for a daily business summary, including sales, key expenses, and profitability, so I get a quick snapshot of our financial health. | Manager asks: "How did we do yesterday?" | 🟢 Done | 🟢 Done | `components/dashboard-view.tsx` | `/dashboard/kpis` |
| Must-have    | As a manager, I want a simple dashboard where the AI highlights key financial metrics (revenue, costs, profit), so I can see the most important information at a glance. | The main screen displays 3-4 key metrics with trends (e.g., "Revenue is up 5% this week"). | 🟢 Done | 🟢 Done | `components/dashboard-view.tsx` | `/dashboard/kpis` |
| Must-have    | As a manager, I want to forward supplier invoices and expense receipts to the AI, so they are automatically categorized and recorded. | Manager sends a photo of a receipt to a dedicated system address. | ⚪ Not started | 🟡 In progress | N/A | N/A |
| Nice-to-have | As a manager, I want to ask the AI for a cash flow projection based on recent trends, so I can anticipate financial needs. | Manager asks: "Project our cash flow for the next 30 days." | ⚪ Not started | ⚪ Not started | N/A | N/A |
| Nice-to-have | As an owner, I want the AI to generate simplified tax summaries (like sales tax) upon request, so I can easily share them with my accountant. | Owner asks: "Generate the sales tax report for last month." | ⚪ Not started | ⚪ Not started | N/A | N/A |

---

## Technology Stack

### Frontend
- **Language:** TypeScript
- **Framework:** Next.js 14
- **Package Manager:** pnpm
- **UI Components:** Shadcn/ui + Tailwind CSS
- **Charts:** Recharts

### Backend
- **Language:** Python 3.11+
- **Framework:** FastAPI
- **Database:** PostgreSQL 15
- **ORM:** SQLAlchemy
- **Validation:** Pydantic

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Web Server:** Uvicorn (ASGI)

For detailed technical rationale and architectural decisions, see [Solution Implementation Guide](../Modulo%203/Docs/Solution_Implementation.md).

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 8000, and 5432 available

### Project Setup

**1. Clone and navigate to the project:**
```bash
cd "Modulo 3"
```

**2. Start all services with Docker Compose:**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- FastAPI backend on port 8000
- Next.js frontend on port 3000

**3. Seed the database with sample data (recommended for first run):**
```bash
docker-compose exec backend python scripts/seed.py
```

**4. Access the application:**
- **Frontend Dashboard:** http://localhost:3000
- **Backend API Docs:** http://localhost:8000/docs
- **Backend Health Check:** http://localhost:8000/

### Environment Variables

The project uses the following environment configuration:

**Backend** (configured in `docker-compose.yaml`):
- Database connection is automatically configured via Docker Compose
- Additional settings can be added to `backend/.env` if needed

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note:** For development setup with local installations (without Docker), see the [Integration Guide](../Modulo%203/Docs/INTEGRATION_GUIDE.md) for detailed instructions.

---

## Current Limitations

This is a proof-of-concept implementation with the following known limitations:

1. **Authentication:** No user authentication system implemented. Restaurant ID is hardcoded to `1` in the frontend.
2. **Data Coverage:** Only the "Geral" and "Gestão Abrangente de Estoque" panels use live backend data. Other dashboard panels display sample/mock data.
3. **Real-time Updates:** Data is fetched once on page load. No automatic refresh, polling, or WebSocket implementation.
4. **Error Handling:** Basic error handling is in place but lacks retry logic and comprehensive user-friendly error messages.
5. **Multi-tenancy:** Single restaurant support only. No multi-restaurant or user role management.
6. **Testing:** No automated tests implemented for frontend or backend.

---

## Next Steps

### Short-term Priorities
1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Add user role management (owner, manager, staff)
   - Replace hardcoded restaurant ID with user context

2. **Complete Data Integration**
   - Implement remaining dashboard API endpoints
   - Replace all mock data with live backend data
   - Add data caching layer (Redis)

3. **AI Assistant Integration**
   - Implement conversational AI endpoints
   - Add Telegram bot integration (see [Piloto Bot Documentation](../Modulo%203/Docs/Telegram%20bot.md))
   - Enable natural language queries for business metrics

### Medium-term Enhancements
4. **Real-time Features**
   - Add WebSocket support for live updates
   - Implement push notifications for critical alerts

5. **Testing & Quality**
   - Add unit and integration tests
   - Implement error boundaries
   - Add end-to-end testing

6. **Performance & Scalability**
   - Optimize database queries with indexing
   - Implement request caching
   - Add rate limiting

---

## Development Guide

For detailed development setup, API documentation, troubleshooting, and contribution guidelines, see:

- **[Integration Guide](../Modulo%203/Docs/INTEGRATION_GUIDE.md)** - Comprehensive development setup and API integration details
- **[Solution Implementation](../Modulo%203/Docs/Solution_Implementation.md)** - Technical architecture and design decisions
- **[User Stories](../Modulo%203/Docs/User%20stories.md)** - Product requirements and user journeys
- **[Piloto Bot](../Modulo%203/Docs/Telegram%20bot.md)** - AI assistant architecture and roadmap


---

## File Tree

```
Modulo 3/
├── docker-compose.yaml
├── README.md
├── Docs/
│   ├── Solution_Implementation.md
│   ├── User stories.md
│   ├── Telegram bot.md
│   └── assets/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   └── styles/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── crud/
│   │   ├── database/
│   │   ├── routers/
│   │   ├── schemas/
│   ├── scripts/
│   └── alembic/
```

For any issues, check the container logs or ensure your Docker setup is working correctly.

---


For backend API endpoints and their mapping to user stories, see [Solution Implementation Guide](../Modulo%203/Docs/Solution_Implementation.md).


## Backend Routes and User Stories

### Routes Added
- `/general/users`: Manage user accounts.
- `/general/restaurants`: Manage restaurant data.
- `/general/sales`: Handle sales data.
- `/general/orders`: Manage orders and their items.
- `/general/menu-items`: Manage menu items.
- `/general/order-items`: Handle order item details.
- `/general/inventory-items`: Manage inventory data.
- `/dashboard/revenue-today`: Get today's revenue.
- `/dashboard/orders-today`: Get today's orders.
- `/dashboard/inventory-below-threshold`: Get inventory items below the threshold.
- `/dashboard/revenue-last-30-days`: Get revenue data for the last 30 days.

### Interaction with User Stories
These routes align with the user stories by enabling:
- **Finance & Accounting**: Daily business summaries and financial metrics.
- **Purchasing & Inventory**: Real-time stock levels and proactive alerts.
- **Kitchen & Menu Management**: Cost analysis and menu updates.
- **Front-of-House**: Sales insights and order management.

---

## Technical Rationale and Architectural Decisions

The technologies for this project were chosen specifically to address the core challenges of building a responsive, intelligent, and user-friendly management tool for small businesses.

-   **Backend (Python/FastAPI):** FastAPI was selected for its high performance and asynchronous capabilities, which are essential for handling real-time data queries from the AI assistant and dashboard without lag. Its automatic generation of interactive API documentation (`/docs`) accelerates development and ensures a clear, testable contract between the frontend and backend.

-   **Frontend (Next.js/TypeScript):** We chose Next.js for its powerful React framework, enabling the creation of a fast, modern, and component-based user interface. TypeScript adds a layer of safety and predictability to the codebase, which is crucial for building a reliable and maintainable application. This stack allows us to build the simple, intuitive dashboard that directly solves the user's pain of dealing with overly complex legacy systems.

---

## Backend Technologies
- **Language:** Python
- **Framework:** FastAPI
- **Database ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Web Server:** Uvicorn
- **Environment Management:** Python-dotenv

---


For backend integration with the Piloto Bot and conversational data input, see [Piloto Bot: Conversational AI Assistant](../Modulo%203/Docs/Telegram%20bot.md).


## Class Diagram and Models

![Class Diagram](../Modulo%203/Docs/assets/Class%20Diagram.png)

### Overview
The backend is structured around the following models:
- **User**: Represents restaurant owners/managers.
- **Restaurant**: Stores restaurant details and links to other models.
- **Sale**: Tracks revenue generated by the restaurant.
- **Order**: Represents customer orders.
- **MenuItem**: Stores menu item details, including pricing and availability.
- **OrderItem**: Links menu items to orders.
- **InventoryItem**: Tracks stock levels and costs.

### Relationships
- A `User` owns multiple `Restaurants`.
- A `Restaurant` has `Sales`, `Orders`, `MenuItems`, and `InventoryItems`.
- An `Order` contains multiple `OrderItems` and may link to a `Sale`.
- A `MenuItem` is linked to `OrderItems`.
- An `InventoryItem` tracks stock for a `Restaurant`.

---
## What Comes Next

- Implement AI features and endpoints for automated insights and the "chat" page, see [Piloto Bot: Conversational AI Assistant](../Modulo%203/Docs/Telegram%20bot.md).
- Add endpoints for supplier invoice parsing and expense categorization.
- Develop analytics for cash flow projections.