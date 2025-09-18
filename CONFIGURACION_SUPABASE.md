# Configuración de Variables de Entorno para Supabase

## Pasos para configurar tu proyecto

### 1. Crear archivo .env.local

Crea un archivo llamado `.env.local` en la raíz de tu proyecto con el siguiente contenido:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 2. Obtener las credenciales de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **Settings** > **API**
3. Copia los siguientes valores:

#### Project URL
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
```

#### anon public key
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### service_role key
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configurar políticas de seguridad (RLS)

En tu dashboard de Supabase, ve a **Authentication** > **Policies** y configura las siguientes políticas:

#### Para la tabla `user`:
```sql
-- Permitir lectura pública de usuarios activos
CREATE POLICY "Users are viewable by everyone" ON "user" FOR SELECT USING (is_active = true);
```

#### Para la tabla `client`:
```sql
-- Permitir lectura pública
CREATE POLICY "Clients are viewable by everyone" ON client FOR SELECT USING (true);
```

#### Para la tabla `service`:
```sql
-- Permitir lectura pública
CREATE POLICY "Services are viewable by everyone" ON service FOR SELECT USING (true);
```

#### Para la tabla `cita`:
```sql
-- Permitir lectura pública
CREATE POLICY "Citas are viewable by everyone" ON cita FOR SELECT USING (true);
```

### 4. Verificar la conexión

Una vez configuradas las variables de entorno:

1. Ejecuta: `pnpm dev`
2. Abre tu aplicación en el navegador
3. Verifica que los datos se cargan correctamente

### 5. Estructura de tu base de datos

Tu esquema PostgreSQL incluye:

- **role**: Roles del sistema (admin, cajero, barbero, cliente)
- **user**: Usuarios del sistema
- **client**: Clientes de la barbería
- **service**: Servicios ofrecidos
- **cita**: Citas programadas
- **cash_register**: Registro de caja
- **mov_cash**: Movimientos de caja
- **audit_log**: Log de auditoría

### 6. Funcionalidades implementadas

✅ **Dashboard con datos en tiempo real**
✅ **Gestión de barberos (usuarios con rol 'barbero')**
✅ **Catálogo de servicios**
✅ **Sistema de citas**
✅ **Estadísticas automáticas**
✅ **Hooks personalizados para Supabase**

## Comandos para ejecutar

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Compilar para producción
pnpm build
```

## Notas importantes

- Asegúrate de que tu base de datos PostgreSQL esté ejecutándose en Supabase
- Las políticas RLS son importantes para la seguridad
- El esquema usa el schema `barbery` por defecto
- Los tipos de datos están optimizados para PostgreSQL
