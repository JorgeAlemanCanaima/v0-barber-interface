import { useState, useEffect, useMemo } from 'react'
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

      if (error) throw error
      
      // Filtrar solo usuarios con rol de barbero
      const barberUsers = data?.filter(user => 
        user.role?.name?.toLowerCase() === 'barbero' || user.role?.name?.toLowerCase() === 'barber'
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

      if (error) throw error
      
      // Filtrar solo servicios activos
      const activeServices = data?.filter(service => service.is_active !== false) || []
      
      setServices(activeServices)
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

// Hook para obtener roles
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('role')
        .select('*')
        .order('name')

      if (error) throw error
      setRoles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles')
    } finally {
      setLoading(false)
    }
  }

  return { roles, loading, error, refetch: fetchRoles }
}

// Hook para obtener estadísticas generales
export function useStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    todayAppointments: 0,
    todayRevenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Obtener conteos de todas las tablas principales
      const [usersResult, clientsResult, servicesResult, appointmentsResult] = await Promise.all([
        supabase.from('user').select('*', { count: 'exact', head: true }),
        supabase.from('client').select('*', { count: 'exact', head: true }),
        supabase.from('service').select('*', { count: 'exact', head: true }),
        supabase.from('cita').select('*', { count: 'exact', head: true })
      ])

      // Obtener citas atendidas para calcular ingresos
      const { data: attendedAppointments } = await supabase
        .from('cita')
        .select(`
          *,
          service:service_id(id, name, price)
        `)
        .eq('estado', 'ATENDIDA')

      // Calcular ingresos totales
      const totalRevenue = attendedAppointments?.reduce((sum, apt) => 
        sum + (apt.service?.price || 0), 0) || 0

      // Calcular estadísticas de hoy
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data: todayAppointments } = await supabase
        .from('cita')
        .select(`
          *,
          service:service_id(id, name, price)
        `)
        .gte('fecha_hora', today.toISOString())
        .lt('fecha_hora', tomorrow.toISOString())
        .eq('estado', 'ATENDIDA')

      const todayRevenue = todayAppointments?.reduce((sum, apt) => 
        sum + (apt.service?.price || 0), 0) || 0

      setStats({
        totalUsers: usersResult.count || 0,
        totalClients: clientsResult.count || 0,
        totalServices: servicesResult.count || 0,
        totalAppointments: appointmentsResult.count || 0,
        totalRevenue,
        todayAppointments: todayAppointments?.length || 0,
        todayRevenue
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}

// Hook para obtener citas atendidas hoy
export function useTodayAppointments() {
  const [appointments, setAppointments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodayAppointments()
  }, [])

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true)
      
      // Primero intentar obtener citas atendidas hoy
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data: todayData, error: todayError } = await supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, email, phone),
          service:service_id(id, name, price, duration_min),
          barber:barber_user_id(id, full_name, phone)
        `)
        .gte('fecha_hora', today.toISOString())
        .lt('fecha_hora', tomorrow.toISOString())
        .eq('estado', 'ATENDIDA')
        .order('fecha_hora', { ascending: false })

      // Si no hay citas atendidas hoy, obtener las últimas citas atendidas (de cualquier fecha)
      if (!todayError && (!todayData || todayData.length === 0)) {
        const { data: recentData, error: recentError } = await supabase
          .from('cita')
          .select(`
            *,
            client:client_id(id, name, email, phone),
            service:service_id(id, name, price, duration_min),
            barber:barber_user_id(id, full_name, phone)
          `)
          .eq('estado', 'ATENDIDA')
          .order('fecha_hora', { ascending: false })
          .limit(5)

        if (recentError) throw recentError
        setAppointments(recentData || [])
      } else {
        if (todayError) throw todayError
        setAppointments(todayData || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar citas')
    } finally {
      setLoading(false)
    }
  }

  return { appointments, loading, error, refetch: fetchTodayAppointments }
}

// Hook para obtener todas las citas (para debug)
export function useAllAppointments() {
  const [appointments, setAppointments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllAppointments()
  }, [])

  const fetchAllAppointments = async () => {
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
        .order('fecha_hora', { ascending: false })
        .limit(10)

      if (error) throw error
      setAppointments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar citas')
    } finally {
      setLoading(false)
    }
  }

  return { appointments, loading, error, refetch: fetchAllAppointments }
}

// Hook para generar datos de gráficos basados en datos reales
export function useChartData() {
  const { appointments } = useAppointments()
  const { services } = useServices()

  const earningsData = useMemo(() => {
    // Generar datos de los últimos 6 meses basados en citas atendidas
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12
      const monthStart = new Date(new Date().getFullYear(), monthIndex, 1)
      const monthEnd = new Date(new Date().getFullYear(), monthIndex + 1, 0)
      
      const monthAppointments = (appointments || []).filter(apt => {
        const aptDate = new Date(apt.fecha_hora)
        return apt.estado === 'ATENDIDA' && aptDate >= monthStart && aptDate <= monthEnd
      })
      
      const earnings = monthAppointments.reduce((sum, apt) => sum + (apt.service?.price || 0), 0)
      const clients = monthAppointments.length
      
      return { name: month, earnings, clients }
    })
  }, [appointments])

  const haircutTypes = useMemo(() => {
    // Generar datos de servicios basados en citas reales
    const serviceCounts = (services || []).map(service => {
      const count = (appointments || []).filter(apt => apt.service_id === service.id).length
      return {
        name: service.name,
        value: count,
        count,
        color: `hsl(${Math.random() * 360}, 70%, 50%)` // Color aleatorio para cada servicio
      }
    }).sort((a, b) => b.value - a.value).slice(0, 5) // Top 5 servicios

    return serviceCounts
  }, [services, appointments])

  return { earningsData, haircutTypes }
}
