"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, Clock, User, Scissors } from "lucide-react"
import { Cita, supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast"

interface EditAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentUpdated: () => void
  appointment: Cita | null
}

export function EditAppointmentModal({ isOpen, onClose, onAppointmentUpdated, appointment }: EditAppointmentModalProps) {
  const [formData, setFormData] = useState({
    fecha_hora: "",
    estado: "PENDIENTE" as "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "ATENDIDA",
    barber_user_id: "",
    service_ids: [] as number[],
  })
  const [barbers, setBarbers] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError, ToastContainer } = useToast()

  // Cargar barberos y servicios cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetchBarbers()
      fetchServices()
    }
  }, [isOpen])

  // Cargar datos de la cita cuando se abre el modal
  useEffect(() => {
    if (appointment && isOpen) {
      const appointmentDate = new Date(appointment.fecha_hora)
      const formattedDate = appointmentDate.toISOString().slice(0, 16) // Formato para input datetime-local
      
      // Extraer los IDs de los servicios de la cita
      const serviceIds = appointment.cita_services?.map((cs: any) => cs.service.id) || []
      
      setFormData({
        fecha_hora: formattedDate,
        estado: appointment.estado || "PENDIENTE",
        barber_user_id: appointment.barber_user_id?.toString() || "",
        service_ids: serviceIds,
      })
      setError(null)
    }
  }, [appointment, isOpen])

  const fetchBarbers = async () => {
    try {
      console.log('Cargando barberos...')
      
      const { data, error } = await supabase
        .from('user')
        .select('id, full_name, email')
        .eq('is_active', true)
        .order('full_name')

      if (error) {
        console.warn('Error al cargar barberos de la base de datos:', error.message)
        
        // Si no hay tabla user o no hay datos, crear barberos de ejemplo
        console.log('Creando barberos de ejemplo...')
        const sampleBarbers = [
          { id: 1, full_name: 'Carlos Mendoza', email: 'carlos@barberia.com' },
          { id: 2, full_name: 'Miguel Torres', email: 'miguel@barberia.com' },
          { id: 3, full_name: 'Roberto Silva', email: 'roberto@barberia.com' },
          { id: 4, full_name: 'Diego Ramírez', email: 'diego@barberia.com' }
        ]
        
        setBarbers(sampleBarbers)
        return
      }

      // Si hay datos de la base de datos, usarlos
      if (data && data.length > 0) {
        console.log('Barberos cargados desde la base de datos:', data.length)
        setBarbers(data)
      } else {
        // Si no hay datos en la base de datos, usar barberos de ejemplo
        console.log('No hay barberos en la base de datos, usando ejemplos...')
        const sampleBarbers = [
          { id: 1, full_name: 'Carlos Mendoza', email: 'carlos@barberia.com' },
          { id: 2, full_name: 'Miguel Torres', email: 'miguel@barberia.com' },
          { id: 3, full_name: 'Roberto Silva', email: 'roberto@barberia.com' },
          { id: 4, full_name: 'Diego Ramírez', email: 'diego@barberia.com' }
        ]
        setBarbers(sampleBarbers)
      }
    } catch (err) {
      console.error('Error inesperado al cargar barberos:', err)
      // En caso de error, usar barberos de ejemplo
      const sampleBarbers = [
        { id: 1, full_name: 'Carlos Mendoza', email: 'carlos@barberia.com' },
        { id: 2, full_name: 'Miguel Torres', email: 'miguel@barberia.com' },
        { id: 3, full_name: 'Roberto Silva', email: 'roberto@barberia.com' },
        { id: 4, full_name: 'Diego Ramírez', email: 'diego@barberia.com' }
      ]
      setBarbers(sampleBarbers)
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service')
        .select('id, name, price, duration_min')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error al cargar servicios:', error)
        return
      }

      setServices(data || [])
    } catch (err) {
      console.error('Error inesperado al cargar servicios:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null)
  }

  const handleServiceToggle = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter(id => id !== serviceId)
        : [...prev.service_ids, serviceId]
    }))
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.fecha_hora) {
      setError("La fecha y hora son obligatorias")
      return false
    }
    
    if (formData.service_ids.length === 0) {
      setError("Debe seleccionar al menos un servicio")
      return false
    }
    
    const selectedDate = new Date(formData.fecha_hora)
    const now = new Date()
    
    if (selectedDate <= now) {
      setError("La fecha y hora deben ser futuras")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !appointment) return

    setIsLoading(true)
    setError(null)

    try {
      const appointmentData = {
        fecha_hora: new Date(formData.fecha_hora).toISOString(),
        estado: formData.estado,
        barber_user_id: formData.barber_user_id ? parseInt(formData.barber_user_id) : null
      }

      console.log('Actualizando cita en la tabla cita:', appointment.id, appointmentData)

      // Actualizar directamente en la tabla cita (estructura antigua)
      const { data, error } = await supabase
        .from('cita')
        .update({
          fecha_hora: appointmentData.fecha_hora,
          estado: appointmentData.estado,
          barber_user_id: appointmentData.barber_user_id,
          // Si hay servicios seleccionados, usar el primero (compatibilidad con estructura antigua)
          service_id: formData.service_ids.length > 0 ? formData.service_ids[0] : null
        })
        .eq('id', appointment.id)
        .select(`
          *,
          client:client_id(id, name, email, phone),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .single()

      if (error) {
        console.error('Error al actualizar cita:', error)
        throw new Error(`Error al actualizar cita en la base de datos: ${error.message}`)
      }

      console.log('Cita actualizada exitosamente:', data)

      // Mostrar notificación de éxito
      const message = formData.service_ids.length > 1 
        ? `Cita actualizada. Nota: Solo se guardó el primer servicio seleccionado (${formData.service_ids.length} servicios seleccionados)`
        : 'La cita se ha actualizado correctamente'
      
      success('¡Cita actualizada exitosamente!', message)
      
      // Cerrar modal y actualizar lista
      onAppointmentUpdated()
      onClose()

    } catch (err) {
      console.error('Error inesperado:', err)
      setError(err instanceof Error ? err.message : "Error inesperado. Inténtalo de nuevo.")
      showError('Error al actualizar cita', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        fecha_hora: "",
        estado: "PENDIENTE",
        barber_user_id: "",
        service_ids: [],
      })
      setError(null)
      onClose()
    }
  }

  if (!appointment) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'CONFIRMADA': return 'bg-green-100 text-green-800 border-green-300'
      case 'CANCELADA': return 'bg-red-100 text-red-800 border-red-300'
      case 'ATENDIDA': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Editar Cita"
        size="lg"
      >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Appointment Info Card */}
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Información de la Cita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p className="font-semibold text-foreground">{appointment.client?.name || 'Cliente'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Scissors className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Servicios</p>
                  <div className="flex flex-wrap gap-1">
                    {appointment.cita_services?.map((cs: any, index: number) => (
                      <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {cs.service?.name || 'Servicio'}
                      </span>
                    )) || <span className="font-semibold text-foreground">Sin servicios</span>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fecha_hora" className="block text-sm font-medium text-foreground mb-2">
              Fecha y Hora *
            </label>
            <Input
              id="fecha_hora"
              name="fecha_hora"
              type="datetime-local"
              value={formData.fecha_hora}
              onChange={handleInputChange}
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-foreground mb-2">
              Estado de la Cita *
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none"
              required
              disabled={isLoading}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="ATENDIDA">Atendida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Servicios *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-border rounded-xl p-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.service_ids.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${service.price} • {service.duration_min} min
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Selecciona uno o más servicios para esta cita
            </p>
            {formData.service_ids.length > 1 && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  ⚠️ Múltiples servicios seleccionados. Solo se guardará el primer servicio en la base de datos actual.
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="barber_user_id" className="block text-sm font-medium text-foreground mb-2">
              Barbero Asignado (Opcional)
            </label>
            <select
              id="barber_user_id"
              name="barber_user_id"
              value={formData.barber_user_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none"
              disabled={isLoading}
            >
              <option value="">Sin barbero asignado</option>
              {barbers.length > 0 ? (
                barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.full_name} ({barber.email})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Cargando barberos...
                </option>
              )}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {barbers.length > 0 
                ? `Selecciona un barbero de la lista (${barbers.length} disponibles) o deja sin asignar`
                : 'Cargando lista de barberos...'
              }
            </p>
          </div>
        </div>

        {/* Preview Card */}
        {formData.fecha_hora && (
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                    <p className="font-semibold text-foreground">
                      {new Date(formData.fecha_hora).toLocaleString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(formData.estado)}`}>
                      {formData.estado}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Scissors className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Servicios Seleccionados</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.service_ids.length > 0 ? (
                        formData.service_ids.map(serviceId => {
                          const service = services.find(s => s.id === serviceId)
                          return service ? (
                            <span key={serviceId} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {service.name}
                            </span>
                          ) : null
                        })
                      ) : (
                        <span className="text-xs text-muted-foreground">Ningún servicio seleccionado</span>
                      )}
                    </div>
                  </div>
                </div>
                {formData.barber_user_id && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Barbero Asignado</p>
                      <p className="font-semibold text-foreground">
                        {barbers.find(b => b.id.toString() === formData.barber_user_id)?.full_name || 'Barbero no encontrado'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Actualizar Cita
              </>
            )}
          </Button>
        </div>
      </form>
      </Modal>
      
      {/* Contenedor de notificaciones */}
      <ToastContainer />
    </>
  )
}
