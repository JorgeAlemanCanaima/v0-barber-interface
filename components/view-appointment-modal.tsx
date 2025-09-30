"use client"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Edit,
  MessageSquare
} from "lucide-react"
import { Cita } from "@/lib/supabase"

interface ViewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  appointment: Cita | null
}

export function ViewAppointmentModal({ isOpen, onClose, onEdit, appointment }: ViewAppointmentModalProps) {
  if (!appointment) return null

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: AlertCircle,
          label: 'Pendiente'
        }
      case 'CONFIRMADA':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: CheckCircle,
          label: 'Confirmada'
        }
      case 'CANCELADA':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: XCircle,
          label: 'Cancelada'
        }
      case 'ATENDIDA':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Star,
          label: 'Atendida'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircle,
          label: status
        }
    }
  }

  const statusInfo = getStatusInfo(appointment.estado || 'PENDIENTE')
  const StatusIcon = statusInfo.icon

  const appointmentDate = new Date(appointment.fecha_hora)
  const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const formattedTime = appointmentDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Cita"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header con información principal */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-4 ring-primary/20">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="gradient-bg text-white font-bold text-xl">
                    {appointment.client?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {appointment.client?.name || 'Cliente'}
                  </h2>
                  <p className="text-muted-foreground">
                    {appointment.client?.phone || 'Sin teléfono'}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${statusInfo.color}`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  ${appointment.service?.price || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service?.duration_min || 30} minutos
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Información de la cita */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Detalles de la cita */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Información de la Cita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha</p>
                  <p className="font-semibold text-foreground capitalize">{formattedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hora</p>
                  <p className="font-semibold text-foreground">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Scissors className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Servicio</p>
                  <p className="font-semibold text-foreground">{appointment.service?.name || 'Servicio'}</p>
                  {appointment.service?.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {appointment.service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Precio</p>
                  <p className="font-semibold text-foreground">${appointment.service?.price || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-semibold text-foreground">{appointment.client?.name || 'Cliente'}</p>
                </div>
              </div>

              {appointment.client?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                    <p className="font-semibold text-foreground">{appointment.client.phone}</p>
                  </div>
                </div>
              )}

              {appointment.client?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{appointment.client.email}</p>
                  </div>
                </div>
              )}

              {appointment.client?.notes && (
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notas</p>
                    <p className="font-semibold text-foreground text-sm">{appointment.client.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información del barbero asignado */}
        {appointment.barber && (
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Barbero Asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src="/barber-shop.png" />
                  <AvatarFallback className="gradient-bg text-white font-bold">
                    {appointment.barber.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "B"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{appointment.barber.full_name}</p>
                  <p className="text-sm text-muted-foreground">{appointment.barber.email}</p>
                  {appointment.barber.phone && (
                    <p className="text-sm text-muted-foreground">{appointment.barber.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Información Adicional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ID de la Cita</p>
                <p className="font-semibold text-foreground">#{appointment.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
                <p className="font-semibold text-foreground">
                  {new Date(appointment.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
          >
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={onEdit}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Cita
          </Button>
        </div>
      </div>
    </Modal>
  )
}
