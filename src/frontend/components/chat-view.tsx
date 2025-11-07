"use client"

import { useState } from "react"
import { Send, MoreHorizontal, Bot, FileText, BarChart3, Settings, Users, Bell, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ChatViewProps {
  activeChat: string
}

export function ChatView({ activeChat }: ChatViewProps) {
  const [message, setMessage] = useState("")

  const messages = [
    {
      id: 1,
      type: "ai" as const,
      content: "Olá! Como posso ajudar você hoje com o restaurante?",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      type: "user" as const,
      content: "Preciso verificar o estoque de tomates",
      timestamp: "2:31 PM",
    },
    {
      id: 3,
      type: "ai" as const,
      content:
        "Verificando o estoque de tomates... Atualmente você tem 15kg em estoque, que está abaixo do nível recomendado de 25kg. Gostaria que eu prepare uma sugestão de pedido?",
      timestamp: "2:32 PM",
    },
  ]

  const quickActions = [
    { icon: FileText, label: "Generate report" },
    { icon: BarChart3, label: "Analyze data" },
    { icon: Settings, label: "System settings" },
    { icon: Users, label: "User management" },
    { icon: Bell, label: "Notifications" },
    { icon: Download, label: "Export data" },
  ]

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium text-foreground">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Place Holder</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            {msg.type === "ai" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
            {msg.type === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-border bg-card">
        <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button key={index} variant="outline" size="sm" className="gap-2 text-xs bg-transparent">
                <Icon className="h-3 w-3" />
                {action.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="sm" className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
