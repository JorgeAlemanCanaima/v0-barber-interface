"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Scissors } from "lucide-react"
import { Service, supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast"

interface EditServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceUpdated: () => void
  service: Service | null
}

export function EditServiceModal({ isOpen, onClose, onServiceUpdated, service }: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_min: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError, ToastContainer } = useToast()

  // Cargar datos del servicio cuando se abre el modal
  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        name: service.name || "",
        price: service.price?.toString() || "",
        duration_min: service.duration_min?.toString() || "",
      })
      setError(null)
    }
  }, [service, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre del servicio es obligatorio")
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("El precio debe ser mayor a 0")
      return false
    }
    if (!formData.duration_min || parseInt(formData.duration_min) <= 0) {
      setError("La duración debe ser mayor a 0 minutos")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !service) return

    setIsLoading(true)
    setError(null)

    try {
      const serviceData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        duration_min: parseInt(formData.duration_min),
        is_active: service.is_active // Mantener el estado actual
      }

      console.log('Actualizando servicio:', service.id, serviceData)

      // Actualizar en la base de datos
      const { data, error } = await supabase
        .from('service')
        .update(serviceData)
        .eq('id', service.id)
        .select()
        .single()

      if (error) {
        console.error('Error al actualizar servicio en BD:', error)
        throw new Error(`Error al actualizar servicio: ${error.message}`)
      }

      console.log('Servicio actualizado exitosamente en BD:', data)

      // Mostrar notificación de éxito
      success('¡Servicio actualizado exitosamente!', `"${formData.name}" se ha actualizado correctamente`)
      
      // Cerrar modal y actualizar lista
      onServiceUpdated()
      onClose()

    } catch (err) {
      console.error('Error inesperado:', err)
      setError(err instanceof Error ? err.message : "Error inesperado. Inténtalo de nuevo.")
      showError('Error al actualizar servicio', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        price: "",
        duration_min: "",
      })
      setError(null)
      onClose()
    }
  }

  if (!service) return null

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Editar Servicio"
        size="md"
      >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Service Icon Preview */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl gradient-bg shadow-lg">
            <Scissors className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nombre del Servicio *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: Fade Clásico, Corte + Barba..."
              className="w-full"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                Precio ($) *
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="25.00"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="duration_min" className="block text-sm font-medium text-foreground mb-2">
                Duración (min) *
              </label>
              <Input
                id="duration_min"
                name="duration_min"
                type="number"
                min="1"
                value={formData.duration_min}
                onChange={handleInputChange}
                placeholder="30"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Preview Card */}
        {formData.name && (
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg shadow-md">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{formData.name || "Nombre del servicio"}</p>
                  <p className="text-sm text-muted-foreground">Servicio actualizado</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {formData.duration_min || "0"} min
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                      {service.is_active ? 'Disponible' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    ${formData.price || "0"}
                  </p>
                </div>
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
                <Scissors className="h-4 w-4 mr-2" />
                Actualizar Servicio
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
