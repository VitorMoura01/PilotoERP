"use client"

import { ChevronDown, User, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">Piloto</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          Perfil
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Suporte
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              Restaurante A
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Restaurante A</DropdownMenuItem>
            <DropdownMenuItem>Restaurante Centro</DropdownMenuItem>
            <DropdownMenuItem>Restaurante Norte</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
