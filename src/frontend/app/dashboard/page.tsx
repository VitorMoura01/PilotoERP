"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { DashboardView } from "@/components/dashboard-view"
import { ChatView } from "@/components/chat-view"
import { WhatsAppSettingsPage } from "@/components/whatsapp-settings-page"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<"dashboard" | "chat" | "whatsapp">("dashboard")
  const [activePanel, setActivePanel] = useState("Geral")
  const [activeChat, setActiveChat] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar
          activeView={activeView}
          activePanel={activePanel}
          activeChat={activeChat}
          onViewChange={setActiveView}
          onPanelChange={setActivePanel}
          onChatChange={setActiveChat}
        />
        <main className="flex-1 ml-64">
          {activeView === "dashboard" ? (
            <DashboardView activePanel={activePanel} />
          ) : activeView === "chat" ? (
            <ChatView activeChat={activeChat} />
          ) : (
            <WhatsAppSettingsPage />
          )}
        </main>
      </div>
    </div>
  )
}
