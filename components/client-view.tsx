"use client"

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
} from "lucide-react"

const services = [
  {
    id: 1,
    name: "Fade Clásico",
    description: "Corte degradado profesional con acabado perfecto",
    price: 25,
    duration: "30 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=fade-haircut",
    popular: true,
  },
  {
    id: 2,
    name: "Corte + Barba",
    description: "Servicio completo de corte y arreglo de barba",
    price: 35,
    duration: "45 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=haircut-beard",
    popular: true,
  },
  {
    id: 3,
    name: "Buzz Cut",
    description: "Corte militar limpio y preciso",
    price: 20,
    duration: "20 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=buzz-cut",
    popular: false,
  },
  {
    id: 4,
    name: "Pompadour",
    description: "Estilo clásico con volumen y elegancia",
    price: 30,
    duration: "40 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=pompadour",
    popular: false,
  },
  {
    id: 5,
    name: "Corte Tijera",
    description: "Corte tradicional con tijera, acabado natural",
    price: 28,
    duration: "35 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=scissor-cut",
    popular: false,
  },
  {
    id: 6,
    name: "Arreglo Barba",
    description: "Perfilado y cuidado especializado de barba",
    price: 15,
    duration: "20 min",
    image: "/placeholder-3491y.png?height=200&width=300&query=beard-trim",
    popular: false,
  },
]

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

const availableSlots = [
  { time: "09:00", available: true },
  { time: "09:30", available: false },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: false },
]

export function ClientView() {
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
                className="bg-white text-primary hover:bg-white/90 shadow-xl text-lg px-8 py-4 rounded-2xl font-bold hover-lift"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Reservar Cita
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

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada corte es una obra de arte. Descubre nuestros servicios premium.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {services.map((service) => (
              <Card key={service.id} className="glass-card border-0 hover-lift group overflow-hidden">
                <div className="relative">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {service.popular && (
                    <Badge className="absolute top-4 left-4 gradient-bg text-white border-0 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-white" />
                    <span className="text-xs text-white font-medium">{service.duration}</span>
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
                  <CardDescription className="text-muted-foreground text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gradient-bg text-white hover:opacity-90 shadow-lg font-bold rounded-xl hover-lift">
                    Reservar Ahora
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Reserva tu Cita</h2>
              <p className="text-xl text-muted-foreground">
                Selecciona tu horario preferido y déjanos cuidar tu estilo.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 animate-slide-up">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-primary" />
                    Horarios Disponibles
                  </CardTitle>
                  <CardDescription>Selecciona el horario que mejor te convenga</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.available ? "outline" : "secondary"}
                        disabled={!slot.available}
                        className={`${
                          slot.available
                            ? "border-primary/20 hover:gradient-bg hover:text-white hover-lift"
                            : "opacity-50 cursor-not-allowed"
                        } rounded-xl font-semibold`}
                      >
                        {slot.available && <CheckCircle className="h-3 w-3 mr-1" />}
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-primary" />
                    Información de Contacto
                  </CardTitle>
                  <CardDescription>Completa tus datos para confirmar la cita</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Nombre Completo</label>
                    <Input placeholder="Tu nombre completo" className="rounded-xl border-border focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Teléfono</label>
                    <Input
                      placeholder="Tu número de teléfono"
                      className="rounded-xl border-border focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Servicio Deseado</label>
                    <select className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none">
                      <option>Selecciona un servicio</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name} - ${service.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Comentarios (Opcional)</label>
                    <Textarea
                      placeholder="Alguna preferencia especial o comentario..."
                      className="rounded-xl border-border focus:border-primary resize-none"
                      rows={3}
                    />
                  </div>
                  <Button className="w-full gradient-bg text-white hover:opacity-90 shadow-lg font-bold text-lg py-3 rounded-xl hover-lift">
                    Confirmar Reserva
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

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
