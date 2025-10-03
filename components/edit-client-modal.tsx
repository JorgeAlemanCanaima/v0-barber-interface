"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Phone,
  Mail,
  FileText,
  Save,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { validateNicaraguaPhone, validateEmail } from "@/lib/validations"

interface EditClientModalProps {
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
  onClientUpdated: () => void
}

export function EditClientModal({ isOpen, onClose, client, onClientUpdated }: EditClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneValidation, setPhoneValidation] = useState<{ isValid: boolean; formatted: string; error?: string } | null>(null)
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string } | null>(null)

  // Inicializar datos del formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && client) {
      setFormData({
        name: client.name || "",
        phone: client.phone || "",
        email: client.email || "",
        notes: client.notes || "",
      })
      setErrors({})
      setPhoneValidation(null)
      setEmailValidation(null)
    }
  }, [isOpen, client])

  // Validar teléfono en tiempo real
  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone }))
    
    if (phone.trim()) {
      const validation = validateNicaraguaPhone(phone)
      setPhoneValidation(validation)
    } else {
      setPhoneValidation(null)
    }
  }

  // Validar email en tiempo real
  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }))
    
    if (email.trim()) {
      const validation = validateEmail(email)
      setEmailValidation(validation)
    } else {
      setEmailValidation(null)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del cliente es requerido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono del cliente es requerido"
    } else {
      const phoneValidation = validateNicaraguaPhone(formData.phone)
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.error || "Número de teléfono inválido"
      }
    }

    if (formData.email.trim()) {
      const emailValidation = validateEmail(formData.email)
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error || "Email inválido"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!client?.id) {
      setErrors({ submit: "Cliente no válido" })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('client')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          notes: formData.notes.trim() || null,
        })
        .eq('id', client.id)
        .select()
        .single()

      if (error) {
        console.error('Error al actualizar cliente:', error)
        setErrors({ submit: "Error al actualizar el cliente. Inténtalo de nuevo." })
        return
      }

      console.log('Cliente actualizado exitosamente:', data)
      onClientUpdated()
      onClose()
    } catch (error) {
      console.error("Error al actualizar cliente:", error)
      setErrors({ submit: "Error al actualizar el cliente. Inténtalo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!client) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Editar Cliente">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Editar Cliente</h2>
              <p className="text-muted-foreground">Actualiza la información del cliente</p>
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
          {/* Información básica */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Información Básica</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre del Cliente *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  value={formData.phone}
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
                Email
              </label>
              <div className="relative">
                <Input
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  type="email"
                  className={`${errors.email ? "border-red-500" : ""} ${
                    emailValidation?.isValid ? "border-green-500" : 
                    emailValidation?.isValid === false ? "border-red-500" : ""
                  }`}
                />
                {emailValidation?.isValid && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {emailValidation?.isValid === false && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
              </div>
              {emailValidation?.isValid && (
                <p className="text-green-600 text-sm mt-1">
                  ✅ Email válido
                </p>
              )}
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {emailValidation?.isValid === false && !errors.email && (
                <p className="text-red-500 text-sm mt-1">{emailValidation.error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales sobre el cliente..."
                rows={3}
              />
            </div>
          </div>

          {/* Información del barbero asignado */}
          {client.user && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Barbero Asignado</h3>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{client.user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{client.user.email}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 border-blue-200 dark:border-blue-800">
                    Asignado
                  </Badge>
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
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
