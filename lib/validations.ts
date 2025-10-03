// Validaciones para el sistema de barbería

/**
 * Valida si un número de teléfono es válido para Nicaragua
 * Formatos aceptados:
 * - +505XXXXXXXX (formato internacional)
 * - 505XXXXXXXX (formato internacional sin +)
 * - XXXXXXXXX (formato nacional)
 * 
 * Los números de Nicaragua tienen 8 dígitos después del código de país 505
 */
export function validateNicaraguaPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  if (!phone) {
    return { isValid: false, formatted: '', error: 'El número de teléfono es requerido' }
  }

  // Limpiar el número (remover espacios, guiones, paréntesis)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // Patrones de validación para Nicaragua
  const patterns = [
    /^\+505[2-9]\d{7}$/, // +505XXXXXXXX (formato internacional completo)
    /^505[2-9]\d{7}$/,   // 505XXXXXXXX (formato internacional sin +)
    /^[2-9]\d{7}$/       // XXXXXXXXX (formato nacional)
  ]

  // Verificar si coincide con algún patrón
  const isValid = patterns.some(pattern => pattern.test(cleanPhone))
  
  if (!isValid) {
    return {
      isValid: false,
      formatted: '',
      error: 'Número de teléfono inválido. Debe ser un número de Nicaragua válido (8 dígitos, empezando con 2-9)'
    }
  }

  // Formatear al formato internacional estándar
  let formatted = cleanPhone
  
  if (cleanPhone.startsWith('+505')) {
    formatted = cleanPhone
  } else if (cleanPhone.startsWith('505')) {
    formatted = '+' + cleanPhone
  } else {
    formatted = '+505' + cleanPhone
  }

  return {
    isValid: true,
    formatted,
    error: undefined
  }
}

/**
 * Valida y formatea un número de teléfono para WhatsApp
 * WhatsApp requiere el formato internacional sin el símbolo +
 */
export function formatForWhatsApp(phone: string): string {
  const validation = validateNicaraguaPhone(phone)
  
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  // WhatsApp usa el formato internacional sin el +
  return validation.formatted.substring(1) // Remover el +
}

/**
 * Ejemplos de números válidos de Nicaragua:
 * - +505 8888 1234
 * - 50588881234
 * - 88881234
 * - +505-8888-1234
 * - (505) 8888-1234
 */

/**
 * Valida si un email es válido
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'El email es requerido' }
  }

  // Patrón de validación de email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!emailPattern.test(email)) {
    return {
      isValid: false,
      error: 'Formato de email inválido. Ejemplo: usuario@ejemplo.com'
    }
  }

  // Validaciones adicionales
  if (email.length > 254) {
    return {
      isValid: false,
      error: 'El email es demasiado largo (máximo 254 caracteres)'
    }
  }

  const localPart = email.split('@')[0]
  if (localPart.length > 64) {
    return {
      isValid: false,
      error: 'La parte local del email es demasiado larga (máximo 64 caracteres)'
    }
  }

  return { isValid: true }
}

/**
 * Verifica si un email existe usando una API de validación
 * Nota: Esta es una implementación básica. Para producción, usar un servicio como ZeroBounce, Hunter, etc.
 */
export async function verifyEmailExists(email: string): Promise<{ exists: boolean; error?: string }> {
  try {
    // Para desarrollo, simulamos la verificación
    // En producción, aquí iría la llamada a una API de verificación de emails
    
    // Simular delay de verificación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular verificación básica por dominio
    const domain = email.split('@')[1]?.toLowerCase()
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'live.com', 'icloud.com', 'aol.com', 'protonmail.com',
      'yandex.com', 'mail.com', 'zoho.com', 'fastmail.com'
    ]
    
    if (domain && commonDomains.includes(domain)) {
      return { exists: true }
    }
    
    // Para dominios no comunes, asumimos que existe (en producción se verificaría)
    return { exists: true }
    
  } catch (error) {
    console.error('Error al verificar email:', error)
    return {
      exists: false,
      error: 'Error al verificar el email. Inténtalo de nuevo.'
    }
  }
}
