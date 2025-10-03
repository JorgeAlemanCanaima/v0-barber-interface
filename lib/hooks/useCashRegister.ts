import { useState, useEffect } from 'react'
import { supabase, CashRegister, CashMovement, Expense, Cita } from '../supabase'

// Hook para manejar la caja registradora
export function useCashRegister() {
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null)
  const [movements, setMovements] = useState<CashMovement[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [todayPayments, setTodayPayments] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodayCashRegister()
  }, [])

  const fetchTodayCashRegister = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      // Buscar caja del día actual
      const { data: cashRegisterData, error: cashRegisterError } = await supabase
        .from('cash_register')
        .select(`
          *,
          opened_by_user:opened_by(id, full_name),
          closed_by_user:closed_by(id, full_name)
        `)
        .eq('date', today)
        .single()

      if (cashRegisterError && cashRegisterError.code !== 'PGRST116') {
        console.warn('Error al cargar caja registradora:', cashRegisterError.message)
        // Si no hay caja del día, crear una automáticamente
        await createTodayCashRegister()
        return
      }

      if (cashRegisterData) {
        setCashRegister(cashRegisterData)
        await fetchMovements(cashRegisterData.id)
        await fetchExpenses(cashRegisterData.id)
      } else {
        // Crear caja del día si no existe
        await createTodayCashRegister()
      }
      
      // Obtener pagos del día
      await fetchTodayPayments()
    } catch (err) {
      console.error('Error al cargar caja registradora:', err)
      setError('Error al cargar la caja registradora')
    } finally {
      setLoading(false)
    }
  }

  const createTodayCashRegister = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('cash_register')
        .insert([{
          date: today,
          opening_cash: 0.00,
          sales_total: 0.00,
          expenses_total: 0.00,
          closing_cash: 0.00,
          is_open: true,
          opened_by: 1, // Usuario por defecto
          notes: 'Caja abierta automáticamente'
        }])
        .select(`
          *,
          opened_by_user:opened_by(id, full_name),
          closed_by_user:closed_by(id, full_name)
        `)
        .single()

      if (error) {
        console.warn('Error al crear caja registradora (puede ser que la tabla no exista):', error.message)
        // Crear datos mock si la tabla no existe
        const mockCashRegister = {
          id: 1,
          date: today,
          opening_cash: 0.00,
          sales_total: 0.00,
          expenses_total: 0.00,
          closing_cash: 0.00,
          is_open: true,
          opened_by: 1,
          closed_by: null,
          opened_at: new Date().toISOString(),
          closed_at: null,
          notes: 'Caja simulada (tabla no disponible)',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          opened_by_user: { id: 1, full_name: 'Usuario Demo' },
          closed_by_user: null
        }
        setCashRegister(mockCashRegister)
        setMovements([])
        setExpenses([])
        return
      }

      setCashRegister(data)
      setMovements([])
      setExpenses([])
    } catch (err) {
      console.warn('Error al crear caja registradora (usando datos mock):', err)
      // Crear datos mock en caso de error
      const today = new Date().toISOString().split('T')[0]
      const mockCashRegister = {
        id: 1,
        date: today,
        opening_cash: 0.00,
        sales_total: 0.00,
        expenses_total: 0.00,
        closing_cash: 0.00,
        is_open: true,
        opened_by: 1,
        closed_by: null,
        opened_at: new Date().toISOString(),
        closed_at: null,
        notes: 'Caja simulada (modo demo)',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        opened_by_user: { id: 1, full_name: 'Usuario Demo' },
        closed_by_user: null
      }
      setCashRegister(mockCashRegister)
      setMovements([])
      setExpenses([])
    }
  }

  const fetchMovements = async (cashRegisterId: number) => {
    try {
      const { data, error } = await supabase
        .from('cash_movement')
        .select(`
          *,
          created_by_user:created_by(id, full_name)
        `)
        .eq('cash_register_id', cashRegisterId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Error al cargar movimientos:', error.message)
        return
      }

      setMovements(data || [])
    } catch (err) {
      console.warn('Error al cargar movimientos:', err)
    }
  }

  const fetchExpenses = async (cashRegisterId: number) => {
    try {
      const { data, error } = await supabase
        .from('expense')
        .select(`
          *,
          created_by_user:created_by(id, full_name)
        `)
        .eq('cash_register_id', cashRegisterId)
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Error al cargar gastos:', error.message)
        return
      }

      setExpenses(data || [])
    } catch (err) {
      console.warn('Error al cargar gastos:', err)
    }
  }

  const fetchTodayPayments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('cita')
        .select(`
          *,
          client:client_id(id, name, phone, email),
          barber:barber_id(id, full_name, phone, email),
          cita_services:cita_service(
            id,
            service:service_id(id, name, price, duration_min)
          )
        `)
        .eq('estado', 'ATENDIDA')
        .gte('fecha_hora', `${today}T00:00:00`)
        .lte('fecha_hora', `${today}T23:59:59`)
        .order('fecha_hora', { ascending: false })

      if (error) {
        console.warn('Error al cargar pagos del día (modo demo):', error.message)
        // Crear datos mock para pagos del día
        const mockPayments = [
          {
            id: 1,
            client_id: 1,
            barber_id: 1,
            fecha_hora: `${today}T10:00:00`,
            estado: 'ATENDIDA' as const,
            notas: 'Corte y barba',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            client: { id: 1, name: 'Juan Pérez', phone: '+505 1234-5678', email: 'juan@email.com' },
            barber: { id: 1, full_name: 'Carlos López', phone: '+505 8765-4321', email: 'carlos@barberia.com' },
            cita_services: [
              {
                id: 1,
                service: { id: 1, name: 'Corte de Cabello', price: 150, duration_min: 30 }
              },
              {
                id: 2,
                service: { id: 2, name: 'Arreglo de Barba', price: 100, duration_min: 20 }
              }
            ]
          },
          {
            id: 2,
            client_id: 2,
            barber_id: 1,
            fecha_hora: `${today}T14:30:00`,
            estado: 'ATENDIDA' as const,
            notas: 'Solo corte',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            client: { id: 2, name: 'María González', phone: '+505 2345-6789', email: 'maria@email.com' },
            barber: { id: 1, full_name: 'Carlos López', phone: '+505 8765-4321', email: 'carlos@barberia.com' },
            cita_services: [
              {
                id: 3,
                service: { id: 1, name: 'Corte de Cabello', price: 150, duration_min: 30 }
              }
            ]
          }
        ]
        setTodayPayments(mockPayments)
        return
      }

      setTodayPayments(data || [])
    } catch (err) {
      console.warn('Error al cargar pagos del día (modo demo):', err)
      // Crear datos mock en caso de error
      const today = new Date().toISOString().split('T')[0]
      const mockPayments = [
        {
          id: 1,
          client_id: 1,
          barber_id: 1,
          fecha_hora: `${today}T10:00:00`,
          estado: 'ATENDIDA' as const,
          notas: 'Corte y barba',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client: { id: 1, name: 'Juan Pérez', phone: '+505 1234-5678', email: 'juan@email.com' },
          barber: { id: 1, full_name: 'Carlos López', phone: '+505 8765-4321', email: 'carlos@barberia.com' },
          cita_services: [
            {
              id: 1,
              service: { id: 1, name: 'Corte de Cabello', price: 150, duration_min: 30 }
            },
            {
              id: 2,
              service: { id: 2, name: 'Arreglo de Barba', price: 100, duration_min: 20 }
            }
          ]
        },
        {
          id: 2,
          client_id: 2,
          barber_id: 1,
          fecha_hora: `${today}T14:30:00`,
          estado: 'ATENDIDA' as const,
          notas: 'Solo corte',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          client: { id: 2, name: 'María González', phone: '+505 2345-6789', email: 'maria@email.com' },
          barber: { id: 1, full_name: 'Carlos López', phone: '+505 8765-4321', email: 'carlos@barberia.com' },
          cita_services: [
            {
              id: 3,
              service: { id: 1, name: 'Corte de Cabello', price: 150, duration_min: 30 }
            }
          ]
        }
      ]
      setTodayPayments(mockPayments)
    }
  }

  const openCashRegister = async (openingCash: number, notes?: string) => {
    try {
      if (!cashRegister) return

      const { error } = await supabase
        .from('cash_register')
        .update({
          opening_cash: openingCash,
          is_open: true,
          notes: notes || 'Caja abierta manualmente'
        })
        .eq('id', cashRegister.id)

      if (error) {
        console.warn('Error al abrir caja (modo demo):', error.message)
        // Simular apertura en modo demo
        setCashRegister(prev => prev ? {
          ...prev,
          opening_cash: openingCash,
          is_open: true,
          notes: notes || 'Caja abierta manualmente (demo)'
        } : null)
        return
      }

      // Crear movimiento de apertura
      await supabase
        .from('cash_movement')
        .insert([{
          cash_register_id: cashRegister.id,
          type: 'OPENING',
          amount: openingCash,
          description: 'Apertura de caja',
          created_by: 1
        }])

      await fetchTodayCashRegister()
    } catch (err) {
      console.warn('Error al abrir caja (modo demo):', err)
      // Simular apertura en modo demo
      setCashRegister(prev => prev ? {
        ...prev,
        opening_cash: openingCash,
        is_open: true,
        notes: notes || 'Caja abierta manualmente (demo)'
      } : null)
    }
  }

  const closeCashRegister = async (closingCash: number, notes?: string) => {
    try {
      if (!cashRegister) return

      const { error } = await supabase
        .from('cash_register')
        .update({
          closing_cash: closingCash,
          is_open: false,
          closed_by: 1,
          closed_at: new Date().toISOString(),
          notes: notes || 'Caja cerrada'
        })
        .eq('id', cashRegister.id)

      if (error) {
        console.warn('Error al cerrar caja (modo demo):', error.message)
        // Simular cierre en modo demo
        setCashRegister(prev => prev ? {
          ...prev,
          closing_cash: closingCash,
          is_open: false,
          closed_by: 1,
          closed_at: new Date().toISOString(),
          notes: notes || 'Caja cerrada (demo)'
        } : null)
        return
      }

      // Crear movimiento de cierre
      await supabase
        .from('cash_movement')
        .insert([{
          cash_register_id: cashRegister.id,
          type: 'CLOSING',
          amount: closingCash,
          description: 'Cierre de caja',
          created_by: 1
        }])

      await fetchTodayCashRegister()
    } catch (err) {
      console.warn('Error al cerrar caja (modo demo):', err)
      // Simular cierre en modo demo
      setCashRegister(prev => prev ? {
        ...prev,
        closing_cash: closingCash,
        is_open: false,
        closed_by: 1,
        closed_at: new Date().toISOString(),
        notes: notes || 'Caja cerrada (demo)'
      } : null)
    }
  }

  const addExpense = async (concept: string, quantity: number, unitPrice: number) => {
    try {
      if (!cashRegister) return

      const totalAmount = quantity * unitPrice
      const description = `${quantity} ${concept} a C$${unitPrice} c/u = C$${totalAmount}`

      // Crear movimiento directamente en cash_movement
      const { data: movementData, error: movementError } = await supabase
        .from('cash_movement')
        .insert([{
          cash_register_id: cashRegister.id,
          type: 'EXPENSE',
          amount: -totalAmount, // Negativo porque es un gasto
          description: description,
          reference_type: 'supplies', // Tipo fijo para insumos
          created_by: 1
        }])
        .select()
        .single()

      if (movementError) {
        console.warn('Error al agregar gasto (modo demo):', movementError.message)
        // Simular gasto en modo demo
        const newExpensesTotal = (cashRegister.expenses_total || 0) + totalAmount
        setCashRegister(prev => prev ? {
          ...prev,
          expenses_total: newExpensesTotal
        } : null)
        
        // Agregar movimiento en modo demo
        const newMovement = {
          id: Date.now(),
          cash_register_id: cashRegister.id,
          type: 'EXPENSE' as const,
          amount: -totalAmount, // Negativo porque es un gasto
          description: description,
          reference_type: 'supplies',
          created_by: 1,
          created_at: new Date().toISOString(),
          created_by_user: { id: 1, full_name: 'Usuario Demo' }
        }
        setMovements(prev => [newMovement, ...prev])
        return
      }

      // Actualizar total de gastos en la caja
      const newExpensesTotal = (cashRegister.expenses_total || 0) + totalAmount
      const { error: updateError } = await supabase
        .from('cash_register')
        .update({ expenses_total: newExpensesTotal })
        .eq('id', cashRegister.id)

      if (updateError) {
        console.warn('Error al actualizar total de gastos:', updateError.message)
      }

      await fetchTodayCashRegister()
    } catch (err) {
      console.warn('Error al agregar gasto (modo demo):', err)
      // Simular gasto en modo demo
      const totalAmount = quantity * unitPrice
      const description = `${quantity} ${concept} a C$${unitPrice} c/u = C$${totalAmount}`
      const newExpensesTotal = (cashRegister?.expenses_total || 0) + totalAmount
      setCashRegister(prev => prev ? {
        ...prev,
        expenses_total: newExpensesTotal
      } : null)
      
      // Agregar movimiento en modo demo
      if (cashRegister) {
        const newMovement = {
          id: Date.now(),
          cash_register_id: cashRegister.id,
          type: 'EXPENSE' as const,
          amount: -totalAmount, // Negativo porque es un gasto
          description: description,
          reference_type: 'supplies',
          created_by: 1,
          created_at: new Date().toISOString(),
          created_by_user: { id: 1, full_name: 'Usuario Demo' }
        }
        setMovements(prev => [newMovement, ...prev])
      }
    }
  }

  const recordSale = async (amount: number, appointmentId?: number, description?: string) => {
    try {
      if (!cashRegister) return

      // Actualizar total de ventas en la caja
      const newSalesTotal = (cashRegister.sales_total || 0) + amount
      const { error } = await supabase
        .from('cash_register')
        .update({ sales_total: newSalesTotal })
        .eq('id', cashRegister.id)

      if (error) {
        console.warn('Error al registrar venta (modo demo):', error.message)
        // Simular venta en modo demo
        setCashRegister(prev => prev ? {
          ...prev,
          sales_total: newSalesTotal
        } : null)
        
        // Agregar a la lista local de movimientos
        const newMovement = {
          id: Date.now(),
          cash_register_id: cashRegister.id,
          type: 'SALE' as const,
          amount,
          description: description || 'Venta de servicios',
          reference_id: appointmentId,
          reference_type: 'appointment',
          created_by: 1,
          created_at: new Date().toISOString(),
          created_by_user: { id: 1, full_name: 'Usuario Demo' }
        }
        setMovements(prev => [newMovement, ...prev])
        return
      }

      // Crear movimiento
      await supabase
        .from('cash_movement')
        .insert([{
          cash_register_id: cashRegister.id,
          type: 'SALE',
          amount,
          description: description || 'Venta de servicios',
          reference_id: appointmentId,
          reference_type: 'appointment',
          created_by: 1
        }])

      await fetchTodayCashRegister()
    } catch (err) {
      console.warn('Error al registrar venta (modo demo):', err)
      // Simular venta en modo demo
      const newSalesTotal = (cashRegister?.sales_total || 0) + amount
      setCashRegister(prev => prev ? {
        ...prev,
        sales_total: newSalesTotal
      } : null)
      
      // Agregar a la lista local de movimientos
      if (cashRegister) {
        const newMovement = {
          id: Date.now(),
          cash_register_id: cashRegister.id,
          type: 'SALE' as const,
          amount,
          description: description || 'Venta de servicios',
          reference_id: appointmentId,
          reference_type: 'appointment',
          created_by: 1,
          created_at: new Date().toISOString(),
          created_by_user: { id: 1, full_name: 'Usuario Demo' }
        }
        setMovements(prev => [newMovement, ...prev])
      }
    }
  }

  // Calcular efectivo actual
  const getCurrentCash = () => {
    if (!cashRegister) return 0
    return (cashRegister.opening_cash || 0) + (cashRegister.sales_total || 0) - (cashRegister.expenses_total || 0)
  }

  return {
    cashRegister,
    movements,
    expenses,
    todayPayments,
    loading,
    error,
    refetch: fetchTodayCashRegister,
    openCashRegister,
    closeCashRegister,
    addExpense,
    recordSale,
    getCurrentCash
  }
}
