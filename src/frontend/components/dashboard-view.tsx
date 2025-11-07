import { useEffect, useState } from "react"
import {
  Share,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts"
import { fetchKPIs, KPIData } from "@/lib/api"

interface DashboardViewProps {
  activePanel: string
}

const TimeFilter = () => (
  <Select defaultValue="30d">
    <SelectTrigger className="w-32">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="7d">7 dias</SelectItem>
      <SelectItem value="30d">30 dias</SelectItem>
      <SelectItem value="90d">90 dias</SelectItem>
      <SelectItem value="1y">1 ano</SelectItem>
    </SelectContent>
  </Select>
)

// Sample data for charts
const revenueData = [
  { date: "01/12", revenue: 2400 },
  { date: "02/12", revenue: 1398 },
  { date: "03/12", revenue: 9800 },
  { date: "04/12", revenue: 3908 },
  { date: "05/12", revenue: 4800 },
  { date: "06/12", revenue: 3800 },
  { date: "07/12", revenue: 4300 },
]

const performanceData = [
  { period: "Este Período", sales: 45000, orders: 320 },
  { period: "Período Anterior", sales: 38000, orders: 280 },
]

const profitLossData = [
  { month: "Jan", revenue: 45000, costs: 32000, profit: 13000 },
  { month: "Fev", revenue: 52000, costs: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, costs: 33000, profit: 15000 },
  { month: "Abr", revenue: 61000, costs: 38000, profit: 23000 },
]

const menuMatrixData = [
  { name: "Pizza Margherita", popularity: 85, profitability: 12.5, category: "Stars" },
  { name: "Hambúrguer Clássico", popularity: 92, profitability: 8.2, category: "Plowhorses" },
  { name: "Salmão Grelhado", popularity: 35, profitability: 18.7, category: "Puzzles" },
  { name: "Salada Caesar", popularity: 28, profitability: 4.1, category: "Dogs" },
]

const inventoryValueData = [
  { category: "Carnes", value: 15000, color: "#2F93F2" },
  { category: "Vegetais", value: 8000, color: "#10B981" },
  { category: "Laticínios", value: 6000, color: "#F59E0B" },
  { category: "Grãos", value: 4000, color: "#EF4444" },
]

export function DashboardView({ activePanel }: DashboardViewProps) {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const restaurantId = 1 // TODO: Get from context/auth

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        setLoading(true)
        const data = await fetchKPIs(restaurantId)
        setKpiData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching KPIs:', err)
        setError('Failed to load KPI data')
      } finally {
        setLoading(false)
      }
    }

    loadKPIs()
  }, [restaurantId])

  // Transform revenue_this_year data for charts
  const revenueData = kpiData?.revenue_this_year.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    revenue: item.revenue
  })) || []
  const renderGeneralPanel = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      )
    }

    if (error || !kpiData) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">{error || 'Erro ao carregar dados'}</p>
        </div>
      )
    }

    const averageTicket = kpiData.orders_today > 0 
      ? kpiData.revenue_today / kpiData.orders_today 
      : 0

    return (
    <div className="space-y-6">
      {/* Top Row - KPI Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Hoje</p>
                <p className="text-2xl font-bold">
                  R$ {kpiData.revenue_today.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Atualizado em tempo real
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos Hoje</p>
                <p className="text-2xl font-bold">{kpiData.orders_today}</p>
                <p className="text-xs text-muted-foreground">
                  Atualizado em tempo real
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Calculado automaticamente
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mid Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Receita - Últimos 30 Dias</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Receita"]} />
                <Line type="monotone" dataKey="revenue" stroke="#2F93F2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Este Período vs. Período Anterior</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#2F93F2" name="Vendas (R$)" />
                <Bar dataKey="orders" fill="#10B981" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#1234</TableCell>
                <TableCell>14:30</TableCell>
                <TableCell>João Silva</TableCell>
                <TableCell>R$ 85,00</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completo</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#1235</TableCell>
                <TableCell>14:45</TableCell>
                <TableCell>Maria Santos</TableCell>
                <TableCell>R$ 120,00</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#1236</TableCell>
                <TableCell>15:00</TableCell>
                <TableCell>Pedro Costa</TableCell>
                <TableCell>R$ 95,50</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Completo</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    )
  }

  const renderFinancialPanel = () => (
    <div className="space-y-6">
      {/* Top Row - Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lucro Líquido (MTD)</p>
                <p className="text-2xl font-bold">R$ 23.450</p>
                <p className="text-xs text-green-600">+8.5% vs mês anterior</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
                <p className="text-2xl font-bold">37.7%</p>
                <p className="text-xs text-green-600">+2.1% vs mês anterior</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mid Row - P&L and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tendência P&L</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, ""]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2F93F2" name="Receita" />
                <Line type="monotone" dataKey="costs" stroke="#EF4444" name="Custos" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name="Lucro Líquido" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Fluxo de Caixa Mensal</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Entrada" />
                <Bar dataKey="costs" fill="#EF4444" name="Saída" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Cost Breakdown and Expense Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Breakdown de Custos</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="costs" fill="#2F93F2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Livro de Despesas</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Buscar fornecedor..." className="w-40" />
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>01/12</TableCell>
                  <TableCell>Fornecedor ABC</TableCell>
                  <TableCell>Ingredientes</TableCell>
                  <TableCell>R$ 1.250</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Pago</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMenuPanel = () => (
    <div className="space-y-6">
      {/* Top Row - Menu Matrix and Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Matriz do Menu</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={menuMatrixData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="popularity" name="Popularidade" />
                <YAxis dataKey="profitability" name="Lucratividade" />
                <Tooltip formatter={(value, name) => [value, name === "popularity" ? "Pedidos" : "Margem %"]} />
                <Scatter dataKey="profitability" fill="#2F93F2" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Itens Mais Vendidos</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={menuMatrixData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="popularity" fill="#2F93F2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom - Detailed Dish Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Detalhada dos Pratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Prato</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Itens Vendidos</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Margem de Lucro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuMatrixData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>{item.popularity}</TableCell>
                  <TableCell>R$ 32,00</TableCell>
                  <TableCell>R$ 18,00</TableCell>
                  <TableCell>{item.profitability}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderInventoryPanel = () => {
    if (loading || !kpiData) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      )
    }

    return (
    <div className="space-y-6">
      {/* Top - Purchase Warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Itens Abaixo do Estoque Mínimo ({kpiData.low_stock_items})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {kpiData.low_stock_items === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum item abaixo do estoque mínimo
            </p>
          ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">Tomates</p>
                  <p className="text-sm text-muted-foreground">Atual: 5kg | Mínimo: 20kg</p>
                </div>
              </div>
              <Button size="sm">Reordenar</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="font-medium">Queijo Mussarela</p>
                  <p className="text-sm text-muted-foreground">Atual: 8kg | Mínimo: 15kg</p>
                </div>
              </div>
              <Button size="sm">Reordenar</Button>
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Mid Row - Stock Value and Waste Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Valor do Estoque ao Longo do Tempo</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Valor Total"]} />
                <Line type="monotone" dataKey="revenue" stroke="#2F93F2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Custos de Desperdício</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Desperdício"]} />
                <Bar dataKey="costs" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom - Tabbed Inventory Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stock">
            <TabsList>
              <TabsTrigger value="stock">Lista de Estoque</TabsTrigger>
              <TabsTrigger value="orders">Histórico de Pedidos</TabsTrigger>
            </TabsList>
            <TabsContent value="stock">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Custo Unitário</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Tomates</TableCell>
                    <TableCell>Vegetais</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>kg</TableCell>
                    <TableCell>R$ 8,00</TableCell>
                    <TableCell>R$ 40,00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="orders">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>PO001</TableCell>
                    <TableCell>01/12/2024</TableCell>
                    <TableCell>Fornecedor ABC</TableCell>
                    <TableCell>R$ 1.250,00</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Entregue</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    )
  }

  const renderEstoquePanel = () => (
    <div className="space-y-6">
      {/* Top Row - Reorder Chart and Inventory Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Principais Itens para Reordenar</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={menuMatrixData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="popularity" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Valor do Estoque por Categoria</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Estoque", carnes: 15000, vegetais: 8000, laticinios: 6000, graos: 4000 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [`R$ ${value}`, name]} />
                <Legend />
                <Bar dataKey="carnes" stackId="a" fill="#2F93F2" name="Carnes" />
                <Bar dataKey="vegetais" stackId="a" fill="#10B981" name="Vegetais" />
                <Bar dataKey="laticinios" stackId="a" fill="#F59E0B" name="Laticínios" />
                <Bar dataKey="graos" stackId="a" fill="#EF4444" name="Grãos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom - COGS vs Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Custo dos Produtos Vendidos vs. Receita</CardTitle>
          <TimeFilter />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={profitLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="costs" fill="#EF4444" name="COGS" />
              <Line type="monotone" dataKey="revenue" stroke="#2F93F2" name="Receita" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderContasPanel = () => (
    <div className="space-y-6">
      {/* Top - Upcoming Payments Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Próximos (Próximos 30 Dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="font-medium">Fornecedor ABC - Fatura #001</p>
                  <p className="text-sm text-muted-foreground">Vence em 3 dias (05/12)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">R$ 2.450,00</p>
                <Badge className="bg-orange-100 text-orange-800">Urgente</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Distribuidora XYZ - Fatura #002</p>
                  <p className="text-sm text-muted-foreground">Vence em 7 dias (09/12)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">R$ 1.850,00</p>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mid Row - Spending by Supplier and Invoice Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gastos por Fornecedor (YTD)</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { supplier: "Fornecedor ABC", amount: 25000 },
                  { supplier: "Distribuidora XYZ", amount: 18000 },
                  { supplier: "Mercado Local", amount: 12000 },
                ]}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="supplier" type="category" width={100} />
                <Tooltip formatter={(value) => [`R$ ${value}`, "Total Gasto"]} />
                <Bar dataKey="amount" fill="#2F93F2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Status das Faturas</CardTitle>
            <TimeFilter />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Status", overdue: 5, pending: 12, paid: 28 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="overdue" stackId="a" fill="#EF4444" name="Vencidas" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pendentes" />
                <Bar dataKey="paid" stackId="a" fill="#10B981" name="Pagas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom - Detailed Invoice List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Detalhada de Faturas</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Buscar fornecedor..." className="w-40" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Fatura</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Data Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#INV001</TableCell>
                <TableCell>Fornecedor ABC</TableCell>
                <TableCell>25/11/2024</TableCell>
                <TableCell>05/12/2024</TableCell>
                <TableCell>R$ 2.450,00</TableCell>
                <TableCell>
                  <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#INV002</TableCell>
                <TableCell>Distribuidora XYZ</TableCell>
                <TableCell>28/11/2024</TableCell>
                <TableCell>09/12/2024</TableCell>
                <TableCell>R$ 1.850,00</TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderPanelContent = () => {
    switch (activePanel) {
      case "Geral":
        return renderGeneralPanel()
      case "Saúde Financeira Detalhada":
        return renderFinancialPanel()
      case "Performance do Menu & Vendas":
        return renderMenuPanel()
      case "Gestão Abrangente de Estoque":
        return renderInventoryPanel()
      case "Estoque":
        return renderEstoquePanel()
      case "Contas a Pagar":
        return renderContasPanel()
      default:
        return renderGeneralPanel()
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard {activePanel}</h1>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </div>

      {renderPanelContent()}
    </div>
  )
}
