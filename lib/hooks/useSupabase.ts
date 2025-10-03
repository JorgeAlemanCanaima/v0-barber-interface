import { useState, useEffect } from 'react'
import { supabase, User, Service, Cita, Client, Role, Notification } from '../supabase'

// Hook para obtener barberos (usuarios con rol 'barbero')
export function useBarbers() {
  const [barbers, setBarbers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBarbers()
  }, [])

  const fetchBarbers = async () => {
    try {
      setLoading(true)
      
      // Intentar consultar la tabla user, si falla usar datos mock
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('is_active', true)

      if (error) {
        console.warn('Error al cargar usuarios de la base de datos:', error.message)
        // Si no hay tabla user, usar datos mock para barberos
        const mockBarbers = [
          {
            id: 1,
            role_id: 1,
            email: 'barbero1@barberia.com',
            password_hash: '',
            full_name: 'Carlos Mendoza',
            phone: '+1234567890',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            role_id: 1,
            email: 'barbero2@barberia.com',
            password_hash: '',
            full_name: 'Miguel Torres',
            phone: '+1234567891',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setBarbers(mockBarbers)
        return
      }
      
      // Si hay datos, usarlos; si no, usar mock
      const barberUsers = data && data.length > 0 ? data : [
        {
          id: 1,
          role_id: 1,
          email: 'barbero1@barberia.com',
          password_hash: '',
          full_name: 'Carlos Mendoza',
          phone: '+1234567890',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      setBarbers(barberUsers)
    } catch (err) {
      console.error('Error completo al cargar barberos:', err)
      // En caso de error, usar datos mock para que la aplicación funcione
      const mockBarbers = [
        {
          id: 1,
          role_id: 1,
          email: 'barbero1@barberia.com',
          password_hash: '',
          full_name: 'Carlos Mendoza',
          phone: '+1234567890',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setBarbers(mockBarbers)
      setError(null) // No mostrar error si tenemos datos mock
    } finally {
      setLoading(false)
    }
  }

  return { barbers, loading, error, refetch: fetchBarbers }
}

// Hook para obtener servicios
export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('service')
        .select('*')

      if (error) {
        console.error('Error al cargar servicios de la base de datos:', error.message)
        setError(error.message)
        setServices([])
        return
      }
      
      // Filtrar solo servicios activos
      const activeServices = data?.filter(service => service.is_active !== false) || []
      setServices(activeServices)
    } catch (err) {
      console.error('Error completo al cargar servicios:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar servicios')
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  return { services, loading, error, refetch: fetchServices }
}

// Hook para obtener citas
export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
    // Verificar y actualizar citas vencidas cada vez que se cargan las citas
    updateExpiredAppointments()
  }, [date])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Iniciando carga de citas...')
      
      // Intentar con la estructura antigua primero (más compatible)
      const { data, error } = await supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, email, phone),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .order('fecha_hora', { ascending: true })

      if (error) {
        console.error('Error al cargar citas:', error.message)
        throw error
      }

      console.log('Citas cargadas:', data?.length || 0)

      // Convertir estructura antigua a nueva para compatibilidad
      const convertedData = data?.map(appointment => ({
        ...appointment,
        cita_services: appointment.service ? [{
          id: 0,
          cita_id: appointment.id,
          service_id: appointment.service_id,
          created_at: appointment.created_at,
          service: appointment.service
        }] : []
      })) || []
      
      setAppointments(convertedData)
      
      // Si no hay datos, crear algunos datos de ejemplo
      if (convertedData.length === 0) {
        console.log('No hay citas, creando datos de ejemplo...')
        await createSampleData()
        // Recargar después de crear datos
        setTimeout(() => {
          fetchAppointments()
        }, 1000)
      }
      
    } catch (err) {
      console.error('Error completo al cargar citas:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar citas')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar citas vencidas
  const updateExpiredAppointments = async () => {
    try {
      const now = new Date().toISOString()
      
      // Buscar citas que han pasado su fecha y no están en estado ATENDIDA o CANCELADA
      const { data: expiredAppointments, error: fetchError } = await supabase
        .from('cita')
        .select('id')
        .lt('fecha_hora', now)
        .in('estado', ['PENDIENTE', 'CONFIRMADA'])

      if (fetchError) {
        console.warn('Error al buscar citas vencidas (puede ser normal si no hay citas):', fetchError.message)
        return
      }

      if (expiredAppointments && expiredAppointments.length > 0) {
        // Actualizar todas las citas vencidas a estado CANCELADA
        const { error: updateError } = await supabase
          .from('cita')
          .update({ estado: 'CANCELADA' })
          .in('id', expiredAppointments.map(apt => apt.id))

        if (updateError) {
          console.error('Error al actualizar citas vencidas:', updateError)
        } else {
          console.log(`Se actualizaron ${expiredAppointments.length} citas a estado CANCELADA por vencimiento`)
          // Refrescar la lista de citas
          await fetchAppointments()
        }
      }
    } catch (err) {
      console.warn('Error al actualizar citas vencidas (continuando):', err)
    }
  }

  // Función para crear datos de ejemplo
  const createSampleData = async () => {
    try {
      // Crear un cliente de ejemplo
      const { data: client, error: clientError } = await supabase
        .from('client')
        .insert([{
          name: 'Juan Pérez',
          email: 'juan@example.com',
          phone: '+1234567890',
          notes: 'Cliente frecuente'
        }])
        .select()
        .single()

      if (clientError && !clientError.message.includes('duplicate')) {
        console.error('Error al crear cliente de ejemplo:', clientError)
        return
      }

      // Crear un servicio de ejemplo
      const { data: service, error: serviceError } = await supabase
        .from('service')
        .insert([{
          name: 'Corte Clásico',
          description: 'Corte de cabello tradicional',
          price: 25.00,
          duration_min: 30,
          is_active: true
        }])
        .select()
        .single()

      if (serviceError && !serviceError.message.includes('duplicate')) {
        console.error('Error al crear servicio de ejemplo:', serviceError)
        return
      }

      // Crear una cita de ejemplo
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(10, 0, 0, 0)

      const { data: appointment, error: appointmentError } = await supabase
        .from('cita')
        .insert([{
          client_id: client?.id || 1,
          service_id: service?.id || 1,
          fecha_hora: tomorrow.toISOString(),
          estado: 'PENDIENTE'
        }])
        .select()
        .single()

      if (appointmentError && !appointmentError.message.includes('duplicate')) {
        console.error('Error al crear cita de ejemplo:', appointmentError)
        return
      }

      console.log('Datos de ejemplo creados exitosamente')
    } catch (err) {
      console.warn('Error al crear datos de ejemplo (continuando):', err)
    }
  }

  return { appointments, loading, error, refetch: fetchAppointments, updateExpiredAppointments }
}

// Hook para crear una cita
export function useCreateAppointment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAppointment = async (appointmentData: Omit<Cita, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('cita')
        .insert([appointmentData])
        .select()
        .single()

      if (error) {
        console.error('Error creating appointment:', error)
        throw error
      }
      
      return data
    } catch (err) {
      console.error('Error completo al crear cita:', err)
      setError(err instanceof Error ? err.message : 'Error al crear cita')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createAppointment, loading, error }
}

// Hook para obtener clientes
export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('client')
        .select(`
          *,
          user:user_id(id, full_name, email, phone)
        `)
        .order('name')

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  return { clients, loading, error, refetch: fetchClients }
}

// Hook para crear un cliente
export function useCreateClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      setError(null)

      // Intentar crear el cliente directamente
      const { data, error } = await supabase
        .from('client')
        .insert([clientData])
        .select()
        .single()

      if (error) {
        console.error('Error creating client:', error)
        throw error
      }
      
      return data
    } catch (err) {
      console.error('Error completo al crear cliente:', err)
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createClient, loading, error }
}

// Hook para obtener notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('notification')
        .select(`
          *,
          user:user_id(id, full_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar notificaciones:', error.message)
        setError(error.message)
        setNotifications([])
        return
      }
      
      console.log('Notificaciones cargadas desde Supabase:', data)
      setNotifications(data || [])
    } catch (err) {
      console.error('Error completo al cargar notificaciones:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('notification')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId)

      if (error) throw error

      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      )
    } catch (err) {
      console.error('Error al marcar notificación como leída:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notification')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('is_read', false)

      if (error) throw error

      // Actualizar el estado local
      setNotifications(prev => 
        prev.map(notification => 
          !notification.is_read 
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        )
      )
    } catch (err) {
      console.error('Error al marcar todas las notificaciones como leídas:', err)
    }
  }

  return { 
    notifications, 
    loading, 
    error, 
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}