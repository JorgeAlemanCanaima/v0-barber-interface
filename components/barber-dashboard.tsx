"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  Users,
  Scissors,
  Calendar,
  Clock,
  Star,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Phone,
  Edit,
  Settings,
  Bell,
  BarChart3,
  Sparkles,
  Package,
  AlertTriangle,
  History,
  Gift,
  CreditCard,
  MessageSquare,
  Camera,
  Download,
  Upload,
  Trash2,
  Eye,
  UserCheck,
  Zap,
  Heart,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts"
import { useBarbers, useServices, useAppointments } from "@/lib/hooks/useSupabase"

// Datos de ejemplo (mantenidos para gráficos y datos que no están en la BD)
const earningsData = [
  { name: "Ene", earnings: 4200, clients: 168 },
  { name: "Feb", earnings: 3800, clients: 152 },
  { name: "Mar", earnings: 5100, clients: 204 },
  { name: "Abr", earnings: 4600, clients: 184 },
  { name: "May", earnings: 5800, clients: 232 },
  { name: "Jun", earnings: 6200, clients: 248 },
]

const haircutTypes = [
  { name: "Fade Clásico", value: 35, color: "hsl(var(--chart-1))", count: 87 },
  { name: "Corte Tijera", value: 25, color: "hsl(var(--chart-2))", count: 62 },
  { name: "Buzz Cut", value: 20, color: "hsl(var(--chart-3))", count: 50 },
  { name: "Pompadour", value: 12, color: "hsl(var(--chart-4))", count: 30 },
  { name: "Otros", value: 8, color: "hsl(var(--chart-5))", count: 20 },
]

const recentClients = [
  { id: 1, name: "Carlos Mendoza", service: "Fade Clásico", time: "10:30", price: 25, rating: 5, visits: 12 },
  { id: 2, name: "Miguel Torres", service: "Corte + Barba", time: "11:15", price: 35, rating: 5, visits: 8 },
  { id: 3, name: "Juan Pérez", service: "Buzz Cut", time: "12:00", price: 20, rating: 4, visits: 15 },
  { id: 4, name: "Roberto Silva", service: "Pompadour", time: "14:30", price: 30, rating: 5, visits: 6 },
  { id: 5, name: "Diego Ramírez", service: "Fade + Barba", time: "15:45", price: 40, rating: 5, visits: 9 },
]

const upcomingAppointments = [
  { id: 1, name: "Luis García", service: "Fade Clásico", time: "16:00", phone: "+1234567890", duration: "30 min" },
  { id: 2, name: "Pedro Martín", service: "Corte Tijera", time: "16:30", phone: "+1234567891", duration: "35 min" },
  { id: 3, name: "Antonio López", service: "Buzz Cut", time: "17:00", phone: "+1234567892", duration: "20 min" },
]

const inventoryData = [
  { id: 1, name: "Shampoo Premium", category: "Cuidado", stock: 12, minStock: 5, price: 25, status: "ok" },
  { id: 2, name: "Cera para Cabello", category: "Styling", stock: 3, minStock: 8, price: 18, status: "low" },
  { id: 3, name: "Aceite para Barba", category: "Barba", stock: 8, minStock: 5, price: 22, status: "ok" },
  {
    id: 4,
    name: "Tijeras Profesionales",
    category: "Herramientas",
    stock: 2,
    minStock: 3,
    price: 120,
    status: "critical",
  },
  { id: 5, name: "Máquina Clipper", category: "Herramientas", stock: 4, minStock: 2, price: 180, status: "ok" },
  { id: 6, name: "Toallas Premium", category: "Accesorios", stock: 15, minStock: 10, price: 12, status: "ok" },
]

const clientHistory = [
  {
    id: 1,
    clientName: "Carlos Mendoza",
    visits: [
      {
        date: "2024-06-10",
        service: "Fade Clásico",
        price: 25,
        rating: 5,
        photo: "/placeholder-3491y.png?height=100&width=100&query=fade-result-1",
      },
      {
        date: "2024-05-15",
        service: "Corte + Barba",
        price: 35,
        rating: 5,
        photo: "/placeholder-3491y.png?height=100&width=100&query=fade-result-2",
      },
      {
        date: "2024-04-20",
        service: "Fade Clásico",
        price: 25,
        rating: 4,
        photo: "/placeholder-3491y.png?height=100&width=100&query=fade-result-3",
      },
    ],
    preferences: "Le gusta el fade bajo, sin barba muy corta",
    allergies: "Ninguna",
    totalSpent: 285,
    loyaltyPoints: 28,
  },
  {
    id: 2,
    clientName: "Miguel Torres",
    visits: [
      {
        date: "2024-06-12",
        service: "Pompadour",
        price: 30,
        rating: 5,
        photo: "/placeholder-3491y.png?height=100&width=100&query=pompadour-result-1",
      },
      {
        date: "2024-05-28",
        service: "Corte Tijera",
        price: 28,
        rating: 4,
        photo: "/placeholder-3491y.png?height=100&width=100&query=pompadour-result-2",
      },
    ],
    preferences: "Prefiere cortes con volumen, usa productos naturales",
    allergies: "Alérgico a productos con alcohol",
    totalSpent: 158,
    loyaltyPoints: 15,
  },
]

const notifications = [
  {
    id: 1,
    type: "appointment",
    title: "Cita en 30 minutos",
    message: "Luis García - Fade Clásico",
    time: "hace 5 min",
    urgent: true,
  },
  {
    id: 2,
    type: "inventory",
    title: "Stock bajo",
    message: "Cera para Cabello - Solo quedan 3 unidades",
    time: "hace 1 hora",
    urgent: true,
  },
  {
    id: 3,
    type: "review",
    title: "Nueva reseña",
    message: "Carlos Mendoza dejó una reseña de 5 estrellas",
    time: "hace 2 horas",
    urgent: false,
  },
  {
    id: 4,
    type: "payment",
    title: "Pago recibido",
    message: "Pago de $35 - Miguel Torres",
    time: "hace 3 horas",
    urgent: false,
  },
  {
    id: 5,
    type: "birthday",
    title: "Cumpleaños cliente",
    message: "Juan Pérez cumple años mañana",
    time: "hace 4 horas",
    urgent: false,
  },
]

const styleGallery = [
  {
    id: 1,
    name: "Fade Moderno",
    category: "Fade",
    image: "/placeholder-3491y.png?height=200&width=200&query=modern-fade",
    likes: 45,
    trending: true,
  },
  {
    id: 2,
    name: "Pompadour Clásico",
    category: "Clásico",
    image: "/placeholder-3491y.png?height=200&width=200&query=classic-pompadour",
    likes: 32,
    trending: false,
  },
  {
    id: 3,
    name: "Undercut Texturizado",
    category: "Moderno",
    image: "/placeholder-3491y.png?height=200&width=200&query=textured-undercut",
    likes: 28,
    trending: true,
  },
  {
    id: 4,
    name: "Buzz Cut Militar",
    category: "Corto",
    image: "/placeholder-3491y.png?height=200&width=200&query=military-buzz",
    likes: 19,
    trending: false,
  },
  {
    id: 5,
    name: "Quiff Elegante",
    category: "Elegante",
    image: "/placeholder-3491y.png?height=200&width=200&query=elegant-quiff",
    likes: 37,
    trending: true,
  },
  {
    id: 6,
    name: "Fade con Diseño",
    category: "Artístico",
    image: "/placeholder-3491y.png?height=200&width=200&query=design-fade",
    likes: 52,
    trending: true,
  },
]

export function BarberDashboard() {
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments()

  // Calcular estadísticas en tiempo real
  const { todayEarnings, todayClients, popularServiceName, averageRating } = useMemo(() => {
    const attended = (appointments || []).filter((a: any) => (a.estado || a.status || "").toUpperCase() === "ATENDIDA")
    
    const earnings = attended.reduce((sum: number, a: any) => sum + (a.service?.price || 0), 0)
    const clients = attended.length
    
    // Servicio más popular
    const serviceCounts = (services || []).reduce((acc: any, service: any) => {
      const count = (appointments || []).filter((apt: any) => apt.service_id === service.id).length
      acc[service.id] = { name: service.name, count }
      return acc
    }, {})
    
    const popularService = Object.values(serviceCounts).reduce((prev: any, current: any) => 
      current.count > prev.count ? current : prev, 
      { name: 'N/A', count: 0 }
    ) as { name: string, count: number }
    
    // Rating promedio (usando valor por defecto ya que no hay campo rating en el esquema)
    const rating = 4.8
    
    return {
      todayEarnings: earnings,
      todayClients: clients,
      popularServiceName: popularService.name,
      averageRating: rating
    }
  }, [appointments, services])

  if (barbersLoading || servicesLoading || appointmentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="glass-card sticky top-0 z-50 border-b-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg shadow-lg">
                    <Scissors className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">BarberPro</h1>
                  <p className="text-sm text-muted-foreground font-medium">Panel Administrativo</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent relative">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificaciones</span>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">2</span>
                </div>
              </Button>
              <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Configuración</span>
              </Button>
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-xl glass-card">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">15 Junio 2024</span>
              </div>
              <Avatar className="h-12 w-12 ring-4 ring-primary/20 hover-lift cursor-pointer">
                <AvatarImage src="/barber-shop.png" />
                <AvatarFallback className="gradient-bg text-white font-bold text-lg">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Ganancias Hoy
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">${todayEarnings.toFixed(0)}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-bold text-green-600">+12%</span>
                </div>
                <p className="text-sm text-muted-foreground">vs ayer</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Clientes Atendidos
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{todayClients}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600">+3</span>
                </div>
                <p className="text-sm text-muted-foreground">vs ayer</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Servicio Popular
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{popularServiceName}</div>
              <p className="text-sm text-muted-foreground font-medium">Servicio más popular</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Satisfacción
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Award className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-4xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Promedio de {barbers.length} barberos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8 animate-slide-up">
          <TabsList className="grid w-full grid-cols-7 glass-card p-2 h-14 rounded-2xl border-0">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Scissors className="h-4 w-4 mr-2" />
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Package className="h-4 w-4 mr-2" />
              Inventario
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Camera className="h-4 w-4 mr-2" />
              Galería
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift relative"
            >
              <Bell className="h-4 w-4 mr-2" />
              Alertas
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 glass-card border-0 hover-lift">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                    Evolución de Ingresos
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Rendimiento financiero de los últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={earningsData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "16px",
                          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [`$${value}`, "Ingresos"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="url(#colorEarnings)"
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 3 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Haircut Types Chart */}
              <Card className="col-span-3 glass-card border-0 hover-lift">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-foreground">Servicios Populares</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">
                    Distribución de servicios más solicitados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={haircutTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {haircutTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "16px",
                          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Porcentaje"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {haircutTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm font-medium text-foreground">{type.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-foreground">{type.value}%</span>
                          <p className="text-xs text-muted-foreground">{type.count} servicios</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Actividad Reciente</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Últimos clientes atendidos hoy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments
                    .filter(apt => apt.estado === 'ATENDIDA')
                    .slice(0, 5)
                    .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                          <AvatarImage src={`/placeholder-3491y.png?height=48&width=48&query=client-${appointment.client_id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {appointment.client?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{appointment.client?.name || 'Cliente'}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service?.name || 'Servicio'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(appointment.fecha_hora).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">${appointment.service?.price || 0}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service?.duration_min || 0} min</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestión de Inventario</h2>
                <p className="text-muted-foreground text-base">Control de productos y herramientas</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </div>
            </div>

            {/* Alertas de stock */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Stock Crítico</p>
                      <p className="text-2xl font-bold text-red-600">1</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                      <p className="text-2xl font-bold text-yellow-600">1</p>
                    </div>
                    <Package className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold text-green-600">$1,247</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de productos */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Productos en Stock</CardTitle>
                <CardDescription>Gestiona tu inventario de productos y herramientas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "critical"
                              ? "bg-red-500"
                              : item.status === "low"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Stock</p>
                          <p className="font-bold text-foreground">{item.stock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Mín.</p>
                          <p className="font-bold text-foreground">{item.minStock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Precio</p>
                          <p className="font-bold text-foreground">${item.price}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Galería de Estilos</h2>
                <p className="text-muted-foreground text-base">Catálogo visual de cortes y estilos</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Foto
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Estilo
                </Button>
              </div>
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap gap-2">
              {["Todos", "Fade", "Clásico", "Moderno", "Corto", "Elegante", "Artístico"].map((category) => (
                <Button
                  key={category}
                  variant={category === "Todos" ? "default" : "outline"}
                  size="sm"
                  className={
                    category === "Todos"
                      ? "gradient-bg text-white"
                      : "border-border hover:bg-muted/50 bg-transparent hover-lift"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Galería de estilos */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {styleGallery.map((style) => (
                <Card key={style.id} className="glass-card border-0 hover-lift group overflow-hidden">
                  <div className="relative">
                    <img
                      src={style.image || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {style.trending && (
                      <Badge className="absolute top-4 left-4 gradient-bg text-white border-0 shadow-lg">
                        <Zap className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Heart className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-medium">{style.likes}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/20 backdrop-blur-sm text-white border-0"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/20 backdrop-blur-sm text-white border-0"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-foreground">{style.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {style.category}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Centro de Notificaciones</h2>
                <p className="text-muted-foreground text-base">Mantente al día con todas las alertas</p>
              </div>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                <UserCheck className="h-4 w-4 mr-2" />
                Marcar Todo Leído
              </Button>
            </div>

            {/* Resumen de notificaciones */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                      <p className="text-2xl font-bold text-red-600">2</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Citas Hoy</p>
                      <p className="text-2xl font-bold text-blue-600">3</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reseñas</p>
                      <p className="text-2xl font-bold text-green-600">1</p>
                    </div>
                    <Star className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cumpleaños</p>
                      <p className="text-2xl font-bold text-purple-600">1</p>
                    </div>
                    <Gift className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de notificaciones */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Notificaciones Recientes</CardTitle>
                <CardDescription>Últimas alertas y actualizaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                        notification.urgent
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                          : "bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.type === "appointment"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : notification.type === "inventory"
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : notification.type === "review"
                                  ? "bg-green-100 dark:bg-green-900/30"
                                  : notification.type === "payment"
                                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                                    : "bg-purple-100 dark:bg-purple-900/30"
                          }`}
                        >
                          {notification.type === "appointment" && <Calendar className="h-5 w-5 text-blue-600" />}
                          {notification.type === "inventory" && <Package className="h-5 w-5 text-yellow-600" />}
                          {notification.type === "review" && <Star className="h-5 w-5 text-green-600" />}
                          {notification.type === "payment" && <CreditCard className="h-5 w-5 text-emerald-600" />}
                          {notification.type === "birthday" && <Gift className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {notification.urgent && (
                          <Badge variant="destructive" className="bg-red-500 text-white">
                            Urgente
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestión de Citas</h2>
                <p className="text-muted-foreground text-base">Visualiza y administra todas las citas reservadas</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Cita
                </Button>
              </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Buscar por nombre, teléfono o servicio..."
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none">
                  <option value="all">Todos los estados</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="CONFIRMADA">Confirmadas</option>
                  <option value="CANCELADA">Canceladas</option>
                  <option value="ATENDIDA">Atendidas</option>
                </select>
                <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Lista de citas */}
            <div className="space-y-4">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.fecha_hora)
                  const date = appointmentDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                  const time = appointmentDate.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })
                  
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'PENDIENTE':
                        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Calendar className="h-3 w-3 mr-1" />Pendiente</Badge>
                      case 'CONFIRMADA':
                        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><Star className="h-3 w-3 mr-1" />Confirmada</Badge>
                      case 'CANCELADA':
                        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><AlertTriangle className="h-3 w-3 mr-1" />Cancelada</Badge>
                      case 'ATENDIDA':
                        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300"><Star className="h-3 w-3 mr-1" />Atendida</Badge>
                      default:
                        return <Badge variant="outline">{status}</Badge>
                    }
                  }

                  return (
                    <Card key={appointment.id} className="glass-card border-0 hover-lift">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback className="gradient-bg text-white font-bold">
                                  {appointment.client?.name?.split(' ').map(n => n[0]).join('') || 'C'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-lg text-foreground">
                                  {appointment.client?.name || 'Cliente'}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {appointment.client?.phone || 'Sin teléfono'}
                                </p>
                              </div>
                              {getStatusBadge(appointment.estado)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">Fecha:</span>
                                <span className="font-medium">{date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">Hora:</span>
                                <span className="font-medium">{time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Scissors className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">Servicio:</span>
                                <span className="font-medium">{appointment.service?.name || 'Servicio'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ${appointment.service?.price || 0}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.service?.duration_min || 30} min
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card className="glass-card border-0 text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No hay citas</h3>
                    <p className="text-muted-foreground">
                      No hay citas reservadas en este momento
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestión de Clientes</h2>
                <p className="text-muted-foreground text-base">Administra tu base de clientes y su historial</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Buscar clientes..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Historial detallado de clientes */}
            <div className="space-y-6">
              {clientHistory.map((client) => (
                <Card key={client.id} className="glass-card border-0 hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                          <AvatarImage src={`/placeholder-3491y.png?height=64&width=64&query=client-${client.id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {client.clientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{client.clientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.visits.length} visitas • ${client.totalSpent} gastado
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {client.loyaltyPoints} puntos
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800"
                            >
                              Cliente VIP
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                        <History className="h-4 w-4 mr-2" />
                        Ver Historial Completo
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Últimas Visitas</h4>
                        <div className="space-y-3">
                          {client.visits.slice(0, 3).map((visit, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                              <img
                                src={visit.photo || "/placeholder.svg"}
                                alt={`Resultado ${visit.service}`}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{visit.service}</p>
                                <p className="text-sm text-muted-foreground">{visit.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground">${visit.price}</p>
                                <div className="flex items-center">
                                  {[...Array(visit.rating)].map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Información Personal</h4>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Preferencias</p>
                            <p className="text-foreground">{client.preferences}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Alergias</p>
                            <p className="text-foreground">{client.allergies}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Mensaje
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Llamar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
