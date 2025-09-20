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
  Bug,
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
import { useBarbers, useServices, useAppointments, useStats, useTodayAppointments, useAllAppointments, useChartData, useClients, useAppointmentStatuses } from "@/lib/hooks/useSupabase"

// Todos los datos ahora vienen de la base de datos

// Estilos CSS personalizados para efectos burbuja
const bubbleStyles = `
  @keyframes bubble-float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-2px) scale(1.1); }
  }
  
  @keyframes bubble-pulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.2); }
  }
  
  .bubble-effect {
    animation: bubble-float 2s ease-in-out infinite;
  }
  
  .bubble-pulse {
    animation: bubble-pulse 1.5s ease-in-out infinite;
  }
`

// Definición de estados de citas
const APPOINTMENT_STATUS = {
  PENDIENTE: { code: 0, label: 'Pendiente', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-200' },
  CONFIRMADA: { code: 1, label: 'Confirmada', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-200' },
  ATENDIDA: { code: 2, label: 'Atendida', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-200' },
  CANCELADA: { code: 3, label: 'Cancelada', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', borderColor: 'border-red-200' },
  NO_SHOW: { code: 4, label: 'No se presentó', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800', borderColor: 'border-gray-200' }
} as const

// Función para obtener el estado de una cita (usando datos de la base de datos)
const getAppointmentStatus = (status: string | number | any, statuses: any[] = []) => {
  // Si viene con objeto status de la relación
  if (status && typeof status === 'object' && status.code !== undefined) {
    return {
      code: status.code,
      label: status.name,
      color: status.color,
      bgColor: `bg-${status.color}-100`,
      textColor: `text-${status.color}-800`,
      borderColor: `border-${status.color}-200`
    }
  }
  
  // Si es número, buscar en la base de datos
  if (typeof status === 'number') {
    const dbStatus = statuses.find(s => s.code === status)
    if (dbStatus) {
      return {
        code: dbStatus.code,
        label: dbStatus.name,
        color: dbStatus.color,
        bgColor: `bg-${dbStatus.color}-100`,
        textColor: `text-${dbStatus.color}-800`,
        borderColor: `border-${dbStatus.color}-200`
      }
    }
  }
  
  // Fallback a constantes locales
  if (typeof status === 'number') {
    return Object.values(APPOINTMENT_STATUS).find(s => s.code === status) || APPOINTMENT_STATUS.PENDIENTE
  }
  
  // Si es string, buscar por label
  const statusUpper = status.toUpperCase()
  return Object.values(APPOINTMENT_STATUS).find(s => s.label.toUpperCase() === statusUpper) || APPOINTMENT_STATUS.PENDIENTE
}

// Función para contar citas por estado (usando datos de la base de datos)
const countAppointmentsByStatus = (appointments: any[], statusCode: number, statuses: any[] = []) => {
  return appointments.filter(apt => {
    // Priorizar status de la relación de la base de datos
    if (apt.status && apt.status.code !== undefined) {
      return apt.status.code === statusCode
    }
    
    // Fallback a estado legacy
    const aptStatus = typeof apt.estado === 'number' ? apt.estado : getAppointmentStatus(apt.estado, statuses).code
    return aptStatus === statusCode
  }).length
}




export function BarberDashboard() {
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments()
  const { stats, loading: statsLoading, error: statsError } = useStats()
  const { appointments: todayAppointments, loading: todayLoading, error: todayError } = useTodayAppointments()
  const { appointments: allAppointments, loading: allLoading, error: allError } = useAllAppointments()
  const { earningsData, haircutTypes } = useChartData()
  const { clients } = useClients()
  const { statuses, loading: statusesLoading, error: statusesError } = useAppointmentStatuses()

  // Calcular estadísticas en tiempo real basadas en datos de la base de datos
  const { 
    todayEarnings, 
    todayClients, 
    popularServiceName, 
    averageRating, 
    totalBarbers,
    pendingAppointments,
    confirmedAppointments,
    attendedAppointments,
    cancelledAppointments,
    noShowAppointments
  } = useMemo(() => {
    // Citas atendidas hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const attendedToday = (appointments || []).filter((a: any) => {
      const aptDate = new Date(a.fecha_hora)
      // Usar status de la relación de la BD si existe, sino fallback a estado legacy
      const statusCode = a.status?.code !== undefined ? a.status.code : getAppointmentStatus(a.estado, statuses).code
      return statusCode === APPOINTMENT_STATUS.ATENDIDA.code && aptDate >= today && aptDate < tomorrow
    })
    
    const earnings = attendedToday.reduce((sum: number, a: any) => sum + (a.service?.price || 0), 0)
    const clients = attendedToday.length
    
    // Servicio más popular basado en citas atendidas
    const serviceCounts = (services || []).map((service: any) => {
      const count = (appointments || []).filter((apt: any) => {
        const statusCode = apt.status?.code !== undefined ? apt.status.code : getAppointmentStatus(apt.estado, statuses).code
        return apt.service_id === service.id && statusCode === APPOINTMENT_STATUS.ATENDIDA.code
      }).length
      return { name: service.name, count }
    })
    
    const popularService = serviceCounts.reduce((prev: any, current: any) => 
      current.count > prev.count ? current : prev, 
      { name: 'Sin datos', count: 0 }
    )
    
    // Si no hay servicios populares, mostrar el primer servicio disponible
    const finalPopularService = popularService.count > 0 ? popularService : 
      services.length > 0 ? { name: services[0].name, count: 0 } : 
      { name: 'Sin servicios', count: 0 }
    
    // Calcular rating promedio basado en citas completadas (simulado)
    const completedAppointments = (appointments || []).filter((a: any) => {
      const statusCode = a.status?.code !== undefined ? a.status.code : getAppointmentStatus(a.estado, statuses).code
      return statusCode === APPOINTMENT_STATUS.ATENDIDA.code
    })
    const rating = completedAppointments.length > 0 ? 4.2 + (Math.random() * 0.6) : 0
    
    // Contar citas por estado usando datos de la base de datos
    const pendingAppointments = countAppointmentsByStatus(appointments || [], APPOINTMENT_STATUS.PENDIENTE.code, statuses)
    const confirmedAppointments = countAppointmentsByStatus(appointments || [], APPOINTMENT_STATUS.CONFIRMADA.code, statuses)
    const attendedAppointments = countAppointmentsByStatus(appointments || [], APPOINTMENT_STATUS.ATENDIDA.code, statuses)
    const cancelledAppointments = countAppointmentsByStatus(appointments || [], APPOINTMENT_STATUS.CANCELADA.code, statuses)
    const noShowAppointments = countAppointmentsByStatus(appointments || [], APPOINTMENT_STATUS.NO_SHOW.code, statuses)
    
    return {
      todayEarnings: earnings,
      todayClients: clients,
      popularServiceName: finalPopularService.name,
      averageRating: rating,
      totalBarbers: barbers.length,
      pendingAppointments,
      confirmedAppointments,
      attendedAppointments,
      cancelledAppointments,
      noShowAppointments
    }
  }, [appointments, services, barbers, statuses])

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
    <>
      <style dangerouslySetInnerHTML={{ __html: bubbleStyles }} />
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <header className="glass-card sticky top-0 z-50 border-b-0 mobile-header">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-2xl gradient-bg shadow-lg">
                    <Scissors className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">BarberPro</h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium hidden sm:block">Panel Administrativo</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">En línea</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Notificaciones con contador dinámico */}
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-card border-0 hover-lift bg-transparent relative mobile-btn"
                onClick={() => {
                  // Scroll a la pestaña de notificaciones
                  const notificationsTab = document.querySelector('[data-state="notifications"]') as HTMLElement
                  if (notificationsTab) {
                    notificationsTab.click()
                  }
                }}
              >
                <Bell className="h-4 w-4 sm:mr-2" />
                <span className="hidden lg:inline">Notificaciones</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {pendingAppointments + cancelledAppointments}
                  </span>
                </div>
              </Button>

              {/* Botón de configuración funcional */}
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-card border-0 hover-lift bg-transparent mobile-btn"
                onClick={() => {
                  // Scroll a la pestaña de servicios (configuración)
                  const servicesTab = document.querySelector('[data-state="services"]') as HTMLElement
                  if (servicesTab) {
                    servicesTab.click()
                  }
                }}
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden lg:inline">Configuración</span>
              </Button>

              {/* Botón de debug (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="glass-card border-0 hover-lift bg-transparent mobile-btn"
                  onClick={() => {
                    window.open('/debug', '_blank')
                  }}
                >
                  <Bug className="h-4 w-4 sm:mr-2" />
                  <span className="hidden lg:inline">Debug</span>
                </Button>
              )}

              {/* Información del sistema */}
              <div className="hidden lg:flex items-center space-x-3 px-4 py-2 rounded-xl glass-card">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-muted-foreground">Sistema Activo</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {new Date().toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>

              {/* Avatar con información del usuario */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {barbers.length > 0 ? barbers[0]?.full_name || 'Administrador' : 'Administrador'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {barbers.length > 0 ? barbers[0]?.role?.name || 'Admin' : 'Admin'}
                  </p>
                </div>
                <Avatar className="h-12 w-12 ring-4 ring-primary/20 hover-lift cursor-pointer">
                  <AvatarImage src="/barber-shop.png" />
                  <AvatarFallback className="gradient-bg text-white font-bold text-lg">
                    {barbers.length > 0 ? 
                      (barbers[0]?.full_name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2) : 
                      'AD'
                    }
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

            <div className="flex-1 container mx-auto px-4 sm:px-6 py-4 sm:py-8 mobile-content">
        <div className="grid gap-4 sm:gap-6 mobile-grid-2 lg:grid-cols-4 mb-8 animate-fade-in">
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
                  <span className="text-xs font-bold text-green-600">Hoy</span>
                </div>
                <p className="text-sm text-muted-foreground">{todayClients} citas atendidas</p>
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
              <div className="text-4xl font-bold text-foreground mb-2">{attendedAppointments}</div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-bold text-green-600">Atendidos</span>
                </div>
                <p className="text-sm text-muted-foreground">citas completadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Clientes Registrados
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{clients.length}</div>
              <p className="text-sm text-muted-foreground font-medium">clientes registrados</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Servicios Activos
              </CardTitle>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg group-hover:scale-110 transition-transform">
                <Scissors className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground mb-2">{services.length}</div>
              <p className="text-sm text-muted-foreground font-medium">servicios disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid gap-4 sm:gap-6 mobile-grid-2 lg:grid-cols-4 mb-8 animate-fade-in">
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
              <div className="text-4xl font-bold text-foreground mb-2">{totalBarbers}</div>
              <p className="text-sm text-muted-foreground font-medium">barberos activos</p>
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
              <div className="text-4xl font-bold text-foreground mb-2">{todayClients}</div>
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

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-8 animate-slide-up">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 glass-card p-1 sm:p-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-0 mobile-nav">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:drop-shadow-lg mobile-tab"
            >
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Resumen</span>
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:drop-shadow-lg mobile-tab"
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold relative overflow-hidden group mobile-tab"
            >
              <Scissors className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 relative z-20" />
              <span className="relative z-20 hidden sm:inline">Servicios</span>
              
              {/* Efecto burbuja múltiple - más transparente y solo en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/8 via-purple-400/8 to-pink-400/8 rounded-xl opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 transition-opacity duration-500 z-10"></div>
              
              {/* Burbujas individuales - más transparentes y solo en hover */}
              <div className="absolute top-2 left-4 w-2 h-2 bg-white/15 rounded-full opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 group-hover:bubble-effect transition-all duration-300 delay-100 z-10"></div>
              <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 group-hover:bubble-pulse transition-all duration-300 delay-200 z-10"></div>
              <div className="absolute bottom-3 left-6 w-1 h-1 bg-white/25 rounded-full opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 group-hover:bubble-effect transition-all duration-300 delay-300 z-10"></div>
              <div className="absolute bottom-2 right-4 w-2.5 h-2.5 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 data-[state=active]:opacity-0 group-hover:bubble-pulse transition-all duration-300 delay-400 z-10"></div>
              
              {/* Efecto de ondas - más transparentes y solo en hover */}
              <div className="absolute inset-0 bg-white/3 rounded-xl scale-0 group-hover:scale-110 data-[state=active]:scale-0 transition-transform duration-500 origin-center z-5"></div>
              <div className="absolute inset-0 bg-white/2 rounded-xl scale-0 group-hover:scale-125 data-[state=active]:scale-0 transition-transform duration-700 origin-center delay-100 z-5"></div>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:drop-shadow-lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Citas
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:drop-shadow-lg"
            >
              <Package className="h-4 w-4 mr-2" />
              Inventario
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold data-[state=active]:drop-shadow-lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              Galería
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white/10 text-black hover:text-black data-[state=active]:text-white data-[state=active]:font-extrabold relative mobile-tab"
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Alertas</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-8 mobile-content">
            <div className="grid gap-4 sm:gap-8 mobile-grid-1 sm:mobile-grid-2 lg:grid-cols-7">
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
                          <Badge 
                            variant="outline" 
                            className={`${getAppointmentStatus(appointment.status || appointment.estado, statuses).bgColor} ${getAppointmentStatus(appointment.status || appointment.estado, statuses).textColor} ${getAppointmentStatus(appointment.status || appointment.estado, statuses).borderColor} dark:bg-opacity-30 dark:border-opacity-80`}
                          >
                            {getAppointmentStatus(appointment.status || appointment.estado, statuses).label}
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
                            className={`${getAppointmentStatus(appointment.status || appointment.estado, statuses).bgColor} ${getAppointmentStatus(appointment.status || appointment.estado, statuses).textColor} ${getAppointmentStatus(appointment.status || appointment.estado, statuses).borderColor} dark:bg-opacity-30 dark:border-opacity-80`}
                          >
                            {getAppointmentStatus(appointment.status || appointment.estado, statuses).label}
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

            {/* Estadísticas de servicios */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Servicios Activos</p>
                      <p className="text-2xl font-bold text-blue-600">{services.length}</p>
                    </div>
                    <Scissors className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Servicio Popular</p>
                      <p className="text-lg font-bold text-green-600">{popularServiceName}</p>
                    </div>
                    <Sparkles className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Precio Promedio</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${services.length > 0 ? (services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(0) : '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
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

            {/* Resumen de estados de citas */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-600">{pendingAppointments}</p>
                      <p className="text-xs text-muted-foreground">Estado: 0</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Confirmadas</p>
                      <p className="text-2xl font-bold text-blue-600">{confirmedAppointments}</p>
                      <p className="text-xs text-muted-foreground">Estado: 1</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Atendidas</p>
                      <p className="text-2xl font-bold text-green-600">{attendedAppointments}</p>
                      <p className="text-xs text-muted-foreground">Estado: 2</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Canceladas</p>
                      <p className="text-2xl font-bold text-red-600">{cancelledAppointments}</p>
                      <p className="text-xs text-muted-foreground">Estado: 3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-gray-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">No se presentó</p>
                      <p className="text-2xl font-bold text-gray-600">{noShowAppointments}</p>
                      <p className="text-xs text-muted-foreground">Estado: 4</p>
                    </div>
                    <Clock className="h-8 w-8 text-gray-500" />
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
    </>
  )
}

