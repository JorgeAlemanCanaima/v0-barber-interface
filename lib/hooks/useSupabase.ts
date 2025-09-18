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
      const { data, error } = await supabase
        .from('user')
        .select(`
          *,
          role:role_id(id, name, description)
        `)
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error
      
      // Filtrar solo usuarios con rol de barbero
      const barberUsers = data?.filter(user => 
        user.role?.name?.toLowerCase() === 'barbero'
      ) || []
      
      setBarbers(barberUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar barberos')
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
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar servicios')
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
  }, [date])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, email, phone),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .order('fecha_hora', { ascending: true })

      if (date) {
        // Filtrar por fecha (formato YYYY-MM-DD)
        const startDate = new Date(date)
        const endDate = new Date(date)
        endDate.setDate(endDate.getDate() + 1)
        
        query = query
          .gte('fecha_hora', startDate.toISOString())
          .lt('fecha_hora', endDate.toISOString())
      }

      const { data, error } = await query

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

      if (error) throw error
      return data
    } catch (err) {
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
