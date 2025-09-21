import { useState } from 'react'
import { supabase, Client, Service, Cita } from '../supabase'

export interface BookingData {
  date: string
  time: string
  service: string
  clientName: string
  clientPhone: string
  comments: string
}

export function useBooking() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (bookingData: BookingData) => {
    try {
      setLoading(true)
      setError(null)

      // Primero, crear o encontrar el cliente
      let clientId: number

      // Buscar si el cliente ya existe por teléfono
      const { data: existingClient } = await supabase
        .from('client')
        .select('id')
        .eq('phone', bookingData.clientPhone)
        .single()

      if (existingClient) {
        clientId = existingClient.id
      } else {
        // Crear nuevo cliente
        const { data: newClient, error: clientError } = await supabase
          .from('client')
          .insert([{
            name: bookingData.clientName,
            phone: bookingData.clientPhone,
            notes: bookingData.comments || null
          }])
          .select('id')
          .single()

        if (clientError) throw clientError
        clientId = newClient.id
      }

      // Buscar el servicio por nombre
      const { data: service, error: serviceError } = await supabase
        .from('service')
        .select('id')
        .eq('name', bookingData.service)
        .single()

      if (serviceError) throw serviceError

      // Crear la fecha y hora combinadas
      const fechaHora = new Date(`${bookingData.date}T${bookingData.time}:00`)

      // Crear la cita
      const { data: appointment, error: appointmentError } = await supabase
        .from('cita')
        .insert([{
          client_id: clientId,
          service_id: service.id,
          fecha_hora: fechaHora.toISOString(),
          estado: 'PENDIENTE'
        }])
        .select(`
          *,
          client:client_id(id, name, phone),
          service:service_id(id, name, price)
        `)
        .single()

      if (appointmentError) throw appointmentError

      return appointment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la reserva')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAvailableTimeSlots = async (date: string) => {
    try {
      setLoading(true)
      
      // Obtener todas las citas del día
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const { data: appointments, error } = await supabase
        .from('cita')
        .select('fecha_hora')
        .gte('fecha_hora', startOfDay.toISOString())
        .lte('fecha_hora', endOfDay.toISOString())
        .eq('estado', 'CONFIRMADA')

      if (error) throw error

      // Generar horarios disponibles (9:00 AM - 6:00 PM, cada 30 min)
      const timeSlots = []
      const bookedTimes = appointments?.map(apt => {
        const aptDate = new Date(apt.fecha_hora)
        return `${aptDate.getHours().toString().padStart(2, '0')}:${aptDate.getMinutes().toString().padStart(2, '0')}`
      }) || []

      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          const isBooked = bookedTimes.includes(timeString)
          
          timeSlots.push({
            time: timeString,
            available: !isBooked
          })
        }
      }

      return timeSlots
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener horarios')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createBooking, getAvailableTimeSlots, loading, error }
}

