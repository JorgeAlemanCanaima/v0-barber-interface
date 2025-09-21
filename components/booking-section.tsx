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
import { CheckCircle, Calendar, MessageCircle, Clock } from "lucide-react"
import { useBooking } from "@/lib/hooks/useBooking"

type Service = {
  id: number
  name: string
  price: number
}

type Slot = { time: string; available: boolean }

export function BookingSection({ services = [], availableSlots = [] }: { services?: Service[]; availableSlots?: Slot[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [dynamicSlots, setDynamicSlots] = useState<Slot[]>([])
  const { getAvailableTimeSlots } = useBooking()

  // Cargar horarios dinámicos cuando cambie la fecha
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate) return
      try {
        const dateString = selectedDate.toISOString().split('T')[0]
        const slots = await getAvailableTimeSlots(dateString)
        setDynamicSlots(slots)
      } catch (error) {
        console.error('Error loading time slots:', error)
        setDynamicSlots([])
      }
    }
    loadSlots()
  }, [selectedDate, getAvailableTimeSlots])

  // Usar slots dinámicos si están disponibles, sino usar los pasados como prop
  const slotsToUse = dynamicSlots.length > 0 ? dynamicSlots : availableSlots
  const slotsForDay = slotsToUse.filter(slot => slot.available)

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Nombre demasiado corto' }),
    phone: z.string().min(7, { message: 'Teléfono demasiado corto' }),
    service: z.string().min(1, { message: 'Selecciona un servicio' }),
    time: z.string().min(1, { message: 'Selecciona un horario' }),
    notes: z.string().optional(),
  })

  type FormValues = z.infer<typeof FormSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({
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

  async function onSubmit(values: FormValues) {
    if (!selectedDate) return alert('Selecciona una fecha')
    
    // Validar que el horario siga disponible antes de enviar
    const selectedSlot = slotsForDay.find(slot => slot.time === values.time)
    if (!selectedSlot || !selectedSlot.available) {
      alert('El horario seleccionado ya no está disponible. Por favor, selecciona otro.')
      // Recargar horarios disponibles
      const loadSlots = async () => {
        try {
          const dateString = selectedDate.toISOString().split('T')[0]
          const slots = await getAvailableTimeSlots(dateString)
          setDynamicSlots(slots)
        } catch (error) {
          console.error('Error reloading time slots:', error)
        }
      }
      loadSlots()
      return
    }

    try {
      const payload = {
        name: values.name,
        phone: values.phone,
        service_id: parseInt(values.service),
        date: selectedDate.toISOString().split('T')[0],
        time: values.time,
        notes: values.notes || '',
      }

      const res = await fetch('/api/reservas', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        if (json.error === 'conflict') {
          alert('El horario ya fue tomado por otro cliente. Por favor, selecciona otro horario.')
          // Recargar horarios después del conflicto
          const loadSlots = async () => {
            try {
              const dateString = selectedDate.toISOString().split('T')[0]
              const slots = await getAvailableTimeSlots(dateString)
              setDynamicSlots(slots)
            } catch (error) {
              console.error('Error reloading time slots:', error)
            }
          }
          loadSlots()
        } else {
          alert('Error al crear reserva: ' + (json.message || json.error))
        }
        return
      }
      
      alert('Reserva creada correctamente')
      // Resetear el formulario después de éxito
      setSelectedTime("")
      setValue("time", "")
      setValue("name", "")
      setValue("phone", "")
      setValue("notes", "")
      
      // Recargar horarios para reflejar la nueva reserva
      const loadSlots = async () => {
        try {
          const dateString = selectedDate.toISOString().split('T')[0]
          const slots = await getAvailableTimeSlots(dateString)
          setDynamicSlots(slots)
        } catch (error) {
          console.error('Error reloading time slots:', error)
        }
      }
      loadSlots()
    } catch (err: any) {
      console.error(err)
      alert('Error del servidor')
    }
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Reserva tu Cita</h2>
            <p className="text-xl text-muted-foreground">
              Selecciona tu horario preferido y déjanos cuidar tu estilo.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 animate-slide-up">
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
                  Información de Contacto
                </CardTitle>
                <CardDescription>Completa tus datos para confirmar la cita</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      Horario Seleccionado *
                    </label>
                    <Input 
                      value={selectedTime || "Selecciona un horario en el panel izquierdo"} 
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
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-bg text-white hover:opacity-90 shadow-lg font-bold text-lg py-3 rounded-xl hover-lift"
                    disabled={isSubmitting || !selectedTime}
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Reserva"}
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingSection