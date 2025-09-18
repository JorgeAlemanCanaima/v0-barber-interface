"use client"

import { BarberDashboard } from "@/components/barber-dashboard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header con navegación */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Dashboard administrativo */}
      <BarberDashboard />
    </div>
  )
}
