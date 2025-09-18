"use client"

import { useState } from "react"
import { BarberDashboard } from "@/components/barber-dashboard"
import { ClientView } from "@/components/client-view"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Eye } from "lucide-react"

export default function Home() {
  const [currentView, setCurrentView] = useState<"admin" | "client">("client")

  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3">
        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold bg-muted/80 backdrop-blur-sm">
          {currentView === "admin" ? "Vista Administrador" : "Vista Cliente"}
        </Badge>
        <div className="flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-border/50">
          <Button
            variant={currentView === "client" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("client")}
            className={`rounded-xl font-semibold transition-all ${
              currentView === "client" ? "gradient-bg text-white shadow-md" : "hover:bg-muted/50"
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Cliente
          </Button>
          <Button
            variant={currentView === "admin" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("admin")}
            className={`rounded-xl font-semibold transition-all ${
              currentView === "admin" ? "gradient-bg text-white shadow-md" : "hover:bg-muted/50"
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>

      {currentView === "admin" ? <BarberDashboard /> : <ClientView />}
    </main>
  )
}
