"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trash2, Edit, Plus, Clock, Users, Bot, Calendar, Lock } from "lucide-react"

interface WhatsAppSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Employee {
  id: string
  name: string
  phone: string
  role: string
}

interface Schedule {
  id: string
  name: string
  time: string
  frequency: string
  message: string
  active: boolean
}

interface CustomPrompt {
  id: string
  name: string
  content: string
  active: boolean
}

export function WhatsAppSettingsModal({ open, onOpenChange }: WhatsAppSettingsModalProps) {
  const [activeProfile, setActiveProfile] = useState<"owner" | "employee">("owner")
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "João Silva", phone: "+55 11 99999-9999", role: "Garçom" },
    { id: "2", name: "Maria Santos", phone: "+55 11 88888-8888", role: "Cozinheira" },
  ])
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      name: "Sugestão do Dia",
      time: "10:00",
      frequency: "Diário",
      message: "Bom dia! Hoje temos pratos especiais: Salmão grelhado e Risotto de camarão. Foque na venda destes!",
      active: true,
    },
    {
      id: "2",
      name: "Lembrete de Estoque",
      time: "08:00",
      frequency: "Segunda a Sexta",
      message: "Verificar estoque de ingredientes principais antes do almoço.",
      active: true,
    },
  ])

  const [ownerCustomPrompts, setOwnerCustomPrompts] = useState<CustomPrompt[]>([
    {
      id: "1",
      name: "Análise de Vendas",
      content: "Quando falar de vendas, sempre me dê sugestões de melhoria com base nos pratos que mais saem",
      active: true,
    },
  ])

  const [employeeCustomPrompts, setEmployeeCustomPrompts] = useState<CustomPrompt[]>([
    {
      id: "1",
      name: "Sugestão com Preço",
      content: "Sempre ao sugerir um prato, diga o preço e uma bebida para acompanhar",
      active: true,
    },
    {
      id: "2",
      name: "Informações Alérgicas",
      content: "Sempre ao sugerir um prato, informe ingredientes alergênicos com base na ficha técnica",
      active: true,
    },
  ])

  const [newEmployee, setNewEmployee] = useState({ name: "", phone: "", role: "" })
  const [newSchedule, setNewSchedule] = useState({
    name: "",
    time: "",
    frequency: "",
    message: "",
  })

  const [newCustomPrompt, setNewCustomPrompt] = useState({
    name: "",
    content: "",
  })

  const profiles = {
    owner: {
      name: "Restaurante A - Proprietário",
      avatar: "/restaurant-owner.png",
      prompt:
        "Você é o assistente do proprietário do Restaurante A. Ajude com análises de vendas, relatórios financeiros e decisões estratégicas.",
    },
    employee: {
      name: "Restaurante A - Funcionário",
      avatar: "/waiter-assistant.png",
      prompt:
        "Você é o assistente dos funcionários do Restaurante A. Ajude com pedidos, sugestões de pratos, informações sobre ingredientes e atendimento ao cliente.",
    },
  }

  const handleSave = () => {
    // Save logic here
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.phone && newEmployee.role) {
      setEmployees([
        ...employees,
        {
          id: Date.now().toString(),
          ...newEmployee,
        },
      ])
      setNewEmployee({ name: "", phone: "", role: "" })
    }
  }

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id))
  }

  const addSchedule = () => {
    if (newSchedule.name && newSchedule.time && newSchedule.frequency && newSchedule.message) {
      setSchedules([
        ...schedules,
        {
          id: Date.now().toString(),
          ...newSchedule,
          active: true,
        },
      ])
      setNewSchedule({ name: "", time: "", frequency: "", message: "" })
    }
  }

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id))
  }

  const addCustomPrompt = (isOwner: boolean) => {
    if (newCustomPrompt.name && newCustomPrompt.content) {
      const newPrompt = {
        id: Date.now().toString(),
        ...newCustomPrompt,
        active: true,
      }

      if (isOwner) {
        setOwnerCustomPrompts([...ownerCustomPrompts, newPrompt])
      } else {
        setEmployeeCustomPrompts([...employeeCustomPrompts, newPrompt])
      }

      setNewCustomPrompt({ name: "", content: "" })
    }
  }

  const removeCustomPrompt = (id: string, isOwner: boolean) => {
    if (isOwner) {
      setOwnerCustomPrompts(ownerCustomPrompts.filter((prompt) => prompt.id !== id))
    } else {
      setEmployeeCustomPrompts(employeeCustomPrompts.filter((prompt) => prompt.id !== id))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#2F93F2]" />
            Configurações do Bot WhatsApp
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owner">Proprietário</TabsTrigger>
            <TabsTrigger value="employee">Funcionário</TabsTrigger>
          </TabsList>

          <TabsContent value="owner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4 text-[#2F93F2]" />
                  Configurações do Perfil - Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={profiles.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      Proprietário
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-bot-name">Nome do Bot</Label>
                  <Input id="owner-bot-name" defaultValue={profiles.owner.name} placeholder="Nome do bot" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-profile-pic">Foto de Perfil (URL)</Label>
                  <Input id="owner-profile-pic" defaultValue={profiles.owner.avatar} placeholder="URL da imagem" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Funcionários com Acesso ao Bot do Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.phone}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {employee.role}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmployee(employee.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Adicionar Novo Funcionário</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="owner-emp-name">Nome</Label>
                      <Input
                        id="owner-emp-name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-emp-phone">Telefone</Label>
                      <Input
                        id="owner-emp-phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        placeholder="+55 11 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-emp-role">Cargo</Label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Garçom">Garçom</SelectItem>
                          <SelectItem value="Cozinheiro">Cozinheiro</SelectItem>
                          <SelectItem value="Gerente">Gerente</SelectItem>
                          <SelectItem value="Atendente">Atendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addEmployee} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Funcionário
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Prompts do Proprietário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="owner-system-prompt">Prompt do Sistema</Label>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      Bloqueado
                    </Badge>
                  </div>
                  <Textarea
                    id="owner-system-prompt"
                    value={profiles.owner.prompt}
                    rows={4}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este é o prompt padrão do sistema e não pode ser editado.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Prompts Personalizados</h4>
                  {ownerCustomPrompts.map((prompt) => (
                    <div key={prompt.id} className="p-4 border rounded-lg mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-sm">{prompt.name}</h5>
                            <Badge variant={prompt.active ? "default" : "secondary"} className="text-xs">
                              {prompt.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{prompt.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomPrompt(prompt.id, true)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <h5 className="text-sm font-medium mb-3">Adicionar Novo Prompt</h5>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="owner-prompt-name">Nome do Prompt</Label>
                        <Input
                          id="owner-prompt-name"
                          value={newCustomPrompt.name}
                          onChange={(e) => setNewCustomPrompt({ ...newCustomPrompt, name: e.target.value })}
                          placeholder="Ex: Análise de Vendas"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="owner-prompt-content">Conteúdo do Prompt</Label>
                        <Textarea
                          id="owner-prompt-content"
                          value={newCustomPrompt.content}
                          onChange={(e) => setNewCustomPrompt({ ...newCustomPrompt, content: e.target.value })}
                          rows={3}
                          placeholder="Ex: Quando falar de vendas, sempre me dê sugestões de melhoria..."
                        />
                      </div>
                      <Button onClick={() => addCustomPrompt(true)} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Prompt
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Agendamentos do Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{schedule.name}</h4>
                          <Badge variant={schedule.active ? "default" : "secondary"} className="text-xs">
                            {schedule.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.time}
                          </span>
                          <span>{schedule.frequency}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{schedule.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Criar Novo Agendamento</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="owner-schedule-name">Nome</Label>
                      <Input
                        id="owner-schedule-name"
                        value={newSchedule.name}
                        onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                        placeholder="Nome do agendamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-schedule-time">Horário</Label>
                      <Input
                        id="owner-schedule-time"
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-schedule-frequency">Frequência</Label>
                      <Select
                        value={newSchedule.frequency}
                        onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diário">Diário</SelectItem>
                          <SelectItem value="Segunda a Sexta">Segunda a Sexta</SelectItem>
                          <SelectItem value="Fins de Semana">Fins de Semana</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="owner-schedule-message">Mensagem</Label>
                    <Textarea
                      id="owner-schedule-message"
                      value={newSchedule.message}
                      onChange={(e) => setNewSchedule({ ...newSchedule, message: e.target.value })}
                      rows={3}
                      placeholder="Mensagem que será enviada automaticamente..."
                    />
                  </div>
                  <Button onClick={addSchedule} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employee" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4 text-[#2F93F2]" />
                  Configurações do Perfil - Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={profiles.employee.avatar || "/placeholder.svg"} />
                    <AvatarFallback>F</AvatarFallback>
                  </Avatar>
                  <div>
                    <Badge variant="secondary" className="text-xs">
                      Funcionário
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-bot-name">Nome do Bot</Label>
                  <Input id="employee-bot-name" defaultValue={profiles.employee.name} placeholder="Nome do bot" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-profile-pic">Foto de Perfil (URL)</Label>
                  <Input
                    id="employee-profile-pic"
                    defaultValue={profiles.employee.avatar}
                    placeholder="URL da imagem"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  Funcionários com Acesso ao Bot de Funcionários
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {employees
                  .filter((emp) => emp.role === "Garçom" || emp.role === "Atendente")
                  .map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.phone}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {employee.role}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEmployee(employee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Adicionar Novo Funcionário</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="employee-emp-name">Nome</Label>
                      <Input
                        id="employee-emp-name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-emp-phone">Telefone</Label>
                      <Input
                        id="employee-emp-phone"
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                        placeholder="+55 11 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-emp-role">Cargo</Label>
                      <Select
                        value={newEmployee.role}
                        onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Garçom">Garçom</SelectItem>
                          <SelectItem value="Atendente">Atendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addEmployee} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Funcionário
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Prompts do Funcionário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="employee-system-prompt">Prompt do Sistema</Label>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      Bloqueado
                    </Badge>
                  </div>
                  <Textarea
                    id="employee-system-prompt"
                    value={profiles.employee.prompt}
                    rows={4}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Este é o prompt padrão do sistema e não pode ser editado.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Prompts Personalizados</h4>
                  {employeeCustomPrompts.map((prompt) => (
                    <div key={prompt.id} className="p-4 border rounded-lg mb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-sm">{prompt.name}</h5>
                            <Badge variant={prompt.active ? "default" : "secondary"} className="text-xs">
                              {prompt.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{prompt.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomPrompt(prompt.id, false)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Adicionar Novo Prompt</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="employee-prompt-name">Nome do Prompt</Label>
                      <Input
                        id="employee-prompt-name"
                        value={newCustomPrompt.name}
                        onChange={(e) => setNewCustomPrompt({ ...newCustomPrompt, name: e.target.value })}
                        placeholder="Ex: Sugestão com Preço"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-prompt-content">Conteúdo do Prompt</Label>
                      <Textarea
                        id="employee-prompt-content"
                        value={newCustomPrompt.content}
                        onChange={(e) => setNewCustomPrompt({ ...newCustomPrompt, content: e.target.value })}
                        rows={3}
                        placeholder="Ex: Sempre ao sugerir um prato, diga o preço e uma bebida para acompanhar"
                      />
                    </div>
                    <Button onClick={() => addCustomPrompt(false)} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Prompt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Agendamentos para Funcionários
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{schedule.name}</h4>
                          <Badge variant={schedule.active ? "default" : "secondary"} className="text-xs">
                            {schedule.active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {schedule.time}
                          </span>
                          <span>{schedule.frequency}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{schedule.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Criar Novo Agendamento</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="employee-schedule-name">Nome</Label>
                      <Input
                        id="employee-schedule-name"
                        value={newSchedule.name}
                        onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                        placeholder="Nome do agendamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-schedule-time">Horário</Label>
                      <Input
                        id="employee-schedule-time"
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-schedule-frequency">Frequência</Label>
                      <Select
                        value={newSchedule.frequency}
                        onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Diário">Diário</SelectItem>
                          <SelectItem value="Segunda a Sexta">Segunda a Sexta</SelectItem>
                          <SelectItem value="Fins de Semana">Fins de Semana</SelectItem>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <Label htmlFor="employee-schedule-message">Mensagem</Label>
                    <Textarea
                      id="employee-schedule-message"
                      value={newSchedule.message}
                      onChange={(e) => setNewSchedule({ ...newSchedule, message: e.target.value })}
                      rows={3}
                      placeholder="Mensagem que será enviada automaticamente..."
                    />
                  </div>
                  <Button onClick={addSchedule} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-[#2F93F2] hover:bg-[#2F93F2]/90">
            Salvar Configurações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
