"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, AlertTriangle, Scissors } from "lucide-react"
import { Service, supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/toast"

interface DeleteServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceDeleted: () => void
  service: Service | null
}

export function DeleteServiceModal({ isOpen, onClose, onServiceDeleted, service }: DeleteServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { success, error: showError, ToastContainer } = useToast()

  const handleDelete = async () => {
    if (!service) return

    setIsLoading(true)
    setError(null)

    try {
      console.log('Eliminando servicio:', service.id)

      // Eliminar de la base de datos
      const { error } = await supabase
        .from('service')
        .delete()
        .eq('id', service.id)

      if (error) {
        console.error('Error al eliminar servicio de BD:', error)
        throw new Error(`Error al eliminar servicio: ${error.message}`)
      }

      console.log('Servicio eliminado exitosamente de BD')

      // Mostrar notificación de éxito
      success('¡Servicio eliminado exitosamente!', `"${service.name}" se ha eliminado del catálogo`)
      
      // Cerrar modal y actualizar lista
      onServiceDeleted()
      onClose()

    } catch (err) {
      console.error('Error inesperado:', err)
      setError(err instanceof Error ? err.message : "Error inesperado. Inténtalo de nuevo.")
      showError('Error al eliminar servicio', 'Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
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
        title="Eliminar Servicio"
        size="md"
      >
        <div className="space-y-6">
          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-red-100 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              ¿Estás seguro de que quieres eliminar este servicio?
            </h3>
            <p className="text-muted-foreground">
              Esta acción no se puede deshacer. El servicio será eliminado permanentemente de la base de datos.
            </p>
          </div>

          {/* Service Info Card */}
          <Card className="glass-card border-0 border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Servicio a Eliminar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-bg shadow-md">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{service.name}</p>
                  <p className="text-sm text-muted-foreground">Servicio de barbería</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {service.duration_min || 0} min
                    </span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                      ${service.price || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700 shadow-lg hover-lift"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Servicio
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Contenedor de notificaciones */}
      <ToastContainer />
    </>
  )
}
