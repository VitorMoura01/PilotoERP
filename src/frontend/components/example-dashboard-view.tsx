import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LoadingCard } from '@/components/ui/loading-spinner'
import { ErrorCard } from '@/components/ui/error-card'
import { Share } from 'lucide-react'
import { 
  fetchRevenueToday, 
  fetchOrdersToday, 
  fetchInventoryBelowThreshold,
  fetchRevenueLast30Days,
  fetchPerformanceComparison,
  fetchProfitLoss,
  fetchMenuPerformance,
  fetchInventoryValue,
  fetchRecentOrders,
  fetchInventoryItems,
  type RevenueData,
  type PerformanceData,
  type ProfitLossData,
  type MenuItemPerformance,
  type InventoryCategory,
  type Order,
  type InventoryItem
} from '@/lib/api'

// This is a temporary file to show how to integrate with the API
// You can copy parts of this into your dashboard-view.tsx

interface DashboardViewProps {
  activePanel: string
}

export function DashboardView({ activePanel }: DashboardViewProps) {
  const [revenueToday, setRevenueToday] = useState(0)
  const [ordersToday, setOrdersToday] = useState(0)
  const [inventoryBelowThreshold, setInventoryBelowThreshold] = useState(0)
  const [revenueLast30Days, setRevenueLast30Days] = useState<RevenueData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([])
  const [menuMatrixData, setMenuMatrixData] = useState<MenuItemPerformance[]>([])
  const [inventoryValueData, setInventoryValueData] = useState<InventoryCategory[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const restaurantId = 1 // Replace with dynamic restaurant ID if needed
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [
          revenueToday,
          ordersToday,
          inventoryThreshold,
          revenueLast30Days,
          performance,
          profitLoss,
          menuPerformance,
          inventoryValue,
          orders,
          inventory
        ] = await Promise.all([
          fetchRevenueToday(restaurantId),
          fetchOrdersToday(restaurantId),
          fetchInventoryBelowThreshold(restaurantId),
          fetchRevenueLast30Days(restaurantId),
          fetchPerformanceComparison(restaurantId),
          fetchProfitLoss(restaurantId),
          fetchMenuPerformance(restaurantId),
          fetchInventoryValue(restaurantId),
          fetchRecentOrders(restaurantId),
          fetchInventoryItems(restaurantId)
        ])

        setRevenueToday(revenueToday.revenue_today)
        setOrdersToday(ordersToday.orders_today)
        setInventoryBelowThreshold(inventoryThreshold.items_below_threshold)
        setRevenueLast30Days(revenueLast30Days)
        setPerformanceData(performance)
        setProfitLossData(profitLoss)
        setMenuMatrixData(menuPerformance)
        setInventoryValueData(inventoryValue)
        setRecentOrders(orders)
        setInventoryItems(inventory)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [activePanel, timeRange])

  if (error) {
    return <ErrorCard message={error} />
  }

  if (isLoading) {
    return <LoadingCard />
  }

  // Example of how to use the data in your components:
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Receita Hoje</p>
            <h3 className="text-2xl font-bold">R$ {revenueToday.toFixed(2)}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pedidos Hoje</p>
            <h3 className="text-2xl font-bold">{ordersToday}</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Itens Abaixo do Mínimo</p>
            <h3 className="text-2xl font-bold text-destructive">{inventoryBelowThreshold}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.customer_name || 'N/A'}</td>
                    <td className="p-2">R$ {order.total_amount.toFixed(2)}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">{new Date(order.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add your charts and other components here, using the data from the state */}
    </div>
  )
}