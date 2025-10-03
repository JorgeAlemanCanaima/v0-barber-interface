"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Scissors,
  DollarSign,
  User,
  Phone,
  Mail,
  MessageSquare,
  X,
  History,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Cita } from "@/lib/supabase"

interface ClientHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  client: {
    id: number
    name: string
    phone: string
    email?: string
    notes?: string
    user?: {
      id: number
      full_name: string
      email: string
    }
  }
}

export function ClientHistoryModal({ isOpen, onClose, client }: ClientHistoryModalProps) {
  const [appointments, setAppointments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && client?.id) {
      fetchClientAppointments()
    }
  }, [isOpen, client?.id])

  const fetchClientAppointments = async () => {
    if (!client?.id) {
      setError('Cliente no válido')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, phone, email),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .eq('client_id', client.id)
        .order('fecha_hora', { ascending: false })

      if (error) {
        console.error('Error al obtener citas del cliente:', error)
        setError('Error al cargar el historial de citas')
        return
      }

      setAppointments(data || [])
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado al cargar el historial')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return {
          icon: Clock,
          color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 border-yellow-200 dark:border-yellow-800',
          text: 'Pendiente'
        }
      case 'CONFIRMADA':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200 dark:border-green-800',
          text: 'Confirmada'
        }
      case 'CANCELADA':
        return {
          icon: XCircle,
          color: 'bg-red-100 dark:bg-red-900/30 text-red-600 border-red-200 dark:border-red-800',
          text: 'Cancelada'
        }
      case 'ATENDIDA':
        return {
          icon: CheckCircle,
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800',
          text: 'Atendida'
        }
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 border-gray-200 dark:border-gray-800',
          text: estado
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!client) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Historial del Cliente">
      <div className="p-6">
        {/* Header del cliente */}
        <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-muted/20">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10">
            <AvatarImage src={`/placeholder-3491y.png?height=64&width=64&query=client-${client.id}`} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{client.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>{client.phone}</span>
              </div>
              {client.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
              )}
            </div>
            {client.notes && (
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Notas:</strong> {client.notes}
              </p>
            )}
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {appointments.length} {appointments.length === 1 ? 'Cita' : 'Citas'}
            </Badge>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass-card border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(apt => apt.estado === 'ATENDIDA').length}
              </p>
              <p className="text-sm text-muted-foreground">Atendidas</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg mx-auto mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {appointments.filter(apt => apt.estado === 'PENDIENTE' || apt.estado === 'CONFIRMADA').length}
              </p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-0">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${appointments
                  .filter(apt => apt.estado === 'ATENDIDA')
                  .reduce((total, apt) => total + (apt.service?.price || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Gastado</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de citas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <History className="h-5 w-5 mr-2" />
            Historial de Citas
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando historial...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchClientAppointments} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Este cliente no tiene citas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const statusInfo = getStatusInfo(appointment.estado)
                const StatusIcon = statusInfo.icon

                return (
                  <Card key={appointment.id} className="glass-card border-0 hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/20">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-foreground">
                                {formatDate(appointment.fecha_hora)}
                              </h4>
                              <Badge variant="outline" className={statusInfo.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.text}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(appointment.fecha_hora)}</span>
                              </div>
                              {appointment.service && (
                                <div className="flex items-center space-x-1">
                                  <Scissors className="h-4 w-4" />
                                  <span>{appointment.service.name}</span>
                                </div>
                              )}
                              {appointment.service && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>${appointment.service.price}</span>
                                </div>
                              )}
                            </div>
                            {appointment.barber && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                                <User className="h-4 w-4" />
                                <span>Barbero: {appointment.barber.full_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            ID: {appointment.id}
                          </p>
                          {appointment.service && (
                            <p className="text-xs text-muted-foreground">
                              {appointment.service.duration_min} min
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
          >
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
          <Button
            variant="outline"
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
            onClick={() => {
              if (!client.phone) return
              
              // Limpiar el número de teléfono
              const cleanPhone = client.phone.replace(/[\s\-\(\)]/g, '')
              
              // Formatear al formato internacional de Nicaragua
              let whatsappNumber = cleanPhone
              if (cleanPhone.startsWith('+505')) {
                whatsappNumber = cleanPhone.substring(1)
              } else if (cleanPhone.startsWith('505')) {
                whatsappNumber = cleanPhone
              } else {
                whatsappNumber = '505' + cleanPhone
              }
              
              // Buscar la próxima cita del cliente
              const nextAppointment = appointments.find(apt => 
                apt.client_id === client.id && 
                new Date(apt.fecha_hora) > new Date() &&
                apt.estado !== 'CANCELADA'
              )
              
              // Crear mensaje personalizado
              let message
              if (nextAppointment) {
                // Formatear fecha y hora
                const appointmentDate = new Date(nextAppointment.fecha_hora)
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
                const serviceName = nextAppointment.service?.name || 'Servicio'
                const servicePrice = nextAppointment.service?.price || 0
                const serviceDuration = nextAppointment.service?.duration_min || 0

                // Obtener información del barbero
                const barberName = nextAppointment.barber?.full_name || 'Barbero asignado'

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

                message = `🎉 *¡CITA CONFIRMADA!* 🎉

👤 *Cliente:* ${client.name}
📅 *Fecha:* ${formattedDate}
🕐 *Hora:* ${formattedTime}
💇 *Servicio:* ${serviceName}
💰 *Precio:* C$${servicePrice}
⏱️ *Duración:* ${serviceDuration} minutos
👨‍💼 *Barbero:* ${barberName}
📊 *Estado:* ${statusEmoji[nextAppointment.estado as keyof typeof statusEmoji]} ${statusText[nextAppointment.estado as keyof typeof statusText]}

¡Te esperamos en la barbería! 💈✨`
              } else {
                // Mensaje genérico si no hay cita próxima
                message = `Hola ${client.name}! 👋

Te contacto desde la barbería para coordinar tu cita. 

¿Te gustaría agendar una nueva cita? 💇‍♂️✨`
              }
              
              // Crear URL de WhatsApp
              const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
              
              // Abrir WhatsApp en una nueva pestaña
              window.open(whatsappUrl, '_blank')
            }}
            disabled={!client.phone}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          {client.user && (
            <Button
              variant="outline"
              className="border-border hover:bg-muted/50 bg-transparent hover-lift"
              onClick={() => {
                if (!client.phone) return
                
                // Limpiar el número de teléfono
                const cleanPhone = client.phone.replace(/[\s\-\(\)]/g, '')
                
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
              }}
              disabled={!client.phone}
            >
              <Phone className="h-4 w-4 mr-2" />
              Llamar
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
