# Configuración de Supabase para la Barbería

## Pasos para configurar Supabase

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Elige tu organización
5. Completa los datos del proyecto:
   - **Name**: `v0-barber-interface`
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige la más cercana a ti

### 2. Obtener las credenciales

Una vez creado el proyecto:

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 4. Configurar la base de datos

1. Ve a **SQL Editor** en tu dashboard de Supabase
2. Copia y pega el contenido del archivo `supabase/schema.sql`
3. Ejecuta la consulta para crear las tablas y datos de ejemplo

### 5. Configurar políticas de seguridad (RLS)

En **Authentication** > **Policies**, configura las siguientes políticas:

#### Para la tabla `barbers`:
```sql
-- Permitir lectura pública
CREATE POLICY "Barbers are viewable by everyone" ON barbers FOR SELECT USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Barbers are insertable by authenticated users" ON barbers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### Para la tabla `services`:
```sql
-- Permitir lectura pública
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Services are insertable by authenticated users" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### Para la tabla `appointments`:
```sql
-- Permitir lectura pública
CREATE POLICY "Appointments are viewable by everyone" ON appointments FOR SELECT USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Appointments are insertable by authenticated users" ON appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

#### Para la tabla `clients`:
```sql
-- Permitir lectura pública
CREATE POLICY "Clients are viewable by everyone" ON clients FOR SELECT USING (true);

-- Permitir inserción solo a usuarios autenticados
CREATE POLICY "Clients are insertable by authenticated users" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 6. Verificar la configuración

1. Ejecuta el proyecto: `pnpm dev`
2. Abre la aplicación en el navegador
3. Verifica que los datos se cargan correctamente desde Supabase

## Estructura de la base de datos

### Tablas principales:

- **barbers**: Información de los barberos
- **services**: Catálogo de servicios
- **clients**: Base de datos de clientes
- **appointments**: Sistema de citas

### Relaciones:

- `appointments.barber_id` → `barbers.id`
- `appointments.service_id` → `services.id`

## Funcionalidades implementadas

✅ **Dashboard con datos en tiempo real**
✅ **Gestión de barberos**
✅ **Catálogo de servicios**
✅ **Sistema de citas**
✅ **Estadísticas automáticas**
✅ **Hooks personalizados para Supabase**

## Próximos pasos

1. Implementar autenticación de usuarios
2. Agregar formularios para crear/editar datos
3. Implementar notificaciones en tiempo real
4. Agregar sistema de pagos
5. Implementar reportes avanzados
