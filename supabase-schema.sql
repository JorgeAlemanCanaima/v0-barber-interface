-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Insertar roles básicos
INSERT INTO role (id, name, description) VALUES 
(1, 'barbero', 'Barbero que atiende clientes'),
(2, 'admin', 'Administrador del sistema')
ON CONFLICT (id) DO NOTHING;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES role(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS client (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de servicios
CREATE TABLE IF NOT EXISTS service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_min INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de citas
CREATE TABLE IF NOT EXISTS cita (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES client(id),
    service_id INTEGER REFERENCES service(id),
    barber_user_id INTEGER REFERENCES "user"(id),
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar algunos servicios de ejemplo
INSERT INTO service (name, description, price, duration_min) VALUES 
('Fade Clásico', 'Corte moderno con degradado perfecto', 25.00, 30),
('Corte + Barba', 'Corte completo con arreglo de barba', 35.00, 45),
('Buzz Cut', 'Corte corto y uniforme', 20.00, 20),
('Pompadour', 'Estilo clásico con volumen', 30.00, 40),
('Fade + Barba', 'Fade moderno con arreglo de barba', 40.00, 50)
ON CONFLICT DO NOTHING;

-- Insertar un barbero de ejemplo
INSERT INTO "user" (role_id, email, password_hash, full_name, phone) VALUES 
(1, 'barbero@barberia.com', 'hashed_password', 'Carlos Mendoza', '+1234567890')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE service ENABLE ROW LEVEL SECURITY;
ALTER TABLE cita ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (permite todo por ahora)
CREATE POLICY "Enable all operations for all users" ON "user" FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON client FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON service FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON cita FOR ALL USING (true);
