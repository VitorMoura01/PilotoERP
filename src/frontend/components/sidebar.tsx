"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, BarChart3, Package, CreditCard, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView: "dashboard" | "chat" | "whatsapp"
  activePanel: string
  activeChat: string
  onViewChange: (view: "dashboard" | "chat" | "whatsapp") => void
  onPanelChange: (panel: string) => void
  onChatChange: (chat: string) => void
}

export function Sidebar({
  activeView,
  activePanel,
  activeChat,
  onViewChange,
  onPanelChange,
  onChatChange,
}: SidebarProps) {
  const [chatsCollapsed, setChatsCollapsed] = useState(false)

  const panels = [
    { id: "Geral", label: "Geral", icon: BarChart3 },
    { id: "Estoque", label: "Estoque", icon: Package },
    { id: "Contas a Pagar", label: "Contas a Pagar", icon: CreditCard },
  ]

  const chats = [
    { id: "analise-vendas", title: "Análise de Vendas", preview: "Como estão as vendas desta se..." },
    { id: "controle-estoque", title: "Controle de Estoque", preview: "Preciso verificar o estoque de..." },
    { id: "relatorio-financeiro", title: "Relatório Financeiro", preview: "Gostaria de ver o fluxo de caixa" },
  ]

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto flex flex-col">
      <div className="p-4 flex-1">
        {/* Dashboards Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-sidebar-foreground uppercase tracking-wide">PAINÉIS</h2>
          </div>
          <nav className="space-y-1">
            {panels.map((panel) => {
              const Icon = panel.icon
              return (
                <Button
                  key={panel.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-9",
                    activeView === "dashboard" &&
                      activePanel === panel.id &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => {
                    onViewChange("dashboard")
                    onPanelChange(panel.id)
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {panel.label}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Chats Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-sidebar-foreground uppercase tracking-wide">CHATS</h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setChatsCollapsed(!chatsCollapsed)}
            >
              {chatsCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {!chatsCollapsed && (
            <nav className="space-y-1">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto p-3 text-left",
                    activeView === "chat" &&
                      activeChat === chat.id &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                  onClick={() => {
                    onViewChange("chat")
                    onChatChange(chat.id)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{chat.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{chat.preview}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 bg-[#2F93F2] text-white hover:bg-[#2F93F2]/90"
          onClick={() => onViewChange("whatsapp")}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          WhatsApp
        </Button>
      </div>
    </aside>
  )
}
