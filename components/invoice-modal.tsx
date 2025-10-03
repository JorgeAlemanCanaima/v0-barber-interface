"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Printer, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  DollarSign, 
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: any
}

export function InvoiceModal({ isOpen, onClose, appointment }: InvoiceModalProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  if (!appointment) {
    return null
  }

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

  // Calcular totales
  const totalPrice = appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.price || 0), 0) || 0
  const totalDuration = appointment.cita_services?.reduce((total: number, cs: any) => total + (cs.service?.duration_min || 0), 0) || 0

  // Obtener estado con emoji
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return { text: 'Pendiente', emoji: '⏳', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' }
      case 'CONFIRMADA':
        return { text: 'Confirmada', emoji: '✅', color: 'bg-green-100 text-green-800 border-green-300' }
      case 'CANCELADA':
        return { text: 'Cancelada', emoji: '❌', color: 'bg-red-100 text-red-800 border-red-300' }
      case 'ATENDIDA':
        return { text: 'Atendida', emoji: '🎉', color: 'bg-blue-100 text-blue-800 border-blue-300' }
      default:
        return { text: status, emoji: '📋', color: 'bg-gray-100 text-gray-800 border-gray-300' }
    }
  }

  const statusInfo = getStatusInfo(appointment.estado)

  // Función para imprimir
  const handlePrint = () => {
    setIsPrinting(true)
    
    // Crear contenido para imprimir
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura - ${appointment.client?.name || 'Cliente'}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none !important; }
              .print-only { display: block !important; }
            }
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .ticket { max-width: 300px; margin: 0 auto; border: 1px solid #000; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .business-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .business-info { font-size: 12px; color: #666; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; font-size: 14px; margin-bottom: 5px; border-bottom: 1px solid #ccc; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; }
            .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 15px; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <div class="business-name">💈 BARBERÍA EL ESTILO</div>
              <div class="business-info">
                📍 Managua, Nicaragua<br>
                📞 +505 1234-5678<br>
                ✉️ info@barberiaelestilo.com
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">📋 INFORMACIÓN DE LA CITA</div>
              <div class="item">
                <span>ID Cita:</span>
                <span>#${appointment.id}</span>
              </div>
              <div class="item">
                <span>Fecha:</span>
                <span>${formattedDate}</span>
              </div>
              <div class="item">
                <span>Hora:</span>
                <span>${formattedTime}</span>
              </div>
              <div class="item">
                <span>Estado:</span>
                <span>${statusInfo.emoji} ${statusInfo.text}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">👤 INFORMACIÓN DEL CLIENTE</div>
              <div class="item">
                <span>Nombre:</span>
                <span>${appointment.client?.name || 'N/A'}</span>
              </div>
              <div class="item">
                <span>Teléfono:</span>
                <span>${appointment.client?.phone || 'N/A'}</span>
              </div>
              <div class="item">
                <span>Email:</span>
                <span>${appointment.client?.email || 'N/A'}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">👨‍💼 BARBERO ASIGNADO</div>
              <div class="item">
                <span>Barbero:</span>
                <span>${appointment.barber?.full_name || 'No asignado'}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">💇 SERVICIOS</div>
              ${appointment.cita_services?.map((cs: any) => `
                <div class="item">
                  <span>${cs.service?.name || 'Servicio'}</span>
                  <span>C$${cs.service?.price || 0}</span>
                </div>
              `).join('') || '<div class="item"><span>Sin servicios</span><span>C$0</span></div>'}
            </div>

            <div class="total">
              <div class="total-row">
                <span>Duración Total:</span>
                <span>${totalDuration} min</span>
              </div>
              <div class="total-row">
                <span>TOTAL:</span>
                <span>C$${totalPrice}</span>
              </div>
            </div>

            <div class="footer">
              <div>¡Gracias por elegirnos!</div>
              <div>Fecha de emisión: ${new Date().toLocaleDateString('es-NI')}</div>
            </div>
          </div>
        </body>
      </html>
    `

    // Crear ventana de impresión
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Esperar a que se cargue el contenido y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          setIsPrinting(false)
        }, 500)
      }
    } else {
      setIsPrinting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Factura de la Cita">
      <div className="p-6">
        {/* Header de la barbería */}
        <div className="text-center mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-center mb-2">
            <Scissors className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-primary">BARBERÍA EL ESTILO</h1>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 mr-1" />
              Managua, Nicaragua
            </div>
            <div className="flex items-center justify-center">
              <Phone className="h-4 w-4 mr-1" />
              +505 1234-5678
            </div>
            <div className="flex items-center justify-center">
              <Mail className="h-4 w-4 mr-1" />
              info@barberiaelestilo.com
            </div>
          </div>
        </div>

        {/* Información de la cita */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Información de la Cita
              </h3>
              <Badge className={statusInfo.color}>
                {statusInfo.emoji} {statusInfo.text}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID Cita:</span>
                <span className="ml-2 font-medium">#{appointment.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <span className="ml-2 font-medium">{formattedDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Hora:</span>
                <span className="ml-2 font-medium">{formattedTime}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duración:</span>
                <span className="ml-2 font-medium">{totalDuration} min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información del cliente */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <User className="h-5 w-5 mr-2 text-primary" />
              Información del Cliente
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <span className="ml-2 font-medium">{appointment.client?.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="ml-2 font-medium">{appointment.client?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium">{appointment.client?.email || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barbero asignado */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              Barbero Asignado
            </h3>
            <div className="text-sm">
              <span className="text-muted-foreground">Barbero:</span>
              <span className="ml-2 font-medium">{appointment.barber?.full_name || 'No asignado'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Servicios */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold flex items-center mb-3">
              <Scissors className="h-5 w-5 mr-2 text-primary" />
              Servicios
            </h3>
            <div className="space-y-2">
              {appointment.cita_services?.map((cs: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-muted/20">
                  <div>
                    <div className="font-medium">{cs.service?.name || 'Servicio'}</div>
                    <div className="text-sm text-muted-foreground">
                      {cs.service?.duration_min || 0} minutos
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">C${cs.service?.price || 0}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-4">
                  Sin servicios registrados
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-primary mr-2" />
                <span className="text-lg font-semibold">Total a Pagar</span>
              </div>
              <div className="text-2xl font-bold text-primary">C${totalPrice}</div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
          >
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
          <Button
            onClick={handlePrint}
            disabled={isPrinting}
            className="bg-primary hover:bg-primary/90 text-white hover-lift"
          >
            <Printer className="h-4 w-4 mr-2" />
            {isPrinting ? 'Imprimiendo...' : 'Imprimir Factura'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
