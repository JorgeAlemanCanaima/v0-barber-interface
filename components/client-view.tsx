"use client"

import BookingSection from "@/components/booking-section"
import { useState, useEffect } from "react"
import { useServices, useBarbers } from "@/lib/hooks/useSupabase"
import { useBooking } from "@/lib/hooks/useBooking"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Scissors,
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Award,
  Users,
  Sparkles,
  Heart,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Camera,
} from "lucide-react"
import Link from "next/link"

// Los servicios ahora se obtienen dinámicamente desde Supabase

const testimonials = [
  {
    name: "Carlos Mendoza",
    rating: 5,
    comment: "Excelente servicio, siempre salgo satisfecho. El mejor barbero de la ciudad.",
    avatar: "/placeholder-3491y.png?height=40&width=40&query=client-1",
    service: "Fade Clásico",
  },
  {
    name: "Miguel Torres",
    rating: 5,
    comment: "Profesional y atento al detalle. Mi barbería de confianza desde hace años.",
    avatar: "/placeholder-3491y.png?height=40&width=40&query=client-2",
    service: "Corte + Barba",
  },
  {
    name: "Juan Pérez",
    rating: 4,
    comment: "Ambiente agradable y cortes de calidad. Totalmente recomendado.",
    avatar: "/placeholder-3491y.png?height=40&width=40&query=client-3",
    service: "Pompadour",
  },
]

// Los horarios ahora se obtienen dinámicamente desde la base de datos

const styleShowcase = [
  {
    id: 1,
    name: "Fade Moderno",
    category: "Trending",
    image: "/placeholder-3491y.png?height=300&width=300&query=modern-fade-showcase",
    description: "El corte más solicitado del año",
    price: 25,
    duration: "30 min",
  },
  {
    id: 2,
    name: "Pompadour Elegante",
    category: "Clásico",
    image: "/placeholder-3491y.png?height=300&width=300&query=elegant-pompadour-showcase",
    description: "Estilo atemporal con toque moderno",
    price: 30,
    duration: "40 min",
  },
  {
    id: 3,
    name: "Undercut Artístico",
    category: "Premium",
    image: "/placeholder-3491y.png?height=300&width=300&query=artistic-undercut-showcase",
    description: "Diseños personalizados únicos",
    price: 45,
    duration: "60 min",
  },
  {
    id: 4,
    name: "Buzz Cut Profesional",
    category: "Ejecutivo",
    image: "/placeholder-3491y.png?height=300&width=300&query=professional-buzz-showcase",
    description: "Perfecto para el ambiente corporativo",
    price: 20,
    duration: "20 min",
  },
]

export function ClientView() {
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { getAvailableTimeSlots } = useBooking()
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])

  // Cargar horarios disponibles cuando cambie la fecha
  useEffect(() => {
    const loadSlots = async () => {
      try {
        const slots = await getAvailableTimeSlots(selectedDate)
        setAvailableSlots(slots)
      } catch (error) {
        console.error('Error loading time slots:', error)
        setAvailableSlots([])
      }
    }
    loadSlots()
  }, [selectedDate, getAvailableTimeSlots])

  if (servicesLoading || barbersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (servicesError || barbersError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error al cargar datos: {servicesError || barbersError}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-90"></div>
        <div className="relative container mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl">
                <Scissors className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">BarberPro</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
              Donde el estilo se encuentra con la perfección. Tu mejor versión te espera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-4 rounded-2xl font-bold hover-lift"
              >
                <a href="/reservas">
                  <Calendar className="h-5 w-5 mr-2" />
                  Reservar Cita
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 rounded-2xl font-bold hover-lift bg-transparent"
              >
                <Phone className="h-5 w-5 mr-2" />
                Llamar Ahora
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <p className="text-muted-foreground font-medium">Clientes Satisfechos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">4.8</div>
              <p className="text-muted-foreground font-medium">Calificación Promedio</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">5+</div>
              <p className="text-muted-foreground font-medium">Años de Experiencia</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">100%</div>
              <p className="text-muted-foreground font-medium">Dedicación</p>
            </div>
          </div>
        </div>
      </section>

      {/* Style Showcase Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Galería de Estilos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestros trabajos más destacados y encuentra tu próximo look perfecto.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            {styleShowcase.map((style) => (
              <Card key={style.id} className="glass-card border-0 hover-lift group overflow-hidden">
                <div className="relative">
                  <img
                    src={style.image || "/placeholder.svg"}
                    alt={style.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <Badge className="mb-2 gradient-bg text-white border-0 shadow-lg">{style.category}</Badge>
                      <h3 className="font-bold text-lg mb-1">{style.name}</h3>
                      <p className="text-sm opacity-90 mb-2">{style.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">${style.price}</span>
                        <span className="text-sm opacity-75">{style.duration}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    asChild
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity gradient-bg text-white border-0 shadow-lg hover-lift"
                  >
                    <a href="/reservas">
                      <Calendar className="h-4 w-4 mr-1" />
                      Reservar
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="glass-card border-0 hover-lift bg-transparent">
              <Camera className="h-5 w-5 mr-2" />
              Ver Galería Completa
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada corte es una obra de arte. Descubre nuestros servicios premium con garantía de satisfacción.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {services.map((service) => (
              <Card key={service.id} className="glass-card border-0 hover-lift group overflow-hidden">
                <div className="relative">
                  <img
                    src="/placeholder.svg"
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-white" />
                    <span className="text-xs text-white font-medium">{service.duration_min || 30} min</span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <CheckCircle className="h-3 w-3 text-white" />
                    <span className="text-xs text-white font-medium">Garantía 100%</span>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold text-lg">
                      ${service.price}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground text-base">Servicio profesional de barbería</CardDescription>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>127 reseñas</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full gradient-bg text-white hover:opacity-90 shadow-lg font-bold rounded-xl hover-lift">
                    <a href="/reservas">
                      Reservar Ahora
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
  {/* Booking Section (reusable) */}
  <BookingSection services={services} availableSlots={availableSlots} />

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-muted-foreground">
              La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 animate-slide-up">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic text-base leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="gradient-bg text-white font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Visítanos</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Estamos ubicados en el corazón de la ciudad, listos para atenderte.
            </p>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Dirección</h3>
                  <p className="text-muted-foreground">
                    Calle Principal 123
                    <br />
                    Centro, Ciudad
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Teléfono</h3>
                  <p className="text-muted-foreground">
                    +1 (555) 123-4567
                    <br />
                    Lun - Sáb: 9AM - 7PM
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    info@barberpro.com
                    <br />
                    Respuesta en 24h
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center space-x-6">
              <Button variant="outline" size="lg" className="glass-card border-0 hover-lift bg-transparent">
                <Instagram className="h-5 w-5 mr-2" />
                Instagram
              </Button>
              <Button variant="outline" size="lg" className="glass-card border-0 hover-lift bg-transparent">
                <Facebook className="h-5 w-5 mr-2" />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
