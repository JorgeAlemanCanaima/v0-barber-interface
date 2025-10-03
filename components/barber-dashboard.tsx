"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddServiceModal } from "@/components/add-service-modal"
import { EditServiceModal } from "@/components/edit-service-modal"
import { DeleteServiceModal } from "@/components/delete-service-modal"
import { AddAppointmentModal } from "@/components/add-appointment-modal"
import { EditAppointmentModal } from "@/components/edit-appointment-modal"
import { ViewAppointmentModal } from "@/components/view-appointment-modal"
import { AddClientModal } from "@/components/add-client-modal"
import { ClientHistoryModal } from "@/components/client-history-modal"
import { EditClientModal } from "@/components/edit-client-modal"
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
  RefreshCw,
  CheckCircle,
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
import { useBarbers, useServices, useAppointments, useClients, useNotifications } from "@/lib/hooks/useSupabase"
import { Cita } from "@/lib/supabase"

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


// Función para obtener la imagen correspondiente a cada servicio
const getServiceImage = (serviceName: string) => {
  const serviceImages: Record<string, string> = {
    // Fade Clásico - Imagen específica de fade con degradado suave desde arriba hacia abajo
    "Fade Clásico": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop&crop=face",
    
    // Corte + Barba - Imagen de corte con barba bien arreglada y estilizada
    "Corte + Barba": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&crop=face",
    
    // Buzz Cut - Imagen de corte muy corto/militar uniforme en toda la cabeza
    "Buzz Cut": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
    
    // Pompadour - Imagen de pompadour clásico con volumen hacia atrás y lados cortos
    "Pompadour": "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop&crop=face",
    
    // Fade + Barba - Imagen de fade moderno con barba completa y bien cuidada
    "Fade + Barba": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop&crop=face"
  }
  
  return serviceImages[serviceName] || "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop&crop=face"
}

// Función para obtener la categoría del servicio
const getServiceCategory = (serviceName: string) => {
  const categories: Record<string, string> = {
    "Fade Clásico": "Fade",
    "Corte + Barba": "Clásico",
    "Buzz Cut": "Corto",
    "Pompadour": "Elegante",
    "Fade + Barba": "Moderno"
  }
  
  return categories[serviceName] || "General"
}

export function BarberDashboard() {
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { services, loading: servicesLoading, error: servicesError, refetch: refetchServices } = useServices()
  const { appointments, loading: appointmentsLoading, error: appointmentsError, refetch: refetchAppointments, updateExpiredAppointments, markAppointmentAsAttended } = useAppointments()
  const { clients, loading: clientsLoading, error: clientsError, refetch: refetchClients } = useClients()
  const { notifications, loading: notificationsLoading, error: notificationsError, markAsRead, markAllAsRead, refetch: refetchNotifications } = useNotifications()
  
  // Estado para los modales
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false)
  const [isDeleteServiceModalOpen, setIsDeleteServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false)
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false)
  const [isViewAppointmentModalOpen, setIsViewAppointmentModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isClientHistoryModalOpen, setIsClientHistoryModalOpen] = useState(false)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  // Función para abrir modal de edición
  const handleEditService = (service: any) => {
    setSelectedService(service)
    setIsEditServiceModalOpen(true)
  }

  // Función para generar mensaje de confirmación de cita
  const generateAppointmentMessage = (client: any, appointment?: any) => {
    if (appointment) {
      // Formatear fecha y hora
      const appointmentDate = new Date(appointment.fecha_hora)
      const formattedDate = appointmentDate.toLocaleDateString('es-NI', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const formattedTime = appointmentDate.toLocaleTimeString('es-NI', {
        hour: '2-digit',
        minute: '2-digit'
      })

      // Obtener información del servicio
      const serviceName = appointment.service?.name || 'Servicio'
      const servicePrice = appointment.service?.price || 0
      const serviceDuration = appointment.service?.duration_min || 0

      // Obtener información del barbero
      const barberName = appointment.barber?.full_name || 'Barbero asignado'

      // Obtener estado de la cita
      const statusEmoji = {
        'PENDIENTE': '⏳',
        'CONFIRMADA': '✅',
        'CANCELADA': '❌',
        'ATENDIDA': '🎉'
      }
      const statusText = {
        'PENDIENTE': 'Pendiente',
        'CONFIRMADA': 'Confirmada',
        'CANCELADA': 'Cancelada',
        'ATENDIDA': 'Atendida'
      }

      return `🎉 *¡CITA CONFIRMADA!* 🎉

👤 *Cliente:* ${client.name}
📅 *Fecha:* ${formattedDate}
🕐 *Hora:* ${formattedTime}
💇 *Servicio:* ${serviceName}
💰 *Precio:* C$${servicePrice}
⏱️ *Duración:* ${serviceDuration} minutos
👨‍💼 *Barbero:* ${barberName}
📊 *Estado:* ${statusEmoji[appointment.estado as keyof typeof statusEmoji]} ${statusText[appointment.estado as keyof typeof statusText]}

¡Te esperamos en la barbería! 💈✨`
    } else {
      // Mensaje genérico si no hay cita específica
      return `Hola ${client.name}! 👋

Te contacto desde la barbería para coordinar tu cita. 

¿Te gustaría agendar una nueva cita? 💇‍♂️✨`
    }
  }

  // Función para abrir WhatsApp con el número del cliente
  const handleWhatsAppMessage = (phone: string | undefined, clientName: string | undefined, appointment?: any) => {
    if (!phone || !clientName) return
    // Limpiar el número de teléfono (remover espacios, guiones, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    // Formatear al formato internacional de Nicaragua si no lo tiene
    let whatsappNumber = cleanPhone
    if (cleanPhone.startsWith('+505')) {
      whatsappNumber = cleanPhone.substring(1) // Remover el +
    } else if (cleanPhone.startsWith('505')) {
      whatsappNumber = cleanPhone
    } else {
      whatsappNumber = '505' + cleanPhone
    }
    
    // Crear mensaje personalizado
    const message = generateAppointmentMessage({ name: clientName }, appointment)
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank')
  }

  // Función para hacer llamada telefónica
  const handlePhoneCall = (phone: string) => {
    // Limpiar el número de teléfono
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    // Formatear al formato internacional
    let phoneNumber = cleanPhone
    if (cleanPhone.startsWith('+505')) {
      phoneNumber = cleanPhone
    } else if (cleanPhone.startsWith('505')) {
      phoneNumber = '+' + cleanPhone
    } else {
      phoneNumber = '+505' + cleanPhone
    }
    
    // Crear URL de llamada
    const callUrl = `tel:${phoneNumber}`
    
    // Abrir aplicación de llamadas
    window.location.href = callUrl
  }

  // Función para marcar cita como atendida
  const handleMarkAsAttended = async (appointment: any) => {
    try {
      await markAppointmentAsAttended(appointment.id)
      // Mostrar mensaje de éxito (puedes usar un toast aquí si tienes uno)
      console.log('Cita marcada como atendida exitosamente')
    } catch (error) {
      console.error('Error al marcar cita como atendida:', error)
      // Mostrar mensaje de error (puedes usar un toast aquí si tienes uno)
    }
  }

  // Función para abrir modal de eliminación
  const handleDeleteService = (service: any) => {
    setSelectedService(service)
    setIsDeleteServiceModalOpen(true)
  }

  // Función para abrir modal de edición de cita
  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsEditAppointmentModalOpen(true)
  }

  // Función para abrir modal de visualización de cita
  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsViewAppointmentModalOpen(true)
  }

  // Calcular estadísticas en tiempo real
  const { todayEarnings, todayClients, popularServiceName, averageRating } = useMemo(() => {
    const attended = (appointments || []).filter((a: any) => (a.estado || a.status || "").toUpperCase() === "ATENDIDA")
    
    const earnings = attended.reduce((sum: number, a: any) => sum + (a.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.price || 0), 0) || 0), 0)
    const clients = attended.length
    
    // Servicio más popular
    const serviceCounts = (services || []).reduce((acc: any, service: any) => {
      const count = (appointments || []).reduce((total: number, apt: any) => {
        const serviceInAppointment = apt.cita_services?.some((cs: any) => cs.service?.id === service.id)
        return total + (serviceInAppointment ? 1 : 0)
      }, 0)
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

  if (barbersLoading || servicesLoading || appointmentsLoading || notificationsLoading) {
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
              <Scissors className="h-4 w-4 mr-2" />
              Servicios
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
                          <div className="flex flex-wrap gap-1 mt-1">
                            {appointment.cita_services?.map((cs: any, index: number) => (
                              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {cs.service?.name || 'Servicio'}
                              </span>
                            )) || <span className="text-sm text-muted-foreground">Sin servicios</span>}
                          </div>
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
                          <p className="font-bold text-lg text-foreground">${appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.price || 0), 0) || 0}</p>
                          <p className="text-sm text-muted-foreground">{appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.duration_min || 0), 0) || 0} min</p>
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
                <h2 className="text-2xl font-bold text-foreground">Servicios Disponibles</h2>
                <p className="text-muted-foreground text-base">Gestiona los servicios que ofreces a tus clientes</p>
              </div>
              <div className="flex gap-2">
               
                <Button 
                  onClick={() => setIsAddServiceModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Servicio
                </Button>
              </div>
            </div>

            {/* Estadísticas de servicios */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Servicios</p>
                      <p className="text-2xl font-bold text-blue-600">{services?.length || 0}</p>
                    </div>
                    <Scissors className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Servicio Más Popular</p>
                      <p className="text-lg font-bold text-green-600">{popularServiceName}</p>
                    </div>
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Precio Promedio</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ${services?.length > 0 ? (services.reduce((sum: number, service: any) => sum + (service.price || 0), 0) / services.length).toFixed(0) : 0}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift border-l-4 border-l-orange-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Duración Promedio</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {services?.length > 0 ? (services.reduce((sum: number, service: any) => sum + (service.duration_min || 0), 0) / services.length).toFixed(0) : 0} min
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de servicios */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Catálogo de Servicios</CardTitle>
                <CardDescription>Administra todos los servicios disponibles para tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                {services && services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-6 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
                            <Scissors className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description || 'Sin descripción'}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                <Clock className="h-3 w-3 mr-1" />
                                {service.duration_min || 30} min
                              </Badge>
                              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800">
                                Disponible
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Precio</p>
                            <p className="text-2xl font-bold text-primary">${service.price || 0}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Reservas</p>
                            <p className="text-lg font-bold text-foreground">
                              {appointments?.reduce((total: number, apt: any) => {
                                const serviceInAppointment = apt.cita_services?.some((cs: any) => cs.service?.id === service.id)
                                return total + (serviceInAppointment ? 1 : 0)
                              }, 0) || 0}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-border hover:bg-muted/50 bg-transparent hover-lift">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-border hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent hover-lift"
                              onClick={() => handleDeleteService(service)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Scissors className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No hay servicios</h3>
                    <p className="text-muted-foreground mb-4">
                      Aún no has agregado ningún servicio a tu catálogo
                    </p>
                    <Button 
                      onClick={() => setIsAddServiceModalOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Servicio
                    </Button>
                  </div>
                )}
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
              {["Todos", ...new Set(services?.map(service => getServiceCategory(service.name)) || [])].map((category) => (
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
              {services && services.length > 0 ? (
                services.map((service) => {
                  const appointmentCount = appointments?.reduce((total: number, apt: any) => {
                    const serviceInAppointment = apt.cita_services?.some((cs: any) => cs.service?.id === service.id)
                    return total + (serviceInAppointment ? 1 : 0)
                  }, 0) || 0
                  const isTrending = appointmentCount > 2 // Trending si tiene más de 2 citas
                  
                  return (
                    <Card key={service.id} className="glass-card border-0 hover-lift group overflow-hidden">
                      <div className="relative">
                        <img
                          src={getServiceImage(service.name)}
                          alt={service.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop&crop=face"
                          }}
                        />
                        {isTrending && (
                          <Badge className="absolute top-4 left-4 gradient-bg text-white border-0 shadow-lg">
                            <Zap className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        <div className="absolute top-4 right-4 flex items-center space-x-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                          <Calendar className="h-3 w-3 text-white" />
                          <span className="text-xs text-white font-medium">{appointmentCount}</span>
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
                            {getServiceCategory(service.name)}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-600">${service.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-blue-600">{service.duration_min} min</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <Scissors className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No hay servicios</h3>
                  <p className="text-muted-foreground">
                    Aún no has agregado ningún servicio a tu catálogo
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
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                  onClick={refetchNotifications}
                  disabled={notificationsLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${notificationsLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button 
                  variant="outline" 
                  className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                  onClick={markAllAsRead}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Marcar Todo Leído
                </Button>
              </div>
            </div>

            {/* Resumen de notificaciones */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Urgentes</p>
                      <p className="text-2xl font-bold text-red-600">
                        {notifications?.filter(n => n.is_urgent && !n.is_read).length || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">No Leídas</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {notifications?.filter(n => !n.is_read).length || 0}
                      </p>
                    </div>
                    <Bell className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Citas</p>
                      <p className="text-2xl font-bold text-green-600">
                        {notifications?.filter(n => n.type === 'appointment').length || 0}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 hover-lift">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {notifications?.length || 0}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de notificaciones */}
            <Card className="glass-card border-0 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Notificaciones Recientes</CardTitle>
                <CardDescription>Últimas alertas y actualizaciones</CardDescription>
                {notificationsError && (
                  <div className="text-red-500 text-sm">
                    Error: {notificationsError}
                  </div>
                )}
                {notificationsLoading && (
                  <div className="text-blue-500 text-sm">
                    Cargando notificaciones...
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const getTimeAgo = (dateString: string) => {
                        const now = new Date()
                        const notificationDate = new Date(dateString)
                        const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60))
                        
                        if (diffInMinutes < 1) return 'Ahora mismo'
                        if (diffInMinutes < 60) return `hace ${diffInMinutes} min`
                        if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} horas`
                        return `hace ${Math.floor(diffInMinutes / 1440)} días`
                      }

                      const getTypeIcon = (type: string) => {
                        switch (type) {
                          case 'appointment': return <Calendar className="h-5 w-5 text-blue-600" />
                          case 'inventory': return <Package className="h-5 w-5 text-yellow-600" />
                          case 'review': return <Star className="h-5 w-5 text-green-600" />
                          case 'payment': return <CreditCard className="h-5 w-5 text-emerald-600" />
                          case 'birthday': return <Gift className="h-5 w-5 text-purple-600" />
                          case 'system': return <Settings className="h-5 w-5 text-gray-600" />
                          case 'reminder': return <Bell className="h-5 w-5 text-orange-600" />
                          default: return <MessageSquare className="h-5 w-5 text-gray-600" />
                        }
                      }

                      const getTypeBgColor = (type: string) => {
                        switch (type) {
                          case 'appointment': return "bg-blue-100 dark:bg-blue-900/30"
                          case 'inventory': return "bg-yellow-100 dark:bg-yellow-900/30"
                          case 'review': return "bg-green-100 dark:bg-green-900/30"
                          case 'payment': return "bg-emerald-100 dark:bg-emerald-900/30"
                          case 'birthday': return "bg-purple-100 dark:bg-purple-900/30"
                          case 'system': return "bg-gray-100 dark:bg-gray-900/30"
                          case 'reminder': return "bg-orange-100 dark:bg-orange-900/30"
                          default: return "bg-gray-100 dark:bg-gray-900/30"
                        }
                      }

                      return (
                        <div
                          key={notification.id}
                          className={`flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${
                            notification.is_urgent
                              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                              : notification.is_read
                                ? "bg-muted/10 hover:bg-muted/20"
                                : "bg-muted/20 hover:bg-muted/40 border-l-4 border-l-primary"
                          }`}
                          onClick={() => !notification.is_read && markAsRead(notification.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeBgColor(notification.type)}`}>
                              {getTypeIcon(notification.type)}
                            </div>
                            <div>
                              <p className={`font-semibold ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">{getTimeAgo(notification.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {notification.is_urgent && (
                              <Badge variant="destructive" className="bg-red-500 text-white">
                                Urgente
                              </Badge>
                            )}
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
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
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-foreground mb-2">No hay notificaciones</h3>
                      <p className="text-muted-foreground">
                        No tienes notificaciones en este momento
                      </p>
                    </div>
                  )}
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
                <Button 
                  variant="outline"
                  onClick={updateExpiredAppointments}
                  className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cancelar Vencidas
                </Button>
                <Button 
                  onClick={() => setIsAddAppointmentModalOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
                >
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
              {appointmentsLoading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando citas...</p>
                </div>
              )}
              {appointmentsError && (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">Error al cargar citas: {appointmentsError}</p>
                  <Button onClick={refetchAppointments} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reintentar
                  </Button>
                </div>
              )}
              {!appointmentsLoading && !appointmentsError && appointments && appointments.length > 0 ? (
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
                                <span className="text-muted-foreground">Servicios:</span>
                                <div className="flex flex-wrap gap-1">
                                  {appointment.cita_services?.map((cs: any, index: number) => (
                                    <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                      {cs.service?.name || 'Servicio'}
                                    </span>
                                  )) || <span className="font-medium">Sin servicios</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ${appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.price || 0), 0) || 0}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.duration_min || 0), 0) || 0} min
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                                onClick={() => handleEditAppointment(appointment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                                onClick={() => handleViewAppointment(appointment)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {appointment.client?.phone && appointment.client?.name && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-300 hover:bg-green-50 bg-transparent hover-lift text-green-700"
                                  onClick={() => {
                                    if (appointment.client?.phone && appointment.client?.name) {
                                      handleWhatsAppMessage(appointment.client.phone, appointment.client.name, appointment)
                                    }
                                  }}
                                  title="Enviar confirmación por WhatsApp"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              )}
                              {(appointment.estado === 'PENDIENTE' || appointment.estado === 'CONFIRMADA') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-blue-300 hover:bg-blue-50 bg-transparent hover-lift text-blue-700"
                                  onClick={() => handleMarkAsAttended(appointment)}
                                  title="Marcar como atendida"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
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
                    <p className="text-muted-foreground mb-4">
                      No hay citas reservadas en este momento
                    </p>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Estado: {appointmentsLoading ? 'Cargando...' : 'Cargado'}</p>
                      <p>Error: {appointmentsError || 'Ninguno'}</p>
                      <p>Citas encontradas: {appointments?.length || 0}</p>
                    </div>
                    <Button onClick={refetchAppointments} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar
                    </Button>
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
              <Button 
                onClick={() => setIsAddClientModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
              >
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

            {/* Lista de clientes reales */}
            <div className="space-y-6">
              {clients && clients.length > 0 ? (
                clients.map((client) => (
                <Card key={client.id} className="glass-card border-0 hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                          <AvatarImage src={`/placeholder-3491y.png?height=64&width=64&query=client-${client.id}`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.phone} • {client.email || 'Sin email'}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Cliente Activo
                            </Badge>
                            {client.user && (
                              <Badge
                                variant="outline"
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800"
                              >
                                {client.user.full_name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          onClick={() => {
                            setSelectedClient(client)
                            setIsClientHistoryModalOpen(true)
                          }}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Ver Historial Completo
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-border hover:bg-muted/50 bg-transparent hover-lift"
                          onClick={() => {
                            setSelectedClient(client)
                            setIsEditClientModalOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Información de Contacto</h4>
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                            <p className="text-foreground">{client.phone}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-foreground">{client.email || 'No especificado'}</p>
                          </div>
                          {client.notes && (
                            <div className="p-3 rounded-lg bg-muted/20">
                              <p className="text-sm font-medium text-muted-foreground">Notas</p>
                              <p className="text-foreground">{client.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Información del Barbero</h4>
                        <div className="space-y-3">
                          {client.user ? (
                            <div className="p-3 rounded-lg bg-muted/20">
                              <p className="text-sm font-medium text-muted-foreground">Barbero Asignado</p>
                              <p className="text-foreground">{client.user.full_name}</p>
                              <p className="text-xs text-muted-foreground">{client.user.email}</p>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg bg-muted/20">
                              <p className="text-sm font-medium text-muted-foreground">Barbero Asignado</p>
                              <p className="text-foreground">No asignado</p>
                            </div>
                          )}
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                              onClick={() => client.phone && handleWhatsAppMessage(client.phone, client.name)}
                              disabled={!client.phone}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Mensaje
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 border-border hover:bg-muted/50 bg-transparent hover-lift"
                              onClick={() => client.phone && handlePhoneCall(client.phone)}
                              disabled={!client.phone}
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
                ))
              ) : (
                <Card className="glass-card border-0 text-center py-12">
                  <CardContent>
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No hay clientes</h3>
                    <p className="text-muted-foreground mb-4">
                      Aún no has agregado ningún cliente a tu base de datos
                    </p>
                    <Button 
                      onClick={() => setIsAddClientModalOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Primer Cliente
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para agregar servicio */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onServiceAdded={() => {
          refetchServices()
          setIsAddServiceModalOpen(false)
        }}
      />

      {/* Modal para editar servicio */}
      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={() => {
          setIsEditServiceModalOpen(false)
          setSelectedService(null)
        }}
        onServiceUpdated={() => {
          refetchServices()
          setIsEditServiceModalOpen(false)
          setSelectedService(null)
        }}
        service={selectedService}
      />

      {/* Modal para eliminar servicio */}
      <DeleteServiceModal
        isOpen={isDeleteServiceModalOpen}
        onClose={() => {
          setIsDeleteServiceModalOpen(false)
          setSelectedService(null)
        }}
        onServiceDeleted={() => {
          refetchServices()
          setIsDeleteServiceModalOpen(false)
          setSelectedService(null)
        }}
        service={selectedService}
      />

      {/* Modal para agregar cita */}
      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        onAppointmentAdded={() => {
          refetchAppointments()
          setIsAddAppointmentModalOpen(false)
        }}
      />

      {/* Modal para editar cita */}
      <EditAppointmentModal
        isOpen={isEditAppointmentModalOpen}
        onClose={() => {
          setIsEditAppointmentModalOpen(false)
          setSelectedAppointment(null)
        }}
        onAppointmentUpdated={() => {
          refetchAppointments()
          setIsEditAppointmentModalOpen(false)
          setSelectedAppointment(null)
        }}
        appointment={selectedAppointment}
      />

      {/* Modal para visualizar cita */}
      <ViewAppointmentModal
        isOpen={isViewAppointmentModalOpen}
        onClose={() => {
          setIsViewAppointmentModalOpen(false)
          setSelectedAppointment(null)
        }}
        onEdit={() => {
          setIsViewAppointmentModalOpen(false)
          setIsEditAppointmentModalOpen(true)
        }}
        appointment={selectedAppointment}
      />

      {/* Modal para agregar cliente */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onClientAdded={() => {
          refetchClients()
          setIsAddClientModalOpen(false)
        }}
      />

      {/* Modal para ver historial del cliente */}
      <ClientHistoryModal
        isOpen={isClientHistoryModalOpen}
        onClose={() => setIsClientHistoryModalOpen(false)}
        client={selectedClient}
      />

      {/* Modal para editar cliente */}
      <EditClientModal
        isOpen={isEditClientModalOpen}
        onClose={() => setIsEditClientModalOpen(false)}
        client={selectedClient}
        onClientUpdated={() => {
          refetchClients()
          setIsEditClientModalOpen(false)
        }}
      />
    </div>
  )
}
