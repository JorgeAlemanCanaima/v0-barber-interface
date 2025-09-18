import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos PostgreSQL de la barbería
export interface Role {
  id: number
  name: string
  description?: string
}

export interface User {
  id: number
  role_id: number
  email: string
  password_hash: string
  full_name: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
  role?: Role
}

export interface Client {
  id: number
  user_id?: number
  name: string
  email?: string
  phone?: string
  notes?: string
  created_at: string
  user?: User
}

export interface Service {
  id: number
  name: string
  price: number
  duration_min: number
  is_active: boolean
  created_at: string
}

export interface Cita {
  id: number
  client_id: number
  service_id: number
  barber_user_id?: number
  fecha_hora: string
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'ATENDIDA'
  created_at: string
  client?: Client
  service?: Service
  barber?: User
}

export interface CashRegister {
  id: number
  opened_by: number
  opened_at: string
  opening_balance: number
  status: 'OPEN' | 'CLOSED'
  closed_by?: number
  closed_at?: string
  closing_balance?: number
}

export interface MovCash {
  id: number
  cash_register_id: number
  type: 'IN' | 'OUT'
  amount: number
  concept: string
  ref_cita_id?: number
  created_by: number
  created_at: string
}
