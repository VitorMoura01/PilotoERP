// API configuration
// Prefer a runtime-injected value (window.__ENV) so the container can set the API URL
// without rebuilding the Next.js bundle. Falls back to build-time NEXT_PUBLIC_API_URL
// and finally to localhost for local dev.
const RUNTIME_API_URL = (typeof window !== 'undefined' && (window as any).__ENV && (window as any).__ENV.NEXT_PUBLIC_API_URL) || undefined;
const API_BASE_URL = RUNTIME_API_URL || (typeof globalThis !== 'undefined' ? (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL : undefined) || 'http://localhost:8000';

// Generic API error type
export interface ApiError {
  message: string;
  status: number;
}

// Types for API responses
export interface DailyMetrics {
  revenue_today: number;
  orders_today: number;
  items_below_threshold: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface PerformanceData {
  period: string;
  sales: number;
  orders: number;
}

export interface ProfitLossData {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

export interface MenuItemPerformance {
  name: string;
  popularity: number;
  profitability: number;
  category: string;
}

export interface InventoryCategory {
  category: string;
  value: number;
  color: string;
}

// API utility functions
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: ApiError = {
      message: 'An error occurred while fetching the data.',
      status: response.status,
    };
    throw error;
  }

  return response.json();
}

// Revenue related endpoints
export async function fetchRevenueToday(restaurantId: number): Promise<{ revenue_today: number }> {
  return fetchApi(`/restaurants/${restaurantId}/revenue/today`);
}

export async function fetchOrdersToday(restaurantId: number): Promise<{ orders_today: number }> {
  return fetchApi(`/restaurants/${restaurantId}/orders/today`);
}

export async function fetchInventoryBelowThreshold(restaurantId: number): Promise<{ items_below_threshold: number }> {
  return fetchApi(`/restaurants/${restaurantId}/inventory/below-threshold`);
}

export async function fetchRevenueLast30Days(restaurantId: number): Promise<RevenueData[]> {
  return fetchApi(`/restaurants/${restaurantId}/revenue/history?days=30`);
}

export async function fetchPerformanceComparison(restaurantId: number): Promise<PerformanceData[]> {
  return fetchApi(`/restaurants/${restaurantId}/performance/comparison`);
}

export async function fetchProfitLoss(restaurantId: number): Promise<ProfitLossData[]> {
  return fetchApi(`/restaurants/${restaurantId}/financial/profit-loss`);
}

export async function fetchMenuPerformance(restaurantId: number): Promise<MenuItemPerformance[]> {
  return fetchApi(`/restaurants/${restaurantId}/menu/performance`);
}

export async function fetchInventoryValue(restaurantId: number): Promise<InventoryCategory[]> {
  return fetchApi(`/restaurants/${restaurantId}/inventory/value-by-category`);
}

export async function fetchRecentOrders(restaurantId: number): Promise<Order[]> {
  return fetchApi(`/restaurants/${restaurantId}/orders/recent`);
}

export interface Order {
  id: number;
  customer_name: string | null;
  total_amount: number;
  status: string;
  timestamp: string;
  items: {
    quantity: number;
    menu_item: {
      name: string;
      price: number;
    };
  }[];
}

export async function fetchInventoryItems(restaurantId: number): Promise<InventoryItem[]> {
  return fetchApi(`/restaurants/${restaurantId}/inventory`);
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  min_threshold: number;
  unit_cost: number;
  last_updated: string;
}

// KPI Dashboard Data
export interface KPIData {
  revenue_today: number;
  orders_today: number;
  low_stock_items: number;
  revenue_this_year: {
    date: string;
    year_month: string;
    revenue: number;
  }[];
}

export async function fetchKPIs(restaurantId: number): Promise<KPIData> {
  return fetchApi(`/dashboard/kpis?restaurant_id=${restaurantId}`);
}