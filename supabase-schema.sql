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
    barber_user_id INTEGER REFERENCES "user"(id),
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'ATENDIDA')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de relación entre citas y servicios (muchos a muchos)
CREATE TABLE IF NOT EXISTS cita_service (
    id SERIAL PRIMARY KEY,
    cita_id INTEGER REFERENCES cita(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES service(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cita_id, service_id)
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('appointment', 'inventory', 'review', 'payment', 'birthday', 'system', 'reminder')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    related_id INTEGER, -- ID relacionado (cita, servicio, etc.)
    related_type VARCHAR(50), -- Tipo de relación (cita, service, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
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

-- Insertar algunas notificaciones de ejemplo
INSERT INTO notification (user_id, type, title, message, is_urgent, related_type, related_id) VALUES 
(1, 'appointment', 'Cita en 30 minutos', 'Luis García - Fade Clásico a las 16:00', true, 'cita', 1),
(1, 'inventory', 'Stock bajo', 'Cera para Cabello - Solo quedan 3 unidades', true, 'service', 2),
(1, 'review', 'Nueva reseña', 'Carlos Mendoza dejó una reseña de 5 estrellas', false, 'cita', 2),
(1, 'payment', 'Pago recibido', 'Pago de $35 - Miguel Torres', false, 'cita', 3),
(1, 'birthday', 'Cumpleaños cliente', 'Juan Pérez cumple años mañana', false, 'client', 1),
(1, 'reminder', 'Recordatorio de cita', 'Recordar confirmar cita de mañana con Pedro Martín', false, 'cita', 4)
ON CONFLICT DO NOTHING;

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE client ENABLE ROW LEVEL SECURITY;
ALTER TABLE service ENABLE ROW LEVEL SECURITY;
ALTER TABLE cita ENABLE ROW LEVEL SECURITY;
ALTER TABLE cita_service ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (permite todo por ahora)
CREATE POLICY "Enable all operations for all users" ON "user" FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON client FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON service FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON cita FOR ALL USING (true);
-- Crear tabla de caja registradora
CREATE TABLE IF NOT EXISTS cash_register (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    opening_cash DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    sales_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    expenses_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    closing_cash DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_open BOOLEAN DEFAULT true,
    opened_by INTEGER REFERENCES "user"(id),
    closed_by INTEGER REFERENCES "user"(id),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de movimientos de caja
CREATE TABLE IF NOT EXISTS cash_movement (
    id SERIAL PRIMARY KEY,
    cash_register_id INTEGER REFERENCES cash_register(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('SALE', 'EXPENSE', 'OPENING', 'CLOSING', 'ADJUSTMENT')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_id INTEGER, -- ID de la cita, gasto, etc.
    reference_type VARCHAR(50), -- 'appointment', 'expense', etc.
    created_by INTEGER REFERENCES "user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de gastos
CREATE TABLE IF NOT EXISTS expense (
    id SERIAL PRIMARY KEY,
    cash_register_id INTEGER REFERENCES cash_register(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    receipt_number VARCHAR(100),
    created_by INTEGER REFERENCES "user"(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE cash_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movement ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS
CREATE POLICY "Enable all operations for all users" ON cash_register FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON cash_movement FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON expense FOR ALL USING (true);

CREATE POLICY "Enable all operations for all users" ON cita_service FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON notification FOR ALL USING (true);
