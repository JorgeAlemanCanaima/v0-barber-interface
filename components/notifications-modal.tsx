"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useNotifications } from "@/lib/hooks/useSupabase"
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Star,
  Calendar,
  Package,
  MessageSquare,
  Gift,
  CreditCard,
  User
} from "lucide-react"

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all')

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'inventory':
        return <Package className="h-5 w-5 text-orange-500" />
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />
      case 'birthday':
        return <Gift className="h-5 w-5 text-pink-500" />
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />
      case 'reminder':
        return <Bell className="h-5 w-5 text-purple-500" />
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string, isUrgent: boolean) => {
    if (isUrgent) return 'border-red-200 bg-red-50'
    
    switch (type) {
      case 'appointment':
        return 'border-blue-200 bg-blue-50'
      case 'inventory':
        return 'border-orange-200 bg-orange-50'
      case 'review':
        return 'border-yellow-200 bg-yellow-50'
      case 'payment':
        return 'border-green-200 bg-green-50'
      case 'birthday':
        return 'border-pink-200 bg-pink-50'
      case 'system':
        return 'border-gray-200 bg-gray-50'
      case 'reminder':
        return 'border-purple-200 bg-purple-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const filteredNotifications = notifications?.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.is_read
      case 'urgent':
        return notification.is_urgent
      default:
        return true
    }
  }) || []

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0
  const urgentCount = notifications?.filter(n => n.is_urgent).length || 0

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId)
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Notificaciones">
      <div className="p-6">
        {/* Header con filtros */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Centro de Notificaciones</h2>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-300">
                {unreadCount} sin leer
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary text-white' : ''}
            >
              Todas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-primary text-white' : ''}
            >
              Sin leer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter('urgent')}
              className={filter === 'urgent' ? 'bg-primary text-white' : ''}
            >
              Urgentes
            </Button>
          </div>
        </div>

        {/* Botón para marcar todas como leídas */}
        {unreadCount > 0 && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como leídas
            </Button>
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Cargando notificaciones...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Error al cargar notificaciones</span>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay notificaciones</p>
              <p className="text-sm">
                {filter === 'unread' ? 'No tienes notificaciones sin leer' :
                 filter === 'urgent' ? 'No hay notificaciones urgentes' :
                 'No tienes notificaciones aún'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? 'ring-2 ring-primary/20' : ''
                } ${getNotificationColor(notification.type, notification.is_urgent)}`}
                onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {notification.is_urgent && (
                            <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                              Urgente
                            </Badge>
                          )}
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.created_at).toLocaleString('es-NI', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
