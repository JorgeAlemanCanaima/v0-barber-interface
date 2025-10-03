// Funciones para envío de correos electrónicos

/**
 * Genera el mensaje de confirmación de cita para email
 */
export function generateAppointmentEmailMessage(appointment: any): { subject: string; html: string; text: string } {
  const appointmentDate = new Date(appointment.fecha_hora)
  
  // Formatear fecha y hora
  const dateStr = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const timeStr = appointmentDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Obtener servicios (compatible con estructura antigua y nueva)
  let servicesText = ''
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    // Nueva estructura (múltiples servicios)
    servicesText = appointment.cita_services
      .map((cs: any) => cs.service?.name || 'Servicio')
      .join(', ')
  } else if (appointment.service) {
    // Estructura antigua (un servicio)
    servicesText = appointment.service.name
  } else {
    servicesText = 'Servicio no especificado'
  }

  // Obtener barbero
  const barberName = appointment.barber?.full_name || 'Sin barbero asignado'

  // Obtener estado
  const statusMap: Record<string, string> = {
    'PENDIENTE': 'Pendiente',
    'CONFIRMADA': 'Confirmada',
    'CANCELADA': 'Cancelada',
    'ATENDIDA': 'Atendida'
  }
  const statusText = statusMap[appointment.estado] || appointment.estado

  // Calcular precio total
  let totalPrice = 0
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    totalPrice = appointment.cita_services.reduce((total: number, cs: any) => 
      total + (cs.service?.price || 0), 0)
  } else if (appointment.service) {
    totalPrice = appointment.service.price || 0
  }

  // Calcular duración total
  let totalDuration = 0
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    totalDuration = appointment.cita_services.reduce((total: number, cs: any) => 
      total + (cs.service?.duration_min || 0), 0)
  } else if (appointment.service) {
    totalDuration = appointment.service.duration_min || 0
  }

  const subject = `🎉 Cita confirmada en la barbería - ${appointment.client?.name || 'Cliente'}`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cita Confirmada</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e0e0e0;
            }
            .header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #7f8c8d;
                margin: 10px 0 0 0;
                font-size: 16px;
            }
            .appointment-details {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 18px;
                color: #2c3e50;
            }
            .detail-label {
                color: #6c757d;
                font-weight: 500;
            }
            .detail-value {
                color: #2c3e50;
                font-weight: 600;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                color: #7f8c8d;
            }
            .highlight {
                background-color: #e8f5e8;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #28a745;
                margin: 20px 0;
            }
            .emoji {
                font-size: 20px;
                margin-right: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ¡Cita Confirmada!</h1>
                <p>Tu cita ha sido programada exitosamente</p>
            </div>
            
            <div class="highlight">
                <p><strong>¡Hola ${appointment.client?.name || 'Cliente'}!</strong></p>
                <p>Tu cita ha sido confirmada en nuestra barbería. Te esperamos en la fecha y hora programada.</p>
            </div>
            
            <div class="appointment-details">
                <div class="detail-row">
                    <span class="detail-label">📅 Fecha:</span>
                    <span class="detail-value">${dateStr}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🕐 Hora:</span>
                    <span class="detail-value">${timeStr}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">👤 Cliente:</span>
                    <span class="detail-value">${appointment.client?.name || 'Cliente'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📞 Teléfono:</span>
                    <span class="detail-value">${appointment.client?.phone || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">✂️ Servicios:</span>
                    <span class="detail-value">${servicesText}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">👨‍💼 Barbero:</span>
                    <span class="detail-value">${barberName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">⏱️ Duración:</span>
                    <span class="detail-value">${totalDuration} minutos</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📋 Estado:</span>
                    <span class="detail-value">${statusText}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🆔 ID de Cita:</span>
                    <span class="detail-value">${appointment.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">💰 Total:</span>
                    <span class="detail-value">$${totalPrice}</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>¡Gracias por elegirnos!</strong></p>
                <p>Si necesitas hacer algún cambio o tienes preguntas, no dudes en contactarnos.</p>
                <p>Te esperamos en la barbería. 😊</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
🎉 CITA CONFIRMADA EN LA BARBERÍA

¡Hola ${appointment.client?.name || 'Cliente'}!

Tu cita ha sido confirmada exitosamente. Aquí están los detalles:

📅 Fecha: ${dateStr}
🕐 Hora: ${timeStr}
👤 Cliente: ${appointment.client?.name || 'Cliente'}
📞 Teléfono: ${appointment.client?.phone || 'No especificado'}
✂️ Servicios: ${servicesText}
👨‍💼 Barbero: ${barberName}
⏱️ Duración: ${totalDuration} minutos
📋 Estado: ${statusText}
🆔 ID de Cita: ${appointment.id}
💰 Total: $${totalPrice}

¡Gracias por elegirnos! Te esperamos en la barbería.

Si necesitas hacer algún cambio o tienes preguntas, no dudes en contactarnos.
  `

  return { subject, html, text }
}

/**
 * Genera el mensaje de notificación de nueva cita para el administrador
 */
export function generateAdminNotificationEmail(appointment: any): { subject: string; html: string; text: string } {
  const appointmentDate = new Date(appointment.fecha_hora)
  
  // Formatear fecha y hora
  const dateStr = appointmentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const timeStr = appointmentDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Obtener servicios (compatible con estructura antigua y nueva)
  let servicesText = ''
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    // Nueva estructura (múltiples servicios)
    servicesText = appointment.cita_services
      .map((cs: any) => cs.service?.name || 'Servicio')
      .join(', ')
  } else if (appointment.service) {
    // Estructura antigua (un servicio)
    servicesText = appointment.service.name
  } else {
    servicesText = 'Servicio no especificado'
  }

  // Obtener barbero
  const barberName = appointment.barber?.full_name || 'Sin barbero asignado'

  // Obtener estado
  const statusMap: Record<string, string> = {
    'PENDIENTE': 'Pendiente',
    'CONFIRMADA': 'Confirmada',
    'CANCELADA': 'Cancelada',
    'ATENDIDA': 'Atendida'
  }
  const statusText = statusMap[appointment.estado] || appointment.estado

  // Calcular precio total
  let totalPrice = 0
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    totalPrice = appointment.cita_services.reduce((total: number, cs: any) => 
      total + (cs.service?.price || 0), 0)
  } else if (appointment.service) {
    totalPrice = appointment.service.price || 0
  }

  // Calcular duración total
  let totalDuration = 0
  if (appointment.cita_services && appointment.cita_services.length > 0) {
    totalDuration = appointment.cita_services.reduce((total: number, cs: any) => 
      total + (cs.service?.duration_min || 0), 0)
  } else if (appointment.service) {
    totalDuration = appointment.service.duration_min || 0
  }

  const subject = `📅 Nueva cita programada - ${appointment.client?.name || 'Cliente'} - ${dateStr}`

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Cita - Notificación</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e0e0e0;
            }
            .header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #7f8c8d;
                margin: 10px 0 0 0;
                font-size: 16px;
            }
            .appointment-details {
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .detail-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 18px;
                color: #2c3e50;
            }
            .detail-label {
                color: #6c757d;
                font-weight: 500;
            }
            .detail-value {
                color: #2c3e50;
                font-weight: 600;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e0e0e0;
                color: #7f8c8d;
            }
            .highlight {
                background-color: #e3f2fd;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #2196f3;
                margin: 20px 0;
            }
            .emoji {
                font-size: 20px;
                margin-right: 8px;
            }
            .urgent {
                background-color: #fff3cd;
                border-left-color: #ffc107;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📅 Nueva Cita Programada</h1>
                <p>Se ha creado una nueva cita en el sistema</p>
            </div>
            
            <div class="highlight urgent">
                <p><strong>⚠️ Acción Requerida</strong></p>
                <p>Una nueva cita ha sido programada y requiere tu atención. Revisa los detalles a continuación.</p>
            </div>
            
            <div class="appointment-details">
                <div class="detail-row">
                    <span class="detail-label">📅 Fecha:</span>
                    <span class="detail-value">${dateStr}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🕐 Hora:</span>
                    <span class="detail-value">${timeStr}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">👤 Cliente:</span>
                    <span class="detail-value">${appointment.client?.name || 'Cliente'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📞 Teléfono:</span>
                    <span class="detail-value">${appointment.client?.phone || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📧 Email:</span>
                    <span class="detail-value">${appointment.client?.email || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">✂️ Servicios:</span>
                    <span class="detail-value">${servicesText}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">👨‍💼 Barbero Asignado:</span>
                    <span class="detail-value">${barberName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">⏱️ Duración:</span>
                    <span class="detail-value">${totalDuration} minutos</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📋 Estado:</span>
                    <span class="detail-value">${statusText}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🆔 ID de Cita:</span>
                    <span class="detail-value">${appointment.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">💰 Total:</span>
                    <span class="detail-value">$${totalPrice}</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>📋 Próximos Pasos:</strong></p>
                <p>• Revisar la disponibilidad del barbero asignado</p>
                <p>• Confirmar la cita con el cliente si es necesario</p>
                <p>• Preparar los servicios requeridos</p>
                <p>• Actualizar el estado de la cita según corresponda</p>
            </div>
        </div>
    </body>
    </html>
  `

  const text = `
📅 NUEVA CITA PROGRAMADA

Se ha creado una nueva cita en el sistema que requiere tu atención.

⚠️ ACCIÓN REQUERIDA
Una nueva cita ha sido programada. Revisa los detalles a continuación.

📅 Fecha: ${dateStr}
🕐 Hora: ${timeStr}
👤 Cliente: ${appointment.client?.name || 'Cliente'}
📞 Teléfono: ${appointment.client?.phone || 'No especificado'}
📧 Email: ${appointment.client?.email || 'No especificado'}
✂️ Servicios: ${servicesText}
👨‍💼 Barbero Asignado: ${barberName}
⏱️ Duración: ${totalDuration} minutos
📋 Estado: ${statusText}
🆔 ID de Cita: ${appointment.id}
💰 Total: $${totalPrice}

📋 PRÓXIMOS PASOS:
• Revisar la disponibilidad del barbero asignado
• Confirmar la cita con el cliente si es necesario
• Preparar los servicios requeridos
• Actualizar el estado de la cita según corresponda
  `

  return { subject, html, text }
}

/**
 * Envía un correo electrónico usando una API de email
 * Nota: Esta función requiere configurar un servicio de email como SendGrid, Nodemailer, etc.
 */
export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<{ success: boolean; error?: string }> {
  try {
    // URL de la API de email (esto debe configurarse con tu servicio de email)
    const emailApiUrl = process.env.NEXT_PUBLIC_EMAIL_API_URL || '/api/send-email'
    const apiKey = process.env.NEXT_PUBLIC_EMAIL_API_KEY || 'YOUR_API_KEY'
    
    const response = await fetch(emailApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error al enviar email:', errorData)
      return {
        success: false,
        error: `Error al enviar email: ${errorData.error?.message || 'Error desconocido'}`
      }
    }

    const result = await response.json()
    console.log('Email enviado exitosamente:', result)
    
    return { success: true }
    
  } catch (error) {
    console.error('Error al enviar email:', error)
    return {
      success: false,
      error: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}

/**
 * Función simulada para desarrollo (cuando no hay API de email configurada)
 */
export async function sendEmailSimulated(to: string, subject: string, html: string, text: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 SIMULACIÓN - Enviando Email:')
    console.log(`📮 Para: ${to}`)
    console.log(`📋 Asunto: ${subject}`)
    console.log(`📄 Contenido HTML:`, html.substring(0, 200) + '...')
    console.log(`📄 Contenido Texto:`, text.substring(0, 200) + '...')
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return { success: true }
    
  } catch (error) {
    console.error('Error en simulación de email:', error)
    return {
      success: false,
      error: `Error de simulación: ${error instanceof Error ? error.message : 'Error desconocido'}`
    }
  }
}
