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
  CheckCircle,
  Clock,
  Mail,
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
import { useBarbers, useServices, useAppointments, useStats, useTodayAppointments, useAllAppointments, useChartData, useClients } from "@/lib/hooks/useSupabase"

// Todos los datos ahora vienen de la base de datos




export function BarberDashboard() {
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments()
  const { stats, loading: statsLoading, error: statsError } = useStats()
  const { appointments: todayAppointments, loading: todayLoading, error: todayError } = useTodayAppointments()
  const { appointments: allAppointments, loading: allLoading, error: allError } = useAllAppointments()
  const { earningsData, haircutTypes } = useChartData()
  const { clients } = useClients()

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

  if (barbersLoading || servicesLoading || appointmentsLoading || statsLoading || todayLoading) {
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
              <div className="text-4xl font-bold text-foreground mb-2">${stats.todayRevenue.toFixed(0)}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-bold text-green-600">Hoy</span>
                </div>
                <p className="text-sm text-muted-foreground">{stats.todayAppointments} citas</p>
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
              <div className="text-4xl font-bold text-foreground mb-2">{stats.totalClients}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600">Total</span>
                </div>
                <p className="text-sm text-muted-foreground">clientes registrados</p>
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
              <div className="text-4xl font-bold text-foreground mb-2">{stats.totalServices}</div>
              <p className="text-sm text-muted-foreground font-medium">servicios activos</p>
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
                <div className="text-4xl font-bold text-foreground">{stats.totalAppointments}</div>
                <div className="flex">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Total de citas programadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Total Usuarios
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{stats.totalUsers}</div>
              <p className="text-sm text-muted-foreground font-medium">usuarios registrados</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Ingresos Totales
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">${stats.totalRevenue.toFixed(0)}</div>
              <p className="text-sm text-muted-foreground font-medium">ingresos históricos</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Citas Hoy
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{stats.todayAppointments}</div>
              <p className="text-sm text-muted-foreground font-medium">citas atendidas hoy</p>
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
              <p className="text-sm text-muted-foreground font-medium">más solicitado</p>
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
                  {todayAppointments.length > 0 ? (
                    todayAppointments.slice(0, 5).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${appointment.client?.name || 'Cliente'}`} />
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
                              })} • {appointment.barber?.full_name || 'Barbero'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">${appointment.service?.price || 0}</p>
                            <p className="text-sm text-muted-foreground">{appointment.service?.duration_min || 0} min</p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800">
                            Atendido
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">No hay citas atendidas</p>
                      <p className="text-muted-foreground text-sm">Las citas con estado "ATENDIDA" aparecerán aquí</p>
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          💡 <strong>Tip:</strong> Para ver citas aquí, asegúrate de que tengan estado "ATENDIDA" en la base de datos
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Debug: Todas las citas */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Debug: Todas las Citas</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Últimas 10 citas en la base de datos (para verificar estados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allAppointments.length > 0 ? (
                    allAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${appointment.client?.name || 'Cliente'}`} />
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
                              {new Date(appointment.fecha_hora).toLocaleDateString('es-ES')} {new Date(appointment.fecha_hora).toLocaleTimeString('es-ES', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} • {appointment.barber?.full_name || 'Barbero'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">${appointment.service?.price || 0}</p>
                            <p className="text-sm text-muted-foreground">{appointment.service?.duration_min || 0} min</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              appointment.estado === 'ATENDIDA' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800'
                                : appointment.estado === 'CONFIRMADA'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                                : appointment.estado === 'PENDIENTE'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800'
                            }`}
                          >
                            {appointment.estado}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">No hay citas en la base de datos</p>
                      <p className="text-muted-foreground text-sm">Agrega algunas citas para verlas aquí</p>
                    </div>
                  )}
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
                <CardTitle className="text-xl font-bold text-foreground">Servicios Disponibles</CardTitle>
                <CardDescription>Gestiona tus servicios de barbería</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              service.is_active ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <p className="font-semibold text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground">Servicio de Barbería</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Precio</p>
                            <p className="font-bold text-foreground">${service.price}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Duración</p>
                            <p className="font-bold text-foreground">{service.duration_min} min</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <p className="font-bold text-foreground">{service.is_active ? "Activo" : "Inactivo"}</p>
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
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                        <Scissors className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">No hay servicios disponibles</p>
                      <p className="text-muted-foreground text-sm">Agrega servicios para verlos aquí</p>
                    </div>
                  )}
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
              {services.length > 0 ? services.map((service) => (
                <Card key={service.id} className="glass-card border-0 hover-lift group overflow-hidden">
                  <div className="relative">
                    <img
                      src="/placeholder.svg"
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4 gradient-bg text-white border-0 shadow-lg">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Disponible
                    </Badge>
                    <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Clock className="h-3 w-3 text-white" />
                      <span className="text-xs text-white font-medium">{service.duration_min} min</span>
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
                      <CardTitle className="text-lg font-bold text-foreground">{service.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        ${service.price}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mx-auto mb-6">
                    <Scissors className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Galería de Servicios</h3>
                  <p className="text-muted-foreground text-lg">
                    Los servicios aparecerán aquí cuando los agregues
                  </p>
                </div>
              )}
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
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mx-auto mb-6">
                      <Bell className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Sistema de Notificaciones</h3>
                    <p className="text-muted-foreground text-lg mb-4">
                      Las notificaciones aparecerán aquí cuando tengas:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Citas próximas</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <Star className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Nuevas reseñas</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                        <span className="text-sm">Pagos recibidos</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <Users className="h-5 w-5 text-pink-600" />
                        <span className="text-sm">Nuevos clientes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              {clients.length > 0 ? clients.map((client: any) => (
                <Card key={client.id} className="glass-card border-0 hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                          <AvatarImage src={`/placeholder-3491y.png?height=64&width=64&query=client-${client.id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {client.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Cliente registrado • {client.email || 'Sin email'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Cliente Activo
                            </Badge>
                            {client.phone && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800"
                              >
                                Con Teléfono
                              </Badge>
                            )}
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
                          {/* Información del cliente */}
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">Cliente</p>
                              <p className="text-sm text-muted-foreground">{client.name}</p>
                            </div>
                          </div>
                          {client.email && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">Email</p>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                              </div>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Phone className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">Teléfono</p>
                                <p className="text-sm text-muted-foreground">{client.phone}</p>
                              </div>
                            </div>
                          )}
                          {/* Placeholder para futuras visitas */}
                          <div className="text-center py-4 text-muted-foreground">
                            <p className="text-sm">Las visitas aparecerán aquí</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Información Personal</h4>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Notas</p>
                            <p className="text-foreground">{client.notes || 'Sin notas adicionales'}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
                            <p className="text-foreground">{new Date(client.created_at).toLocaleDateString('es-ES')}</p>
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
              )) : (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mx-auto mb-6">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Gestión de Clientes</h3>
                  <p className="text-muted-foreground text-lg">
                    Los clientes aparecerán aquí cuando los agregues
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

