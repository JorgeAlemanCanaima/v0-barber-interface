"use client"

import { useBarbers, useServices, useAppointments } from "@/lib/hooks/useSupabase"

export default function DataTest() {
  const { barbers, loading: barbersLoading, error: barbersError } = useBarbers()
  const { services, loading: servicesLoading, error: servicesError } = useServices()
  const { appointments, loading: appointmentsLoading, error: appointmentsError } = useAppointments()

  if (barbersLoading || servicesLoading || appointmentsLoading) {
    return <div className="p-4">Cargando datos...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Datos de la Base de Datos</h2>
      
      {/* Barberos */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Barberos ({barbers.length})</h3>
        {barbersError ? (
          <p className="text-red-500">Error: {barbersError}</p>
        ) : (
          <div className="space-y-2">
            {barbers.map(barber => (
              <div key={barber.id} className="p-2 bg-gray-100 rounded">
                <p><strong>Nombre:</strong> {barber.full_name}</p>
                <p><strong>Email:</strong> {barber.email}</p>
                <p><strong>Teléfono:</strong> {barber.phone || 'No especificado'}</p>
                <p><strong>Rol:</strong> {barber.role?.name || 'No especificado'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Servicios */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Servicios ({services.length})</h3>
        {servicesError ? (
          <p className="text-red-500">Error: {servicesError}</p>
        ) : (
          <div className="space-y-2">
            {services.map(service => (
              <div key={service.id} className="p-2 bg-gray-100 rounded">
                <p><strong>Nombre:</strong> {service.name}</p>
                <p><strong>Precio:</strong> ${service.price}</p>
                <p><strong>Duración:</strong> {service.duration_min} min</p>
                <p><strong>Activo:</strong> {service.is_active ? 'Sí' : 'No'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citas */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Citas ({appointments.length})</h3>
        {appointmentsError ? (
          <p className="text-red-500">Error: {appointmentsError}</p>
        ) : (
          <div className="space-y-2">
            {appointments.slice(0, 5).map(appointment => (
              <div key={appointment.id} className="p-2 bg-gray-100 rounded">
                <p><strong>Cliente:</strong> {appointment.client?.name || 'No especificado'}</p>
                <p><strong>Servicio:</strong> {appointment.service?.name || 'No especificado'}</p>
                <p><strong>Fecha:</strong> {new Date(appointment.fecha_hora).toLocaleString()}</p>
                <p><strong>Estado:</strong> {appointment.estado}</p>
                <p><strong>Barbero:</strong> {appointment.barber?.full_name || 'No asignado'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
