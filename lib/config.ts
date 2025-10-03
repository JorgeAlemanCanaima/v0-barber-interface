// Configuración del sistema

/**
 * Email del administrador/barbero para recibir notificaciones
 * Cambia este email por el tuyo para recibir las notificaciones
 */
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tu-email@ejemplo.com'

/**
 * Nombre del administrador/barbero
 */
export const ADMIN_NAME = process.env.NEXT_PUBLIC_ADMIN_NAME || 'Administrador'

/**
 * Configuración de la barbería
 */
export const BARBERSHOP_CONFIG = {
  name: 'Barbería',
  address: 'Dirección de la barbería',
  phone: '+505 8888 1234',
  email: ADMIN_EMAIL,
  website: 'https://tu-barberia.com'
}

/**
 * Verifica si el email del administrador está configurado
 */
export function isAdminEmailConfigured(): boolean {
  return ADMIN_EMAIL !== 'tu-email@ejemplo.com' && ADMIN_EMAIL.includes('@')
}
