"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scissors,
  Calendar,
  Clock,
  Star,
  Phone,
  MapPin,
  Mail,
  User,
  CheckCircle,
  Award,
  Sparkles,
} from "lucide-react"
import { useServices, useAppointments } from "@/lib/hooks/useSupabase"
import { useState } from "react"

export default function ClientView() {
  const { services, loading: servicesLoading } = useServices()
  const { appointments, loading: appointmentsLoading } = useAppointments()
  const [selectedService, setSelectedService] = useState<number | null>(null)

  // Datos de ejemplo para la barbería
  const barberInfo = {
    name: "BarberPro",
    address: "Calle Principal 123, Ciudad",
    phone: "+1234567890",
    email: "info@barberpro.com",
    hours: "Lun - Vie: 9:00 - 19:00, Sáb: 9:00 - 17:00",
    rating: 4.8,
    reviews: 127
  }

  const barbers = [
    { id: 1, name: "Carlos Mendoza", specialty: "Corte clásico y moderno", rating: 4.8, experience: "5 años" },
    { id: 2, name: "Miguel Torres", specialty: "Barba y bigote", rating: 4.6, experience: "3 años" },
    { id: 3, name: "Ana García", specialty: "Corte femenino", rating: 4.9, experience: "7 años" },
  ]

  if (servicesLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando servicios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{barberInfo.name}</h1>
                <p className="text-sm text-muted-foreground">Barbería Profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{barberInfo.rating}</span>
                <span className="text-xs text-muted-foreground">({barberInfo.reviews} reseñas)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="services" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 glass-card p-2 h-14 rounded-2xl border-0">
            <TabsTrigger
              value="services"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Scissors className="h-4 w-4 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="barbers"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <User className="h-4 w-4 mr-2" />
              Barberos
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Phone className="h-4 w-4 mr-2" />
              Contacto
            </TabsTrigger>
          </TabsList>

          {/* Servicios */}
          <TabsContent value="services" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Nuestros Servicios</h2>
              <p className="text-muted-foreground text-lg">Selecciona el servicio que mejor se adapte a ti</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  className={`glass-card border-0 hover-lift group cursor-pointer transition-all ${
                    selectedService === service.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-foreground">{service.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                        ${service.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground text-base">
                      Duración: {service.duration_min} minutos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{service.duration_min} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Servicio profesional</span>
                      </div>
                      {selectedService === service.id && (
                        <div className="pt-4 border-t border-border">
                          <Button className="w-full gradient-bg text-white hover:opacity-90">
                            <Calendar className="h-4 w-4 mr-2" />
                            Reservar Cita
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Barberos */}
          <TabsContent value="barbers" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Nuestros Barberos</h2>
              <p className="text-muted-foreground text-lg">Profesionales expertos en su arte</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {barbers.map((barber) => (
                <Card key={barber.id} className="glass-card border-0 hover-lift group">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-primary/10">
                      <AvatarImage src={`/placeholder-user.jpg`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {barber.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl font-bold text-foreground">{barber.name}</CardTitle>
                    <CardDescription className="text-muted-foreground text-base">
                      {barber.specialty}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(barber.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{barber.rating}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{barber.experience} de experiencia</span>
                    </div>
                    <Button variant="outline" className="w-full border-border hover:bg-muted/50">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reservar con {barber.name.split(' ')[0]}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contacto */}
          <TabsContent value="contact" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Contacto</h2>
              <p className="text-muted-foreground text-lg">Estamos aquí para ayudarte</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="glass-card border-0 hover-lift">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dirección</p>
                      <p className="text-sm text-muted-foreground">{barberInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Teléfono</p>
                      <p className="text-sm text-muted-foreground">{barberInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{barberInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Horarios</p>
                      <p className="text-sm text-muted-foreground">{barberInfo.hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 hover-lift">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Reservar Cita</CardTitle>
                  <CardDescription>Reserva tu cita de forma rápida y fácil</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full gradient-bg text-white hover:opacity-90 h-12 text-lg">
                    <Calendar className="h-5 w-5 mr-2" />
                    Reservar Ahora
                  </Button>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Confirmación inmediata</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Recordatorio por SMS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cancelación gratuita</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}