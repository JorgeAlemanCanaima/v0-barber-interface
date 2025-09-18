"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DebugSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Verificando...")
  const [tablesStatus, setTablesStatus] = useState<Record<string, string>>({})

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Verificar conexión básica
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log("Auth test:", { user, userError })
        
        // Test 2: Verificar cada tabla en el esquema public
        const tables = ['role', 'user', 'client', 'service', 'cita']
        const status: Record<string, string> = {}
        
        for (const table of tables) {
          try {
            console.log(`Probando tabla: ${table}`)
            
            // Primero probar sin filtros
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(5)
            
            console.log(`Resultado para ${table}:`, { data, error })
            
            if (error) {
              status[table] = `Error: ${error.message} (${error.code})`
            } else {
              status[table] = `OK (${data?.length || 0} registros)`
            }
          } catch (err) {
            console.error(`Error en tabla ${table}:`, err)
            status[table] = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
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
        <div className="space-y-2">
          {Object.entries(tablesStatus).map(([table, status]) => (
            <div key={table} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <span className="font-medium">{table}</span>
              <span className={`text-sm ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {status}
              </span>
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
    </div>
  )
}
