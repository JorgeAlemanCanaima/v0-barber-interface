

"use client"

import { useMemo } from "react"
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
  Loader2,
  RefreshCcw,
  AlertTriangle,
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

// ---- Helpers ---------------------------------------------------------------
const fmtMoney = (n: number | undefined | null) =>
  new Intl.NumberFormat("es-NI", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    Number.isFinite(n as number) ? (n as number) : 0
  )

const fmtTime = (d: string | Date | undefined) =>
  d ? new Date(d).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "--:--"

const todayISO = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// Datos de ejemplo para el gráfico (se muestran aunque no haya ventas aún)
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

// ---- UI piezas reutilizables ----------------------------------------------
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`glass-card border-0 hover-lift ${className}`}>
      {children}
    </Card>
  )
}

function StatCard({
  title,
  icon: Icon,
  value,
  delta,
  deltaLabel,
}: {
  title: string
  icon: any
  value: string
  delta?: string
  deltaLabel?: string
}) {
  return (
    <GlassCard>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-foreground mb-2">{value}</div>
        {delta && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs font-bold text-green-600">{delta}</span>
            </div>
            <p className="text-sm text-muted-foreground">{deltaLabel ?? "vs ayer"}</p>
          </div>
        )}
      </CardContent>
    </GlassCard>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center p-6 rounded-xl border bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-200">
      <AlertTriangle className="mr-3 h-5 w-5" />
      <span className="mr-4 font-medium">{message}</span>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="border-red-300">
          <RefreshCcw className="h-4 w-4 mr-2" /> Reintentar
        </Button>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Cargando datos…</p>
      </div>
    </div>
  )
}

// ---- Componente principal --------------------------------------------------
export default function BarberDashboard() {
  const { barbers, loading: loadingBarbers, error: errorBarbers, refetch: refetchBarbers } = useBarbers()
  const { services, loading: loadingServices, error: errorServices, refetch: refetchServices } = useServices()
  const {
    appointments,
    loading: loadingAppointments,
    error: errorAppointments,
    refetch: refetchAppointments,
  } = useAppointments({ fromISO: todayISO() }) // ejemplo: filtrar por hoy si tu hook lo soporta

  const loading = loadingBarbers || loadingServices || loadingAppointments
  const anyError = errorBarbers || errorServices || errorAppointments

  // Derivados memoizados
  const { todayEarnings, todayClients, popularServiceName } = useMemo(() => {
    const attended = (appointments || []).filter((a: any) => (a.estado || a.status || "").toUpperCase() === "ATENDIDA")

    const earnings = attended.reduce((sum: number, a: any) => sum + (a.service?.price || 0), 0)
    const clients = attended.length

    let popularName = "N/A"
    if (services && services.length) {
      const byService = services.map((s: any) => ({
        id: s.id ?? s.id_service,
        name: s.name,
        count: (appointments || []).filter((a: any) => a.service_id === (s.id ?? s.id_service)).length,
      }))
      byService.sort((a, b) => b.count - a.count)
      popularName = byService[0]?.name ?? "N/A"
    }

    return { todayEarnings: earnings, todayClients: clients, popularServiceName: popularName }
  }, [appointments, services])

  if (loading) return <LoadingState />
  if (anyError)
    return (
      <ErrorState
        message={(anyError as Error)?.message || "No se pudieron cargar los datos"}
        onRetry={() => {
          refetchBarbers?.()
          refetchServices?.()
          refetchAppointments?.()
        }}
      />
    )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
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
                <span className="text-sm font-semibold text-foreground">{new Date().toLocaleDateString("es-ES")}</span>
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
        {/* Top Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
          <StatCard title="Ganancias Hoy" icon={DollarSign} value={fmtMoney(todayEarnings)} delta="+12%" />
          <StatCard title="Clientes Atendidos" icon={Users} value={`${todayClients}`} delta="+3" />
          <StatCard title="Servicio Popular" icon={Sparkles} value={popularServiceName} />
          <GlassCard>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Satisfacción</CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-4xl font-bold text-foreground">4.8</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Promedio de {barbers?.length ?? 0} barberos</p>
            </CardContent>
          </GlassCard>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-8 animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 glass-card p-2 h-14 rounded-2xl border-0">
            <TabsTrigger value="overview" className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift">
              <BarChart3 className="h-4 w-4 mr-2" /> Resumen
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift">
              <Users className="h-4 w-4 mr-2" /> Clientes
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift">
              <Scissors className="h-4 w-4 mr-2" /> Servicios
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift">
              <Calendar className="h-4 w-4 mr-2" /> Citas
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
              <GlassCard className="col-span-4">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <TrendingUp className="h-6 w-6 mr-3 text-primary" /> Evolución de Ingresos
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-base">Rendimiento financiero de los últimos 6 meses</CardDescription>
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
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16 }} formatter={(value: any) => [`$${value}`, "Ingresos"]} />
                      <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#colorEarnings)" dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </GlassCard>

              <GlassCard className="col-span-3">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-foreground">Servicios Populares</CardTitle>
                  <CardDescription className="text-muted-foreground text-base">Distribución de servicios más solicitados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={haircutTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                        {haircutTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16 }} formatter={(value: any) => [`${value}%`, "Porcentaje"]} />
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
              </GlassCard>
            </div>

            {/* Actividad reciente */}
            <GlassCard>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Actividad Reciente</CardTitle>
                <CardDescription className="text-muted-foreground text-base">Últimos clientes atendidos hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(appointments || [])
                    .filter((a: any) => (a.estado || a.status || "").toUpperCase() === "ATENDIDA")
                    .slice(0, 5)
                    .map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                            <AvatarImage src={`/placeholder-3491y.png?height=48&width=48&query=client-${a.client_id}`} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {(a.client?.name || "C")
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{a.client?.name || "Cliente"}</p>
                            <p className="text-sm text-muted-foreground">{a.service?.name || "Servicio"}</p>
                            <p className="text-xs text-muted-foreground">{fmtTime(a.fecha_hora)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{fmtMoney(a.service?.price)}</p>
                            <p className="text-sm text-muted-foreground">{a.service?.duration_min || 0} min</p>
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
            </GlassCard>
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clients" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestión de Clientes</h2>
                <p className="text-muted-foreground text-base">Administra tu base de clientes</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Cliente
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input placeholder="Buscar clientes…" className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
              </div>
              <Button variant="outline" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                <Filter className="h-4 w-4 mr-2" /> Filtros
              </Button>
            </div>

            <GlassCard>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {(appointments || [])
                    .filter((a: any) => !!a.client)
                    .map((a: any) => (
                      <div key={a.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 ring-2 ring-primary/10 hover-lift cursor-pointer">
                              <AvatarImage src={`/placeholder-3491y.png?height=48&width=48&query=client-${a.client_id}`} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {(a.client?.name || "C")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{a.client?.name || "Cliente"}</p>
                              <p className="text-sm text-muted-foreground">Último servicio: {a.service?.name || "Servicio"}</p>
                              <p className="text-xs text-muted-foreground">{new Date(a.fecha_hora).toLocaleDateString("es-ES")}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {a.estado || a.status}
                            </Badge>
                            <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                              Ver Perfil
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>

          {/* Servicios */}
          <TabsContent value="services" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Servicios y Precios</h2>
                <p className="text-muted-foreground text-base">Gestiona tu catálogo de servicios</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Servicio
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {(services || []).map((s: any) => {
                const bookings = (appointments || []).filter((a: any) => a.service_id === (s.id ?? s.id_service)).length
                const popularity = Math.max(0, Math.min(100, Math.round(((bookings || 0) / Math.max(1, appointments?.length || 1)) * 100)))
                return (
                  <GlassCard key={s.id ?? s.id_service} className="group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-foreground">{s.name}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                          {fmtMoney(s.price)}
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground text-base">
                        Duración: {s.duration_min ?? s.duration ?? 0} min • {bookings} reservas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground font-medium">Popularidad</span>
                          <span className="text-foreground font-semibold">{popularity}%</span>
                        </div>
                        <Progress value={popularity} className="h-2" />
                      </div>
                      <div className="flex space-x-2 mt-6">
                        <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift">
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift">
                          Estadísticas
                        </Button>
                      </div>
                    </CardContent>
                  </GlassCard>
                )
              })}
            </div>
          </TabsContent>

          {/* Citas */}
          <TabsContent value="appointments" className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Próximas Citas</h2>
                <p className="text-muted-foreground text-base">Agenda del día de hoy</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift">
                  <Plus className="h-4 w-4 mr-2" /> Nueva Cita
                </Button>
                <Button variant="outline" onClick={() => refetchAppointments?.()}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Refrescar
                </Button>
              </div>
            </div>

            <GlassCard>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground">Citas de Hoy</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  {(appointments || []).filter((a: any) => (a.estado || a.status) !== "CANCELADA").length} citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(appointments || [])
                    .filter((a: any) => (a.estado || a.status) !== "CANCELADA")
                    .slice(0, 12)
                    .map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between p-5 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{a.client?.name || "Cliente"}</p>
                            <p className="text-sm text-muted-foreground">{a.service?.name || "Servicio"}</p>
                            <p className="text-xs text-muted-foreground">{a.client?.phone} • {a.service?.duration_min || 0} min</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-foreground">{fmtTime(a.fecha_hora)}</p>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {a.estado || a.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                              <Phone className="h-4 w-4 mr-1" /> Llamar
                            </Button>
                            <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                              Reagendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
