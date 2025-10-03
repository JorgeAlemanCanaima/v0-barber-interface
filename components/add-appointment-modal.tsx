"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"
import { useCreateAppointment, useCreateClient } from "@/lib/hooks/useSupabase"
import { useServices } from "@/lib/hooks/useSupabase"
import { useClients } from "@/lib/hooks/useSupabase"
import { useBarbers } from "@/lib/hooks/useSupabase"
import { validateNicaraguaPhone, validateEmail, verifyEmailExists } from "@/lib/validations"
import { generateAppointmentEmailMessage, generateAdminNotificationEmail, sendEmailSimulated } from "@/lib/email"
import { ADMIN_EMAIL, isAdminEmailConfigured } from "@/lib/config"

interface AddAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentAdded: () => void
}

export function AddAppointmentModal({
  isOpen,
  onClose,
  onAppointmentAdded,
}: AddAppointmentModalProps) {
  const { createAppointment, loading: creatingAppointment } = useCreateAppointment()
  const { createClient, loading: creatingClient } = useCreateClient()
  const { services, loading: servicesLoading } = useServices()
  const { clients, loading: clientsLoading, refetch: refetchClients } = useClients()
  const { barbers, loading: barbersLoading } = useBarbers()

  const [formData, setFormData] = useState({
    client_id: "",
    service_id: "",
    barber_user_id: "",
    fecha_hora: "",
    estado: "PENDIENTE" as const,
  })

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const [isNewClient, setIsNewClient] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneValidation, setPhoneValidation] = useState<{ isValid: boolean; formatted: string; error?: string } | null>(null)
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string } | null>(null)
  const [emailVerification, setEmailVerification] = useState<{ exists: boolean; error?: string; verifying: boolean } | null>(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        client_id: "",
        service_id: "",
        barber_user_id: "",
        fecha_hora: "",
        estado: "PENDIENTE",
      })
      setNewClient({
        name: "",
        email: "",
        phone: "",
        notes: "",
      })
      setIsNewClient(false)
      setErrors({})
      setPhoneValidation(null)
      setEmailValidation(null)
      setEmailVerification(null)
    }
  }, [isOpen])

  // Validar teléfono en tiempo real
  const handlePhoneChange = (phone: string) => {
    setNewClient(prev => ({ ...prev, phone }))
    
    if (phone.trim()) {
      const validation = validateNicaraguaPhone(phone)
      setPhoneValidation(validation)
    } else {
      setPhoneValidation(null)
    }
  }

  // Validar email en tiempo real
  const handleEmailChange = async (email: string) => {
    setNewClient(prev => ({ ...prev, email }))
    
    if (email.trim()) {
      const validation = validateEmail(email)
      setEmailValidation(validation)
      
      if (validation.isValid) {
        // Verificar si el email existe
        setEmailVerification({ exists: false, verifying: true })
        const verification = await verifyEmailExists(email)
        setEmailVerification(verification)
      } else {
        setEmailVerification(null)
      }
    } else {
      setEmailValidation(null)
      setEmailVerification(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (isNewClient) {
      if (!newClient.name.trim()) {
        newErrors.name = "El nombre del cliente es requerido"
      }
      if (!newClient.phone.trim()) {
        newErrors.phone = "El teléfono del cliente es requerido"
      } else {
        // Validar número de Nicaragua
        const phoneValidation = validateNicaraguaPhone(newClient.phone)
        if (!phoneValidation.isValid) {
          newErrors.phone = phoneValidation.error || "Número de teléfono inválido"
        }
      }
      if (!newClient.email.trim()) {
        newErrors.email = "El email del cliente es requerido"
      } else {
        // Validar email
        const emailValidation = validateEmail(newClient.email)
        if (!emailValidation.isValid) {
          newErrors.email = emailValidation.error || "Email inválido"
        } else if (emailVerification && !emailVerification.exists) {
          newErrors.email = "El email no existe o no es válido"
        }
      }
    } else {
      if (!formData.client_id) {
        newErrors.client_id = "Debe seleccionar un cliente"
      }
    }

    if (!formData.service_id) {
      newErrors.service_id = "Debe seleccionar un servicio"
    }

    if (!formData.barber_user_id) {
      newErrors.barber_user_id = "Debe seleccionar un barbero"
    }

    if (!formData.fecha_hora) {
      newErrors.fecha_hora = "Debe seleccionar fecha y hora"
    } else {
      const selectedDate = new Date(formData.fecha_hora)
      const now = new Date()
      
      if (selectedDate <= now) {
        newErrors.fecha_hora = "La fecha debe ser futura"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let clientId = formData.client_id

      // Si es un cliente nuevo, crear el cliente primero
      if (isNewClient) {
        const clientData = {
          name: newClient.name,
          email: newClient.email || undefined,
          phone: newClient.phone,
          notes: newClient.notes || undefined,
          user_id: undefined, // Los clientes no necesitan user_id obligatoriamente
        }
        
        const newClientData = await createClient(clientData)
        clientId = newClientData.id.toString()
        
        // Refrescar la lista de clientes
        await refetchClients()
      }

      // Mapear estado a status_id
      const getStatusId = (estado: string) => {
        switch (estado) {
          case 'PENDIENTE': return 1
          case 'CONFIRMADA': return 2
          case 'CANCELADA': return 3
          case 'ATENDIDA': return 4
          default: return 1
        }
      }

      const appointmentData = {
        client_id: parseInt(clientId),
        service_id: parseInt(formData.service_id),
        barber_user_id: parseInt(formData.barber_user_id),
        fecha_hora: formData.fecha_hora,
        estado: formData.estado,
        status_id: getStatusId(formData.estado),
      }

      const createdAppointment = await createAppointment(appointmentData)
      
      // Obtener los datos completos de la cita creada
      const appointmentWithDetails = {
        ...createdAppointment,
        client: {
          name: isNewClient ? newClient.name : 'Cliente existente',
          phone: isNewClient ? newClient.phone : 'No especificado',
          email: isNewClient ? newClient.email : 'No especificado'
        },
        service: selectedService,
        barber: selectedBarber
      }
      
      // Enviar email de confirmación al cliente si es un cliente nuevo con email válido
      if (isNewClient && emailValidation?.isValid && emailVerification?.exists && newClient.email) {
        try {
          const emailContent = generateAppointmentEmailMessage(appointmentWithDetails)
          const emailResult = await sendEmailSimulated(newClient.email, emailContent.subject, emailContent.html, emailContent.text)
          
          if (emailResult.success) {
            console.log('✅ Email de confirmación enviado al cliente exitosamente')
          } else {
            console.warn('⚠️ Error al enviar email al cliente:', emailResult.error)
          }
        } catch (emailError) {
          console.warn('⚠️ Error al enviar email al cliente:', emailError)
        }
      }
      
      // Enviar notificación al administrador
      if (isAdminEmailConfigured()) {
        try {
          const adminEmailContent = generateAdminNotificationEmail(appointmentWithDetails)
          const adminEmailResult = await sendEmailSimulated(ADMIN_EMAIL, adminEmailContent.subject, adminEmailContent.html, adminEmailContent.text)
          
          if (adminEmailResult.success) {
            console.log('✅ Notificación enviada al administrador exitosamente')
          } else {
            console.warn('⚠️ Error al enviar notificación al administrador:', adminEmailResult.error)
          }
        } catch (adminEmailError) {
          console.warn('⚠️ Error al enviar notificación al administrador:', adminEmailError)
        }
      } else {
        console.warn('⚠️ Email del administrador no configurado. Configura NEXT_PUBLIC_ADMIN_EMAIL en .env.local')
      }
      
      onAppointmentAdded()
      onClose()
    } catch (error) {
      console.error("Error al crear cita:", error)
      setErrors({ submit: "Error al crear la cita. Inténtalo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find(s => s.id === parseInt(formData.service_id))
  const selectedBarber = barbers.find(b => b.id === parseInt(formData.barber_user_id))

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Nueva Cita">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Nueva Cita</h2>
              <p className="text-muted-foreground">Programa una nueva cita para tu cliente</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border hover:bg-muted/50 bg-transparent hover-lift"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de cliente */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Cliente</h3>
            </div>

            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={!isNewClient ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNewClient(false)}
                className={!isNewClient ? "gradient-bg text-white" : "border-border hover:bg-muted/50 bg-transparent hover-lift"}
              >
                Cliente Existente
              </Button>
              <Button
                type="button"
                variant={isNewClient ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNewClient(true)}
                className={isNewClient ? "gradient-bg text-white" : "border-border hover:bg-muted/50 bg-transparent hover-lift"}
              >
                Nuevo Cliente
              </Button>
            </div>

            {isNewClient ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre del Cliente *
                  </label>
                  <Input
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre completo"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono de Nicaragua *
                  </label>
                  <div className="relative">
                    <Input
                      value={newClient.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+505 8888 1234 o 88881234"
                      className={`${errors.phone ? "border-red-500" : ""} ${
                        phoneValidation?.isValid ? "border-green-500" : 
                        phoneValidation?.isValid === false ? "border-red-500" : ""
                      }`}
                    />
                    {phoneValidation?.isValid && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {phoneValidation?.isValid === false && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {phoneValidation?.isValid && (
                    <p className="text-green-600 text-sm mt-1">
                      ✅ Número válido: {phoneValidation.formatted}
                    </p>
                  )}
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  {phoneValidation?.isValid === false && !errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{phoneValidation.error}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Formato: +505 8888 1234, 50588881234, o 88881234
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Input
                      value={newClient.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      type="email"
                      className={`${errors.email ? "border-red-500" : ""} ${
                        emailValidation?.isValid && emailVerification?.exists ? "border-green-500" : 
                        emailValidation?.isValid === false || (emailVerification && !emailVerification.exists) ? "border-red-500" : ""
                      }`}
                    />
                    {emailVerification?.verifying && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {emailValidation?.isValid && emailVerification?.exists && !emailVerification.verifying && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {emailValidation?.isValid === false && !emailVerification?.verifying && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                    {emailValidation?.isValid && emailVerification && !emailVerification.exists && !emailVerification.verifying && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {emailVerification?.verifying && (
                    <p className="text-blue-600 text-sm mt-1">
                      🔍 Verificando email...
                    </p>
                  )}
                  {emailValidation?.isValid && emailVerification?.exists && !emailVerification.verifying && (
                    <p className="text-green-600 text-sm mt-1">
                      ✅ Email válido y verificado
                    </p>
                  )}
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  {emailValidation?.isValid === false && !errors.email && (
                    <p className="text-red-500 text-sm mt-1">{emailValidation.error}</p>
                  )}
                  {emailValidation?.isValid && emailVerification && !emailVerification.exists && !emailVerification.verifying && !errors.email && (
                    <p className="text-red-500 text-sm mt-1">El email no existe o no es válido</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notas
                  </label>
                  <Textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Seleccionar Cliente *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none ${
                    errors.client_id ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.phone}
                    </option>
                  ))}
                </select>
                {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>}
              </div>
            )}
          </div>

          {/* Selección de servicio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Servicio</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Seleccionar Servicio *
              </label>
              <select
                value={formData.service_id}
                onChange={(e) => setFormData(prev => ({ ...prev, service_id: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none ${
                  errors.service_id ? "border-red-500" : "border-border"
                }`}
              >
                <option value="">Seleccionar servicio...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration_min} min)
                  </option>
                ))}
              </select>
              {errors.service_id && <p className="text-red-500 text-sm mt-1">{errors.service_id}</p>}
            </div>

            {selectedService && (
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{selectedService.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedService.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${selectedService.price}</p>
                    <p className="text-sm text-muted-foreground">{selectedService.duration_min} minutos</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selección de barbero */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Barbero</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Seleccionar Barbero *
              </label>
              <select
                value={formData.barber_user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, barber_user_id: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none ${
                  errors.barber_user_id ? "border-red-500" : "border-border"
                }`}
              >
                <option value="">Seleccionar barbero...</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.full_name}
                  </option>
                ))}
              </select>
              {errors.barber_user_id && <p className="text-red-500 text-sm mt-1">{errors.barber_user_id}</p>}
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Fecha y Hora</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha y Hora *
              </label>
              <Input
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_hora: e.target.value }))}
                className={errors.fecha_hora ? "border-red-500" : ""}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.fecha_hora && <p className="text-red-500 text-sm mt-1">{errors.fecha_hora}</p>}
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Estado</h3>
            </div>

            <div className="flex space-x-2">
              {["PENDIENTE", "CONFIRMADA"].map((estado) => (
                <Button
                  key={estado}
                  type="button"
                  variant={formData.estado === estado ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, estado: estado as any }))}
                  className={formData.estado === estado ? "gradient-bg text-white" : "border-border hover:bg-muted/50 bg-transparent hover-lift"}
                >
                  {estado}
                </Button>
              ))}
            </div>
          </div>

          {/* Resumen */}
          {selectedService && selectedBarber && formData.fecha_hora && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">Resumen de la Cita</h4>
                <div className="flex items-center space-x-2">
                  {isNewClient && emailValidation?.isValid && emailVerification?.exists && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Cliente</span>
                    </div>
                  )}
                  {isAdminEmailConfigured() && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <User className="h-4 w-4" />
                      <span className="text-xs font-medium">Admin</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{isNewClient ? newClient.name : "Cliente seleccionado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Barbero:</span>
                  <span className="font-medium">{selectedBarber.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium">
                    {new Date(formData.fecha_hora).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hora:</span>
                  <span className="font-medium">
                    {new Date(formData.fecha_hora).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-primary text-lg">${selectedService.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error de envío */}
          {errors.submit && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border hover:bg-muted/50 bg-transparent hover-lift"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || creatingAppointment || creatingClient}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
            >
              {isSubmitting || creatingAppointment || creatingClient ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Crear Cita
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
