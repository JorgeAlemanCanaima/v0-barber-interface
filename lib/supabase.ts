import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwzmxdwcrvgpogtfzbwn.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3em14ZHdjcnZncG9ndGZ6YnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTY3OTEsImV4cCI6MjA3Mzc5Mjc5MX0.JRzWTHIzvdnCRRuPRc6tkmL-6SuqNMBlPYYIIjvKJmI'

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
  description?: string
  price: number
  duration_min: number
  is_active: boolean
  created_at: string
}

export interface CitaService {
  id: number
  cita_id: number
  service_id: number
  created_at: string
  service?: Service
}

export interface Cita {
  id: number
  client_id: number
  barber_id?: number
  fecha_hora: string
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'ATENDIDA'
  notas?: string
  created_at: string
  updated_at: string
  client?: Client
  barber?: User
  cita_services?: CitaService[]
}

export interface CashRegister {
  id: number
  date: string
  opening_cash: number
  sales_total: number
  expenses_total: number
  closing_cash: number
  is_open: boolean
  opened_by?: number
  closed_by?: number
  opened_at: string
  closed_at?: string
  notes?: string
  created_at: string
  updated_at: string
  opened_by_user?: User
  closed_by_user?: User
}

export interface CashMovement {
  id: number
  cash_register_id: number
  type: 'SALE' | 'EXPENSE' | 'OPENING' | 'CLOSING' | 'ADJUSTMENT'
  amount: number
  description?: string
  reference_id?: number
  reference_type?: string
  created_by?: number
  created_at: string
  created_by_user?: User
}

export interface Expense {
  id: number
  cash_register_id: number
  amount: number
  description: string
  category?: string
  receipt_number?: string
  created_by?: number
  created_at: string
  created_by_user?: User
}

export interface Notification {
  id: number
  user_id: number
  type: 'appointment' | 'inventory' | 'review' | 'payment' | 'birthday' | 'system' | 'reminder'
  title: string
  message: string
  is_read: boolean
  is_urgent: boolean
  related_id?: number
  related_type?: string
  created_at: string
  read_at?: string
  user?: User
}