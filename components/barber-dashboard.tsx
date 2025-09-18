"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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

// Datos de ejemplo
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

export function BarberDashboard() {
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
              <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notificaciones</span>
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
              <div className="text-4xl font-bold text-foreground mb-2">$245</div>
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
              <div className="text-4xl font-bold text-foreground mb-2">12</div>
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
              <div className="text-4xl font-bold text-foreground mb-2">Fade</div>
              <p className="text-sm text-muted-foreground font-medium">35% de todos los servicios</p>
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
                <div className="text-4xl font-bold text-foreground">4.8</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Promedio de 127 reseñas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-8 animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 glass-card p-2 h-14 rounded-2xl border-0">
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
                  {recentClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                          <AvatarImage src={`/placeholder-3491y.png?height=48&width=48&query=client-${client.id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.service}</p>
                          <p className="text-xs text-muted-foreground">{client.visits} visitas</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">${client.price}</p>
                          <p className="text-sm text-muted-foreground">{client.time}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(client.rating)].map((_, i) => (
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

          <TabsContent value="clients" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestión de Clientes</h2>
                <p className="text-muted-foreground text-base">Administra tu base de clientes</p>
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

            <Card className="glass-card border-0 hover-lift">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentClients.map((client) => (
                    <div key={client.id} className="p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                            <AvatarImage src={`/placeholder-3491y.png?height=48&width=48&query=client-${client.id}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{client.name}</p>
                            <p className="text-sm text-muted-foreground">Último servicio: {client.service}</p>
                            <p className="text-xs text-muted-foreground">{client.visits} visitas totales</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Cliente {client.visits > 10 ? "VIP" : "Regular"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          >
                            Ver Perfil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Servicios y Precios</h2>
                <p className="text-muted-foreground text-base">Gestiona tu catálogo de servicios</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Servicio
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Fade Clásico", price: 25, duration: "30 min", popularity: 85, bookings: 87 },
                { name: "Corte + Barba", price: 35, duration: "45 min", popularity: 70, bookings: 62 },
                { name: "Buzz Cut", price: 20, duration: "20 min", popularity: 60, bookings: 50 },
                { name: "Pompadour", price: 30, duration: "40 min", popularity: 45, bookings: 30 },
                { name: "Corte Tijera", price: 28, duration: "35 min", popularity: 55, bookings: 42 },
                { name: "Arreglo Barba", price: 15, duration: "20 min", popularity: 40, bookings: 28 },
              ].map((service, index) => (
                <Card key={index} className="glass-card border-0 hover-lift group">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold text-foreground">{service.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                        ${service.price}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground text-base">
                      Duración: {service.duration} • {service.bookings} reservas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Popularidad</span>
                        <span className="text-foreground font-semibold">{service.popularity}%</span>
                      </div>
                      <Progress value={service.popularity} className="h-2" />
                    </div>
                    <div className="flex space-x-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                      >
                        Estadísticas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Próximas Citas</h2>
                <p className="text-muted-foreground text-base">Agenda del día de hoy</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
            </div>

            <Card className="glass-card border-0 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Hoy - 15 de Junio</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  {upcomingAppointments.length} citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{appointment.name}</p>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.phone} • {appointment.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">{appointment.time}</p>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Confirmada
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Llamar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          >
                            Reagendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
