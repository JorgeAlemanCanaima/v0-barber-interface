"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCashRegister } from "@/lib/hooks/useCashRegister"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Minus,
  Clock,
  Calendar,
  User,
  Receipt,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react"

export function CashRegister() {
  const { 
    cashRegister, 
    movements, 
    expenses, 
    todayPayments,
    loading, 
    error, 
    openCashRegister, 
    closeCashRegister, 
    addExpense,
    getCurrentCash 
  } = useCashRegister()

  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false)
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [openingCash, setOpeningCash] = useState("")
  const [closingCash, setClosingCash] = useState("")
  const [expenseConcept, setExpenseConcept] = useState("")
  const [expenseQuantity, setExpenseQuantity] = useState("")
  const [expenseUnitPrice, setExpenseUnitPrice] = useState("")
  const [notes, setNotes] = useState("")

  const handleOpenCash = async () => {
    try {
      const amount = parseFloat(openingCash)
      if (isNaN(amount) || amount < 0) {
        alert('Por favor ingresa un monto válido')
        return
      }
      
      await openCashRegister(amount, notes)
      setIsOpenModalOpen(false)
      setOpeningCash("")
      setNotes("")
    } catch (error) {
      console.error('Error al abrir caja:', error)
      alert('Error al abrir la caja')
    }
  }

  const handleCloseCash = async () => {
    try {
      const amount = parseFloat(closingCash)
      if (isNaN(amount) || amount < 0) {
        alert('Por favor ingresa un monto válido')
        return
      }
      
      await closeCashRegister(amount, notes)
      setIsCloseModalOpen(false)
      setClosingCash("")
      setNotes("")
    } catch (error) {
      console.error('Error al cerrar caja:', error)
      alert('Error al cerrar la caja')
    }
  }

  const handleAddExpense = async () => {
    try {
      const quantity = parseFloat(expenseQuantity)
      const unitPrice = parseFloat(expenseUnitPrice)
      
      if (isNaN(quantity) || quantity <= 0) {
        alert('Por favor ingresa una cantidad válida')
        return
      }
      
      if (isNaN(unitPrice) || unitPrice <= 0) {
        alert('Por favor ingresa un precio unitario válido')
        return
      }
      
      if (!expenseConcept.trim()) {
        alert('Por favor ingresa el concepto del insumo')
        return
      }
      
      await addExpense(expenseConcept.trim(), quantity, unitPrice)
      setIsExpenseModalOpen(false)
      setExpenseConcept("")
      setExpenseQuantity("")
      setExpenseUnitPrice("")
    } catch (error) {
      console.error('Error al agregar gasto:', error)
      alert('Error al registrar el insumo')
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Cargando caja registradora...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentCash = getCurrentCash()
  const today = new Date().toLocaleDateString('es-NI', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Calcular total de pagos del día
  const getTodayPaymentsTotal = () => {
    return todayPayments.reduce((total, payment) => {
      const servicesTotal = payment.cita_services?.reduce((serviceTotal, cs) => 
        serviceTotal + (cs.service?.price || 0), 0) || 0
      return total + servicesTotal
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header de la caja */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <Wallet className="h-6 w-6 mr-2 text-primary" />
                Caja Registradora
              </CardTitle>
              <p className="text-muted-foreground mt-1">{today}</p>
            </div>
            <Badge 
              className={cashRegister?.is_open 
                ? "bg-green-100 text-green-800 border-green-300" 
                : "bg-red-100 text-red-800 border-red-300"
              }
            >
              {cashRegister?.is_open ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Abierta
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Cerrada
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Resumen de la caja */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-0 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efectivo Inicial</p>
                <p className="text-2xl font-bold text-primary">
                  C${cashRegister?.opening_cash || 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventas del Día</p>
                <p className="text-2xl font-bold text-green-600">
                  C${cashRegister?.sales_total || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  C${cashRegister?.expenses_total || 0}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efectivo Actual</p>
                <p className="text-2xl font-bold text-blue-600">
                  C${currentCash}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos de Hoy</p>
                <p className="text-2xl font-bold text-purple-600">
                  C${getTodayPaymentsTotal()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {todayPayments.length} citas atendidas
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {!cashRegister?.is_open ? (
              <Button
                onClick={() => setIsOpenModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Abrir Caja
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsExpenseModalOpen(true)}
                  variant="outline"
                  className="border-red-300 hover:bg-red-50 text-red-700"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Registrar Insumo
                </Button>
                <Button
                  onClick={() => setIsCloseModalOpen(true)}
                  variant="outline"
                  className="border-orange-300 hover:bg-orange-50 text-orange-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar Caja
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Movimientos recientes */}
      {movements.length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Movimientos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {movements.slice(0, 5).map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      movement.type === 'SALE' ? 'bg-green-500' :
                      movement.type === 'EXPENSE' ? 'bg-red-500' :
                      movement.type === 'OPENING' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium">{movement.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movement.created_at).toLocaleTimeString('es-NI')}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    movement.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.amount > 0 ? '+' : ''}C${Math.abs(movement.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gastos del día */}
      {expenses.length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-primary" />
              Gastos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category && `${expense.category} • `}
                      {new Date(expense.created_at).toLocaleTimeString('es-NI')}
                    </p>
                  </div>
                  <div className="text-red-600 font-semibold">
                    C${expense.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección de Pagos del Día */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
            Pagos de Hoy
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Todas las citas atendidas y pagadas hoy
          </p>
        </CardHeader>
        <CardContent>
          {todayPayments.length > 0 ? (
            <div className="space-y-4">
              {todayPayments.map((payment) => {
                const totalPayment = payment.cita_services?.reduce((total, cs) => 
                  total + (cs.service?.price || 0), 0) || 0
                const appointmentTime = new Date(payment.fecha_hora).toLocaleTimeString('es-NI', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
                
                return (
                  <div key={payment.id} className="p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {payment.client?.name || 'Cliente Desconocido'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {appointmentTime} • {payment.barber?.full_name || 'Barbero N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">
                          C${totalPayment}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.cita_services?.length || 0} servicios
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {payment.cita_services?.map((cs) => (
                        <div key={cs.id} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {cs.service?.name || 'Servicio Desconocido'}
                          </span>
                          <span className="font-medium">
                            C${cs.service?.price || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {payment.notas && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-sm text-muted-foreground italic">
                          "{payment.notas}"
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
              
              <div className="mt-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-800">Total Pagado Hoy:</span>
                  <span className="text-xl font-bold text-purple-800">
                    C${getTodayPaymentsTotal()}
                  </span>
                </div>
                <p className="text-sm text-purple-600 mt-1">
                  {todayPayments.length} citas atendidas
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No hay pagos registrados hoy</p>
              <p className="text-sm">Las citas atendidas aparecerán aquí</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para abrir caja */}
      <Modal isOpen={isOpenModalOpen} onClose={() => setIsOpenModalOpen(false)} title="Abrir Caja">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Efectivo Inicial</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
            <Textarea
              placeholder="Notas sobre la apertura de caja..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpenModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleOpenCash} className="bg-green-600 hover:bg-green-700">
              Abrir Caja
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para cerrar caja */}
      <Modal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} title="Cerrar Caja">
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground">Efectivo esperado en caja:</p>
            <p className="text-2xl font-bold text-primary">C${currentCash}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Efectivo Real en Caja</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={closingCash}
              onChange={(e) => setClosingCash(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
            <Textarea
              placeholder="Notas sobre el cierre de caja..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCloseCash} className="bg-orange-600 hover:bg-orange-700">
              Cerrar Caja
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para agregar gasto */}
      <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Registrar Insumo">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Concepto</label>
            <Input
              placeholder="Ej: Chiltomas, Champú, Toallas, etc."
              value={expenseConcept}
              onChange={(e) => setExpenseConcept(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Cantidad</label>
            <Input
              type="number"
              step="1"
              placeholder="10"
              value={expenseQuantity}
              onChange={(e) => setExpenseQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Precio Unitario (C$)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="120.00"
              value={expenseUnitPrice}
              onChange={(e) => setExpenseUnitPrice(e.target.value)}
            />
          </div>
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Total:</strong> C$
              {expenseQuantity && expenseUnitPrice 
                ? (parseFloat(expenseQuantity) * parseFloat(expenseUnitPrice)).toFixed(2)
                : '0.00'
              }
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsExpenseModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddExpense} className="bg-red-600 hover:bg-red-700">
              Registrar Insumo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
