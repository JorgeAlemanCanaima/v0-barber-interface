"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface TableInfo {
  status: 'success' | 'error'
  message: string
  count: number
  description: string
  sampleData?: any[]
}

export default function DebugSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Verificando...")
  const [tablesStatus, setTablesStatus] = useState<Record<string, TableInfo>>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Verificar conexión básica
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log("Auth test:", { user, userError })
        
        // Test 2: Verificar cada tabla en el esquema public
        const tables = [
          { name: 'role', description: 'Roles del sistema' },
          { name: 'user', description: 'Usuarios y barberos' },
          { name: 'client', description: 'Clientes de la barbería' },
          { name: 'service', description: 'Servicios ofrecidos' },
          { name: 'cita', description: 'Citas programadas' },
          { name: 'cash_register', description: 'Registro de caja' },
          { name: 'mov_cash', description: 'Movimientos de efectivo' },
          { name: 'audit_log', description: 'Log de auditoría' },
          { name: 'backup_log', description: 'Log de respaldos' }
        ]
        
        const status: Record<string, TableInfo> = {}
        
        for (const table of tables) {
          try {
            console.log(`Probando tabla: ${table.name}`)
            
            // Obtener conteo total y muestra de datos
            const { data, error, count } = await supabase
              .from(table.name)
              .select('*', { count: 'exact' })
              .limit(5)
            
            console.log(`Resultado para ${table.name}:`, { data, error, count })
            
            if (error) {
              status[table.name] = {
                status: 'error',
                message: `${error.message} (${error.code})`,
                count: 0,
                description: table.description
              }
            } else {
              status[table.name] = {
                status: 'success',
                message: `OK`,
                count: count || data?.length || 0,
                description: table.description,
                sampleData: data?.slice(0, 2) || []
              }
            }
          } catch (err) {
            console.error(`Error en tabla ${table.name}:`, err)
            status[table.name] = {
              status: 'error',
              message: `${err instanceof Error ? err.message : 'Unknown error'}`,
              count: 0,
              description: table.description
            }
          }
        }
        
        setTablesStatus(status)
        setConnectionStatus("Conexión establecida")
        
      } catch (error) {
        console.error("Error de conexión:", error)
        setConnectionStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Debug de Supabase - Esquema Public</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Estado de Conexión:</h3>
        <p className={`p-2 rounded ${connectionStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {connectionStatus}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Estado de Tablas (Esquema Public):</h3>
        <div className="space-y-4">
          {Object.entries(tablesStatus).map(([table, info]) => (
            <div key={table} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-lg capitalize">{table}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{info.description}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    info.status === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {info.status === 'success' ? '✓' : '✗'} {info.message}
                  </span>
                  <p className="text-sm font-medium mt-1">{info.count} registros</p>
                </div>
              </div>
              
              {info.status === 'success' && info.sampleData && info.sampleData.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Muestra de datos:</p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-xs">
                    <pre className="whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(info.sampleData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Variables de Entorno:</h3>
        <div className="space-y-1 text-sm">
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</p>
          <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
        </div>
      </div>

      {/* Resumen estadístico */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Resumen de la Base de Datos:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const totalTables = Object.keys(tablesStatus).length
            const successfulTables = Object.values(tablesStatus).filter((info: any) => info.status === 'success').length
            const totalRecords = Object.values(tablesStatus).reduce((sum: number, info: any) => sum + (info.count || 0), 0)
            const failedTables = totalTables - successfulTables

            return (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalTables}</div>
                  <div className="text-sm text-blue-600">Total Tablas</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{successfulTables}</div>
                  <div className="text-sm text-green-600">Conectadas</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{failedTables}</div>
                  <div className="text-sm text-red-600">Con Errores</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalRecords}</div>
                  <div className="text-sm text-purple-600">Total Registros</div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
