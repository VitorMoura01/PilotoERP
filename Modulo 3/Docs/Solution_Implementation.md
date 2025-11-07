# Solution Implementation Guide

This document provides a clear connection between user stories, user flows, and the technical components that bring them to life. It serves as a living bridge between our project's "why" and its technical implementation, adopting an efficient, hybrid approach to data processing.

---

## Architectural Philosophy

Our backend is designed to be a lean orchestrator. The heavy lifting of data aggregation, filtering, and joining is delegated to the PostgreSQL database, which is highly optimized for these tasks. The FastAPI backend executes these powerful, aggregated queries and focuses on formatting the results for the frontend, ensuring high performance and scalability. This prevents the backend from becoming a bottleneck by avoiding the processing of large, raw datasets in memory.

---

## User Flows and Implementation Details

### 1. Viewing the Business Health Dashboard

**User Stories:**
- > "As a manager, I want a simple dashboard where the AI highlights key financial metrics (revenue, costs, profit), so I can see the most important information at a glance."
- > "As a manager, I want to ask the AI for a daily business summary, including sales, key expenses, and profitability, so I get a quick snapshot of our financial health."

**Pain Point Addressed:**
This directly solves the owner's pain of not having a quick, digestible snapshot of the business's daily health, forcing them to dig through complex reports or spreadsheets.

**Implementation Details:**
- **User Interaction:** The user logs in and lands on the main dashboard.
- **Frontend:**
  - The `components/dashboard-view.tsx` component renders the layout and is responsible for fetching and displaying all dashboard data.
- **Backend Communication:**
  - **API Calls:**
    - `GET /dashboard/kpis`: Fetches the main Key Performance Indicators (KPIs) in a single network request.
      - **Database (SQL):** Executes a query calculating today's total revenue, total orders, and the count of low-stock items.
      - **Backend (Python):** Returns a JSON object: `{ "revenue_today": 1250.75, "orders_today": 82, "low_stock_items": 5 }`.
    - `GET /dashboard/revenue-chart?period=30d`: Fetches the time-series data for the revenue graph.
      - **Database (SQL):** Performs a `GROUP BY` on the sale date and `SUM` on the revenue for the last 30 days.
      - **Backend (Python):** Formats the result into a JSON array for the charting library.
- **Result:** The user immediately sees the most critical business metrics, loaded quickly and efficiently.

---

### 2. Proactive Inventory Management

**User Story:**
> "As a manager, I want the AI to proactively alert me when stock is low and suggest a reorder list, so I can act before we run out."

**Pain Point Addressed:**
Transforms inventory management from a reactive, manual chore into a proactive, automated process, reducing the risk of stockouts and lost sales.

**Implementation Details:**
- **System Interaction:** A background task runs periodically (e.g., once an hour) to check inventory levels. If any items are below their threshold, a notification is generated.
- **Backend Route:**
  - `GET /inventory/low-stock-items`: Provides a list of all inventory items below their reorder threshold.
    - **Database (SQL):** Executes `SELECT name, quantity, threshold FROM inventory_items WHERE quantity < threshold`.
    - **Backend (Python):** Returns the list of items.
- **Frontend:**
  - A notification icon in `components/header.tsx` indicates an alert. Clicking it takes the user to `components/inventory-management.tsx`, which displays the suggested reorder list.
- **Result:** The manager is notified of inventory issues without manual checks, ensuring operational continuity.

---

### 3. Dynamic Menu & Cost Analysis

**User Stories:**
- "As a chef, I want to describe a recipe to the AI in natural language, so the system can automatically link ingredients and track usage when a dish is sold."
- "As a manager, I want to ask the AI for the cost and profit margin of any dish, so I can make informed pricing decisions."

**Pain Point Addressed:**
Simplifies the complex process of recipe costing, connecting kitchen operations directly to financial insights.

**Implementation Details:**
- **User Interaction:** The chef or manager uses a form or conversational interface to define ingredients and quantities for a menu item.
- **Backend Routes:**
  - `POST /menu-items/{item_id}/recipe`: Creates or updates the recipe for a menu item.
  - `GET /menu-items/{item_id}/cost-analysis`: Calculates the real-time cost, price, and profit margin for a dish.
    - **Database (SQL):** Executes a query that `JOIN`s the `menu_items`, `recipe_components`, and `inventory_items` tables to calculate ingredient costs.
    - **Backend (Python):** Calculates the profit margin and returns a financial profile for the dish.
- **Frontend:**
  - The `components/recipe-management.tsx` component provides the interface for creating and viewing cost analyses.
- **Result:** The manager can instantly see the profitability of any menu item, enabling data-driven pricing decisions.

---

### 4. Conversational Sales Insights

**User Story:**
> "As a manager, I want to ask the AI for sales insights, such as 'What was our best-selling dish today?' so I can understand performance without running manual reports."

**Pain Point Addressed:**
Eliminates the need for manual report generation, providing actionable insights through a conversational interface.

**Implementation Details:**
- **User Interaction:** The manager asks a question in the chat interface, e.g., "What are our top sellers this week?"
- **Backend Route:**
  - The AI agent translates the natural language query into a structured API call.
  - `GET /sales/insights/best-sellers?period=7d`: Returns a ranked list of best-selling menu items over a specified period.
    - **Database (SQL):** Executes a query that `JOIN`s `order_items` with `menu_items`, filters by date range, and ranks results using `GROUP BY` and `ORDER BY SUM(quantity) DESC`.
    - **Backend (Python):** Formats the aggregated list into a JSON response.
- **Frontend:**
  - The chat interface in `components/dashboard-view.tsx` displays the formatted list of best-selling items.
- **Result:** The manager gets immediate, accurate answers to critical business questions, enabling real-time strategy adjustments.

---

### 5. Conversational Data Input via Piloto Bot

**User Stories:**
- > "As a manager, I want to tell the AI about new stock purchases by forwarding an invoice or sending a simple message, so the system updates inventory automatically."
- > "As a manager, I want to forward supplier invoices and expense receipts to the AI, so they are automatically categorized and recorded."

**Pain Point Addressed:**
This flow directly attacks one of the biggest sources of friction in restaurant management: manual data entry of invoices and receipts. It transforms a tedious, error-prone task into a simple "forward" action within a familiar chat application, saving significant time and ensuring data is captured accurately and immediately.

**Architectural Role:**
This is the primary example of our core philosophy: **Converse to input, view to analyze.** The Piloto Bot is the designated **input channel**, decoupling the data entry process from the data visualization interface.

**Implementation Details:**
- **User Interaction:** The user forwards a PDF or an image of an invoice to the Piloto Bot (e.g., on Telegram).
- **Bot (AI Agent):**
  - The bot's workflow (prototyped in n8n) receives the file.
  - It uses OCR and a Large Language Model to parse the document, extracting structured data like supplier, items, quantities, and total cost.
- **Backend Communication:**
  - The bot sends this structured JSON data to a new, dedicated backend endpoint.
  - **API Call:** `POST /invoices/process-from-bot`
    - **Backend (Python):** The backend receives the parsed data. It then contains the logic to:
      1.  Identify the supplier (or create a new one).
      2.  Update stock levels in the `inventory_items` table for each item listed.
      3.  Record the purchase as an expense in the financial ledger.
  - The bot then sends a confirmation message back to the user.
- **Frontend:**
  - The user does not need to interact with the frontend to perform this task. However, the results are immediately visible.
  - The `components/dashboard-view.tsx` will reflect the updated expense numbers, and `components/inventory-management.tsx` will show the new stock levels.
- **Result:** The system's data is updated in real-time from a simple conversational action, with the web app serving as the verification and analysis dashboard. This creates a seamless, efficient loop from purchase to data-driven insight.