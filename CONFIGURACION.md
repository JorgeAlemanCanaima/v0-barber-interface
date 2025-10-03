# 🚀 Configuración Rápida del Sistema

## ⚡ Configuración Inmediata (5 minutos)

### 1. Crear archivo de configuración
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# ===========================================
# CONFIGURACIÓN OBLIGATORIA DEL ADMINISTRADOR
# ===========================================
# ⚠️ CAMBIA ESTOS VALORES POR LOS TUYOS REALES

# Email del administrador (OBLIGATORIO)
NEXT_PUBLIC_ADMIN_EMAIL=tu-email@ejemplo.com

# Nombre del administrador
NEXT_PUBLIC_ADMIN_NAME=Tu Nombre

# ===========================================
# CONFIGURACIÓN DE SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Cambiar tu email
**⚠️ IMPORTANTE:** Cambia `tu-email@ejemplo.com` por tu email real.

Ejemplo:
```env
NEXT_PUBLIC_ADMIN_EMAIL=mi-email@gmail.com
NEXT_PUBLIC_ADMIN_NAME=Juan Pérez
```

### 3. Reiniciar el servidor
```bash
npm run dev
```

## ✅ ¡Listo! 

Ahora cuando crees una cita:
- ✅ **Al cliente**: Se le enviará un email de confirmación (si tiene email válido)
- ✅ **A ti**: Te llegará un email de notificación con todos los detalles de la cita

## 📧 Ejemplo de lo que recibirás

**Asunto:** 📅 Nueva cita programada - Juan Pérez - lunes, 16 de diciembre de 2024

**Contenido:**
```
📅 NUEVA CITA PROGRAMADA

⚠️ ACCIÓN REQUERIDA
Una nueva cita ha sido programada. Revisa los detalles a continuación.

📅 Fecha: lunes, 16 de diciembre de 2024
🕐 Hora: 14:30
👤 Cliente: Juan Pérez
📞 Teléfono: +50588881234
📧 Email: juan@ejemplo.com
✂️ Servicios: Corte de cabello
👨‍💼 Barbero Asignado: Carlos López
⏱️ Duración: 30 minutos
📋 Estado: Pendiente
🆔 ID de Cita: 123
💰 Total: $15

📋 PRÓXIMOS PASOS:
• Revisar la disponibilidad del barbero asignado
• Confirmar la cita con el cliente si es necesario
• Preparar los servicios requeridos
• Actualizar el estado de la cita según corresponda
```

## 🔧 Configuración Avanzada (Opcional)

Si quieres que los emails se envíen realmente (no solo simulación), consulta `EMAIL_SETUP.md` para configurar servicios como SendGrid, Resend, o Nodemailer.

## 🆘 Solución de Problemas

### No recibo emails
1. ✅ Verifica que cambiaste `tu-email@ejemplo.com` por tu email real
2. ✅ Reinicia el servidor después de cambiar `.env.local`
3. ✅ Revisa la consola del navegador para ver mensajes de error

### Error de configuración
- Asegúrate de que el archivo se llama exactamente `.env.local`
- No debe tener espacios extra en las variables
- Reinicia el servidor después de cualquier cambio

## 📞 Soporte

Si tienes problemas, revisa:
- `EMAIL_SETUP.md` - Configuración completa de emails
- Consola del navegador - Mensajes de error
- Logs del servidor - Información de depuración
