"use client"

import DebugSupabase from "@/components/debug-supabase"
import DataTest from "@/components/data-test"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bug, Database } from "lucide-react"

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header con navegación */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="glass-card border-0 hover-lift bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Herramientas de Debug</h1>
          <p className="text-muted-foreground text-lg">
            Diagnóstico y verificación de la conexión con Supabase
          </p>
        </div>

        <Tabs defaultValue="connection" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 glass-card p-2 h-14 rounded-2xl border-0">
            <TabsTrigger
              value="connection"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Bug className="h-4 w-4 mr-2" />
              Conexión
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:gradient-bg data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold transition-all hover-lift"
            >
              <Database className="h-4 w-4 mr-2" />
              Datos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection">
            <DebugSupabase />
          </TabsContent>

          <TabsContent value="data">
            <DataTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
