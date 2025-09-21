"use client"

import React, { useState, useEffect } from "react"
import { DayPicker } from "react-day-picker"
import 'react-day-picker/dist/style.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Calendar, MessageCircle, Clock, Trash2, Edit, Plus } from "lucide-react"

type Service = {
  id: number
  name: string
  price: number
}

type Slot = { time: string; available: boolean }

type Appointment = {
  id: number
  name: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export function BookingSection({ services = [], availableSlots = [] }: { services?: Service[]; availableSlots?: Slot[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [view, setView] = useState<'booking' | 'list'>('booking')
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  // Cargar citas desde localStorage al inicializar
  useEffect(() => {
    const savedAppointments = localStorage.getItem('barber-appointments')
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments))
    }
  }, [])

  // Guardar citas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('barber-appointments', JSON.stringify(appointments))
  }, [appointments])

  // Filtrar slots disponibles para el día seleccionado
  const slotsForDay = availableSlots.filter(slot => slot.available)

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Nombre demasiado corto' }),
    phone: z.string().min(7, { message: 'Teléfono demasiado corto' }),
    service: z.string().min(1, { message: 'Selecciona un servicio' }),
    time: z.string().min(1, { message: 'Selecciona un horario' }),
    notes: z.string().optional(),
  })

  type FormValues = z.infer<typeof FormSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { 
      service: services.length > 0 ? String(services[0].id) : "",
    },
  })

  // Observar el valor del servicio seleccionado
  const selectedService = watch("service")

  // Función para manejar la selección de hora
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setValue("time", time)
  }

  // Función para agregar o editar una cita
  const saveAppointment = (data: FormValues) => {
    if (!selectedDate) return alert('Selecciona una fecha')
    
    const serviceName = services.find(s => s.id === parseInt(data.service))?.name || data.service
    
    const appointmentData = {
      id: editingAppointment ? editingAppointment.id : Date.now(),
      name: data.name,
      phone: data.phone,
      service: serviceName,
      date: selectedDate.toISOString().split('T')[0],
      time: data.time,
      notes: data.notes || '',
      status: editingAppointment ? editingAppointment.status : 'pending'
    }

    if (editingAppointment) {
      // Editar cita existente
      setAppointments(appointments.map(a => a.id === editingAppointment.id ? appointmentData : a))
      setEditingAppointment(null)
    } else {
      // Agregar nueva cita
      setAppointments([...appointments, appointmentData])
    }

    // Resetear el formulario
    reset()
    setSelectedTime("")
    setSelectedDate(new Date())
    
    alert(editingAppointment ? 'Cita actualizada correctamente' : 'Cita reservada correctamente')
  }

  // Función para eliminar una cita
  const deleteAppointment = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      setAppointments(appointments.filter(a => a.id !== id))
    }
  }

  // Función para editar una cita
  const editAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setValue("name", appointment.name)
    setValue("phone", appointment.phone)
    setValue("service", String(services.find(s => s.name === appointment.service)?.id || ""))
    setValue("time", appointment.time)
    setValue("notes", appointment.notes)
    setSelectedTime(appointment.time)
    setSelectedDate(new Date(appointment.date))
    setView('booking')
  }

  // Función para cambiar el estado de una cita
  const updateAppointmentStatus = (id: number, status: Appointment['status']) => {
    setAppointments(appointments.map(a => 
      a.id === id ? {...a, status} : a
    ))
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Sistema de Citas para Barbería</h2>
            <p className="text-xl text-muted-foreground">
              Gestiona todas las reservas de tu barbería en un solo lugar.
            </p>
            
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                onClick={() => setView('booking')} 
                variant={view === 'booking' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                Nueva Cita
              </Button>
              <Button 
                onClick={() => setView('list')} 
                variant={view === 'list' ? 'default' : 'outline'}
              >
                Ver Todas las Citas ({appointments.length})
              </Button>
            </div>
          </div>

          {view === 'booking' ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-primary" />
                    Horarios Disponibles
                  </CardTitle>
                  <CardDescription>Selecciona el día y el horario que mejor te convenga</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-lg shadow-sm bg-white/5"
                    />
                  </div>

                  <div className="mb-4 text-sm text-muted-foreground">
                    Seleccionaste: {selectedDate?.toLocaleDateString()}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-semibold">Horarios disponibles:</span>
                    </div>
                    
                    {slotsForDay.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {slotsForDay.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => handleTimeSelect(slot.time)}
                            className={`flex items-center justify-center rounded-xl font-semibold p-2 border transition-all ${
                              selectedTime === slot.time
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-card hover:bg-accent border-border'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm py-4">
                        No hay horarios disponibles para esta fecha. Por favor, selecciona otra.
                      </p>
                    )}
                    
                    {errors.time && (
                      <p className="text-destructive text-sm mt-2">{errors.time.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3 text-primary" />
                    {editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
                  </CardTitle>
                  <CardDescription>Completa los datos para {editingAppointment ? 'editar' : 'crear'} la cita</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(saveAppointment)} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Nombre *
                      </label>
                      <Input 
                        placeholder="Tu nombre completo" 
                        className="rounded-xl border-border focus:border-primary"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Teléfono *
                      </label>
                      <Input 
                        placeholder="Tu número de teléfono" 
                        className="rounded-xl border-border focus:border-primary"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Servicio Deseado *
                      </label>
                      <select 
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none"
                        {...register("service")}
                      >
                        <option value="">Selecciona un servicio</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-destructive text-sm mt-1">{errors.service.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Fecha y Hora Seleccionada *
                      </label>
                      <Input 
                        value={selectedDate ? `${selectedDate.toLocaleDateString()} - ${selectedTime}` : "Selecciona una fecha y hora"} 
                        className="rounded-xl border-border bg-muted"
                        readOnly
                      />
                      <input type="hidden" {...register("time")} />
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Comentarios (Opcional)
                      </label>
                      <Textarea 
                        placeholder="Alguna preferencia especial o comentario..." 
                        className="rounded-xl border-border focus:border-primary resize-none" 
                        rows={3}
                        {...register("notes")}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        className="flex-1 gradient-bg text-white hover:opacity-90 shadow-lg font-bold text-lg py-3 rounded-xl hover-lift"
                        disabled={isSubmitting || !selectedTime}
                      >
                        {isSubmitting ? "Procesando..." : editingAppointment ? "Actualizar Cita" : "Confirmar Reserva"}
                        <CheckCircle className="h-5 w-5 ml-2" />
                      </Button>
                      
                      {editingAppointment && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setEditingAppointment(null)
                            reset()
                            setSelectedTime("")
                            setSelectedDate(new Date())
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground flex items-center">
                  Lista de Citas
                </CardTitle>
                <CardDescription>
                  Gestiona todas las citas programadas de tu barbería
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay citas programadas.</p>
                    <Button onClick={() => setView('booking')} className="mt-4">
                      Crear primera cita
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="p-3 text-left">Cliente</th>
                          <th className="p-3 text-left">Teléfono</th>
                          <th className="p-3 text-left">Servicio</th>
                          <th className="p-3 text-left">Fecha</th>
                          <th className="p-3 text-left">Hora</th>
                          <th className="p-3 text-left">Estado</th>
                          <th className="p-3 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-b">
                            <td className="p-3">{appointment.name}</td>
                            <td className="p-3">{appointment.phone}</td>
                            <td className="p-3">{appointment.service}</td>
                            <td className="p-3">{appointment.date}</td>
                            <td className="p-3">{appointment.time}</td>
                            <td className="p-3">
                              <select 
                                value={appointment.status}
                                onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="confirmed">Confirmada</option>
                                <option value="completed">Completada</option>
                                <option value="cancelled">Cancelada</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => editAppointment(appointment)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteAppointment(appointment.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookingSection