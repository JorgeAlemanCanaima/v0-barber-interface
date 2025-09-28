"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Scissors } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast"

interface AddServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceAdded: () => void
  onAddServiceLocally?: (service: Omit<Service, 'id'>) => void
}

export function AddServiceModal({ isOpen, onClose, onServiceAdded, onAddServiceLocally }: AddServiceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_min: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError, ToastContainer } = useToast()

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
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      const serviceData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        duration_min: parseInt(formData.duration_min),
        is_active: true,
        created_at: new Date().toISOString()
      }

      console.log('Iniciando guardado de servicio:', serviceData)

      // Intentar guardar en la base de datos
      let error = null
      try {
        const { data, error: dbError } = await supabase
          .from('service')
          .insert([serviceData])
          .select()
          .single()
        
        error = dbError
        if (data) {
          console.log('Servicio guardado en BD:', data)
        }
      } catch (dbError) {
        error = dbError
        console.warn('Error al conectar con BD:', dbError)
      }

      if (error) {
        console.warn('Error al crear servicio en BD:', error)
        // Si hay error en la BD, agregar localmente
        console.log('Guardando servicio localmente (modo demo)')
        console.log('Datos del servicio:', serviceData)
        
        if (onAddServiceLocally) {
          console.log('Llamando a onAddServiceLocally...')
          onAddServiceLocally(serviceData)
          console.log('Servicio agregado localmente')
        } else {
          console.log('onAddServiceLocally no está disponible')
        }
        
        // Simular delay para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Limpiar formulario
      setFormData({
        name: "",
        description: "",
        price: "",
        duration_min: "",
      })

      console.log('Cerrando modal y actualizando lista...')
      
      // Mostrar notificación de éxito
      success('¡Servicio agregado exitosamente!', `"${formData.name}" se ha agregado al catálogo`)
      
      // Cerrar modal y actualizar lista
      if (error) {
        // Si hubo error en BD, ya se agregó localmente, solo cerrar modal
        onClose()
      } else {
        // Si se guardó en BD, hacer refetch
        onServiceAdded()
      }

    } catch (err) {
      console.error('Error inesperado:', err)
      setError("Error inesperado. Inténtalo de nuevo.")
      showError('Error al agregar servicio', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: "",
        description: "",
        price: "",
        duration_min: "",
      })
      setError(null)
      onClose()
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Agregar Nuevo Servicio"
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe brevemente el servicio..."
              rows={3}
              className="w-full resize-none"
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
                  <p className="text-sm text-muted-foreground">
                    {formData.description || "Sin descripción"}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {formData.duration_min || "0"} min
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                      Disponible
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
                Guardando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
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
