"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"
import {
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react"
import { useCreateClient } from "@/lib/hooks/useSupabase"
import { useBarbers } from "@/lib/hooks/useSupabase"

interface AddClientModalProps {
  isOpen: boolean
  onClose: () => void
  onClientAdded: () => void
}

export function AddClientModal({
  isOpen,
  onClose,
  onClientAdded,
}: AddClientModalProps) {
  const { createClient, loading: creatingClient } = useCreateClient()
  const { barbers, loading: barbersLoading } = useBarbers()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
    user_id: "", // ID del barbero
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        notes: "",
        user_id: "",
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del cliente es requerido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono del cliente es requerido"
    }

    if (!formData.user_id) {
      newErrors.user_id = "Debe seleccionar un barbero"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no tiene un formato válido"
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
      const clientData = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        notes: formData.notes || undefined,
        user_id: parseInt(formData.user_id), // ID del barbero seleccionado
      }

      await createClient(clientData)
      onClientAdded()
      onClose()
    } catch (error) {
      console.error("Error al crear cliente:", error)
      setErrors({ submit: "Error al crear el cliente. Inténtalo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Nuevo Cliente">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-bg shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Nuevo Cliente</h2>
              <p className="text-muted-foreground">Agrega un nuevo cliente a tu base de datos</p>
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
              <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre Completo *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo del cliente"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teléfono *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
                type="email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notas Adicionales
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Preferencias, alergias, información importante..."
                rows={4}
              />
            </div>
          </div>

          {/* Selección de barbero */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Barbero Asignado</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Seleccionar Barbero *
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, user_id: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-xl bg-background text-foreground focus:border-primary focus:outline-none ${
                  errors.user_id ? "border-red-500" : "border-border"
                }`}
              >
                <option value="">Seleccionar barbero...</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.full_name}
                  </option>
                ))}
              </select>
              {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
            </div>
          </div>

          {/* Resumen */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="font-semibold text-foreground mb-3">Resumen del Cliente</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium">{formData.name || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{formData.phone || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{formData.email || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Barbero:</span>
                <span className="font-medium">
                  {formData.user_id 
                    ? barbers.find(b => b.id === parseInt(formData.user_id))?.full_name || "No especificado"
                    : "No especificado"
                  }
                </span>
              </div>
              {formData.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notas:</span>
                  <span className="font-medium text-right max-w-xs truncate">{formData.notes}</span>
                </div>
              )}
            </div>
          </div>

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
              disabled={isSubmitting || creatingClient}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover-lift"
            >
              {isSubmitting || creatingClient ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Crear Cliente
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
