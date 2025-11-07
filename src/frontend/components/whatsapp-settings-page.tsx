"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Lock, Save, X, Clock, User, Phone, MessageSquare } from "lucide-react"

export function WhatsAppSettingsPage() {
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [newPrompt, setNewPrompt] = useState("")
  const [newSchedule, setNewSchedule] = useState({ message: "", time: "", days: [] as string[] })

  // Mock data
  const [ownerPrompts, setOwnerPrompts] = useState([
    "Sempre ao sugerir um prato, diga o preço e uma bebida para acompanhar",
    "Quando falar de vendas, sempre me dê sugestões de melhoria com base nos pratos que mais saem",
  ])

  const [employeePrompts, setEmployeePrompts] = useState([
    "Sempre ao sugerir um prato, informe ingredientes alergênicos com base na ficha técnica",
    "Seja sempre educado e ofereça alternativas quando um prato não estiver disponível",
  ])

  const [ownerSchedules, setOwnerSchedules] = useState([
    {
      id: "1",
      message: "Relatório de vendas do dia anterior",
      time: "08:00",
      days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    },
    { id: "2", message: "Resumo semanal de performance", time: "09:00", days: ["Segunda"] },
  ])

  const [employeeSchedules, setEmployeeSchedules] = useState([
    { id: "1", message: "Sugestão do prato do dia e foco de vendas", time: "10:00", days: ["Todos os dias"] },
    { id: "2", message: "Lembrete de verificar estoque baixo", time: "14:00", days: ["Segunda", "Quarta", "Sexta"] },
  ])

  const [employees] = useState([
    { id: "1", name: "João Silva", phone: "+55 11 99999-1234", role: "Garçom", active: true },
    { id: "2", name: "Maria Santos", phone: "+55 11 99999-5678", role: "Cozinheira", active: true },
    { id: "3", name: "Pedro Costa", phone: "+55 11 99999-9012", role: "Garçom", active: false },
  ])

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Configurações do WhatsApp</h1>
          <p className="text-muted-foreground">Gerencie os perfis de bot, prompts e agendamentos para WhatsApp</p>
        </div>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="owner">Proprietário</TabsTrigger>
            <TabsTrigger value="employee">Funcionário</TabsTrigger>
          </TabsList>

          {/* Owner Profile Tab */}
          <TabsContent value="owner" className="space-y-6">
            {/* Profile Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuração do Perfil - Proprietário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/restaurant-owner.png" alt="Owner" />
                    <AvatarFallback>PR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor="owner-name">Nome do Bot</Label>
                      <Input id="owner-name" defaultValue="Assistente do Proprietário" />
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar Foto do Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Access Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Funcionários com Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.phone} • {employee.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={employee.active ? "default" : "secondary"}>
                          {employee.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {employee.active ? "Revogar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Funcionário
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System and Custom Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prompts do Proprietário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Prompt */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Prompt do Sistema</span>
                      <Badge variant="secondary">Bloqueado</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você é um assistente especializado em gestão de restaurantes. Ajude o proprietário com análises de
                    vendas, controle de estoque, relatórios financeiros e tomada de decisões estratégicas.
                  </p>
                </div>

                {/* Custom Prompts */}
                <div className="space-y-3">
                  <h4 className="font-medium">Prompts Personalizados</h4>
                  {ownerPrompts.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        {editingPrompt === `owner-${index}` ? (
                          <div className="space-y-2">
                            <Textarea defaultValue={prompt} className="min-h-[60px]" />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => setEditingPrompt(null)}>
                                <Save className="h-3 w-3 mr-1" />
                                Salvar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingPrompt(null)}>
                                <X className="h-3 w-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm">{prompt}</p>
                        )}
                      </div>
                      {editingPrompt !== `owner-${index}` && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setEditingPrompt(`owner-${index}`)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add New Prompt */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Digite um novo prompt personalizado..."
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                    />
                    <Button size="sm" disabled={!newPrompt.trim()}>
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar Prompt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ownerSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{schedule.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {schedule.time} • {schedule.days.join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employee Profile Tab */}
          <TabsContent value="employee" className="space-y-6">
            {/* Profile Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuração do Perfil - Funcionário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/waiter-assistant.png" alt="Employee" />
                    <AvatarFallback>FU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label htmlFor="employee-name">Nome do Bot</Label>
                      <Input id="employee-name" defaultValue="Assistente do Garçom" />
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar Foto do Perfil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Access Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Funcionários com Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees
                    .filter((emp) => emp.role === "Garçom")
                    .map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.phone} • {employee.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={employee.active ? "default" : "secondary"}>
                            {employee.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {employee.active ? "Revogar" : "Ativar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Funcionário
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System and Custom Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prompts do Funcionário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* System Prompt */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Prompt do Sistema</span>
                      <Badge variant="secondary">Bloqueado</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você é um assistente para funcionários de restaurante. Ajude com atendimento ao cliente, informações
                    sobre pratos, controle de pedidos e suporte operacional do dia a dia.
                  </p>
                </div>

                {/* Custom Prompts */}
                <div className="space-y-3">
                  <h4 className="font-medium">Prompts Personalizados</h4>
                  {employeePrompts.map((prompt, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm">{prompt}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Prompt */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Digite um novo prompt personalizado..."
                      value={newPrompt}
                      onChange={(e) => setNewPrompt(e.target.value)}
                    />
                    <Button size="sm" disabled={!newPrompt.trim()}>
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar Prompt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employeeSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{schedule.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {schedule.time} • {schedule.days.join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button className="bg-[#2F93F2] hover:bg-[#2F93F2]/90">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
