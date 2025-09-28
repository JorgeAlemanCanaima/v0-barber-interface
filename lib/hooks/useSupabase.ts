import { useState, useEffect } from 'react'
import { supabase, User, Service, Cita, Client, Role } from '../supabase'

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
      
      // Intentar consultar la tabla users, si falla usar datos mock
      const { data, error } = await supabase
        .from('users')
        .select('*')

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
        console.warn('Error al cargar servicios de la base de datos:', error.message)
        // Si no hay tabla service, usar datos mock
        const mockServices = [
          {
            id: 1,
            name: "Fade Clásico",
            price: 25,
            duration_min: 30,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Corte + Barba",
            price: 35,
            duration_min: 45,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            name: "Buzz Cut",
            price: 20,
            duration_min: 20,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ]
        setServices(mockServices)
        return
      }
      
      // Filtrar solo servicios activos
      const activeServices = data?.filter(service => service.is_active !== false) || []
      
      // Si no hay servicios activos, usar mock
      if (activeServices.length === 0) {
        const mockServices = [
          {
            id: 1,
            name: "Fade Clásico",
            price: 25,
            duration_min: 30,
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Corte + Barba",
            price: 35,
            duration_min: 45,
            is_active: true,
            created_at: new Date().toISOString()
          }
        ]
        setServices(mockServices)
      } else {
        setServices(activeServices)
      }
    } catch (err) {
      console.error('Error completo al cargar servicios:', err)
      // En caso de error, usar datos mock
      const mockServices = [
        {
          id: 1,
          name: "Fade Clásico",
          price: 25,
          duration_min: 30,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Corte + Barba",
          price: 35,
          duration_min: 45,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]
      setServices(mockServices)
      setError(null) // No mostrar error si tenemos datos mock
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar un servicio localmente (modo demo)
  const addServiceLocally = (newService: Omit<Service, 'id'>) => {
    console.log('addServiceLocally llamada con:', newService)
    const serviceWithId = {
      ...newService,
      id: Date.now() // Usar timestamp como ID único
    }
    console.log('Servicio con ID:', serviceWithId)
    setServices(prev => {
      console.log('Servicios anteriores:', prev)
      const newServices = [...prev, serviceWithId]
      console.log('Nuevos servicios:', newServices)
      return newServices
    })
  }

  return { services, loading, error, refetch: fetchServices, addServiceLocally }
}

// Hook para obtener citas
export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [date])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, email, phone),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .order('fecha_hora', { ascending: true })

      if (error) throw error
      
      setAppointments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar citas')
    } finally {
      setLoading(false)
    }
  }

  return { appointments, loading, error, refetch: fetchAppointments }
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