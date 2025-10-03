# Configuración de Envío de Emails

## Pasos para configurar el envío de correos electrónicos

### 1. Servicios de Email Recomendados

#### Opción 1: SendGrid (Recomendado)
1. Ve a [sendgrid.com](https://sendgrid.com)
2. Crea una cuenta gratuita (100 emails/día)
3. Obtén tu API Key
4. Configura el dominio de envío

#### Opción 2: Nodemailer con Gmail
1. Configura una cuenta de Gmail
2. Habilita la autenticación de 2 factores
3. Genera una contraseña de aplicación

#### Opción 3: Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Obtén tu API Key

### 2. Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# Email del administrador (OBLIGATORIO - cambia por tu email)
NEXT_PUBLIC_ADMIN_EMAIL=tu-email@ejemplo.com
NEXT_PUBLIC_ADMIN_NAME=Tu Nombre

# Para SendGrid
NEXT_PUBLIC_EMAIL_API_URL=https://api.sendgrid.com/v3/mail/send
NEXT_PUBLIC_EMAIL_API_KEY=YOUR_SENDGRID_API_KEY

# Para Resend
NEXT_PUBLIC_EMAIL_API_URL=https://api.resend.com/emails
NEXT_PUBLIC_EMAIL_API_KEY=YOUR_RESEND_API_KEY

# Para Nodemailer (usar API route)
NEXT_PUBLIC_EMAIL_API_URL=/api/send-email
NEXT_PUBLIC_EMAIL_API_KEY=YOUR_EMAIL_PASSWORD
```

**⚠️ IMPORTANTE:** Cambia `tu-email@ejemplo.com` por tu email real para recibir las notificaciones.

### 3. Crear API Route (si usas Nodemailer)
Crea `pages/api/send-email.ts` o `app/api/send-email/route.ts`:

```typescript
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  const { to, subject, html, text } = await request.json()
  
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
    text
  })
  
  return Response.json({ success: true })
}
```

### 4. Funcionamiento
- **Modo simulación**: Actualmente el sistema usa `sendEmailSimulated()` que solo muestra el email en la consola
- **Modo producción**: Para activar el envío real, cambia `sendEmailSimulated` por `sendEmail` en `components/add-appointment-modal.tsx`

### 5. Validación de emails
El sistema valida automáticamente:
- ✅ **Formato válido**: usuario@dominio.com
- ✅ **Verificación de existencia**: Simula verificación de dominios comunes
- ✅ **Longitud**: Máximo 254 caracteres
- ✅ **Parte local**: Máximo 64 caracteres

### 6. Emails del sistema

#### Email al Cliente (Confirmación)
- **Asunto**: "🎉 Cita confirmada en la barbería - [Nombre Cliente]"
- **Contenido HTML**: Diseño profesional con todos los detalles
- **Contenido texto**: Versión simple para clientes de email básicos
- **Datos incluidos**:
  - Fecha y hora formateadas
  - Cliente y contacto
  - Servicios
  - Precio total
  - Duración
  - Barbero asignado
  - Estado
  - ID de cita

#### Email al Administrador (Notificación)
- **Asunto**: "📅 Nueva cita programada - [Nombre Cliente] - [Fecha]"
- **Contenido HTML**: Diseño profesional con alerta de acción requerida
- **Contenido texto**: Versión simple con todos los detalles
- **Datos incluidos**:
  - Todos los datos de la cita
  - Información de contacto del cliente
  - Próximos pasos recomendados
  - Alerta de acción requerida

### 7. Ejemplo de email HTML
```html
🎉 ¡Cita Confirmada!

¡Hola Juan Pérez!

Tu cita ha sido confirmada en nuestra barbería. Te esperamos en la fecha y hora programada.

📅 Fecha: lunes, 16 de diciembre de 2024
🕐 Hora: 14:30
👤 Cliente: Juan Pérez
📞 Teléfono: +50588881234
✂️ Servicios: Corte de cabello
👨‍💼 Barbero: Carlos López
⏱️ Duración: 30 minutos
📋 Estado: Pendiente
🆔 ID de Cita: 123
💰 Total: $15

¡Gracias por elegirnos! Te esperamos en la barbería.
```

## Notas importantes
- **Email al cliente**: Se envía solo para clientes nuevos con emails válidos y verificados
- **Email al administrador**: Se envía SIEMPRE que esté configurado el `NEXT_PUBLIC_ADMIN_EMAIL`
- Si falla el envío de email, la cita se crea igual (no bloquea el proceso)
- El sistema es compatible con la estructura actual de la base de datos
- La verificación de email es simulada para desarrollo (en producción usar servicios como ZeroBounce)
- **Configuración obligatoria**: Debes cambiar `tu-email@ejemplo.com` por tu email real en `.env.local`
