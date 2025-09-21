"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookingSection } from "@/components/booking-section"
import { useServices } from "@/lib/hooks/useSupabase"

export default function ReservasPage() {
  const { services, loading, error } = useServices()

  const availableSlots = [
    { time: "08:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error al cargar servicios</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-6 left-6 z-50">
        <Link href="/cliente">
          <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <BookingSection services={services || []} availableSlots={availableSlots} />
    </div>
  )
}