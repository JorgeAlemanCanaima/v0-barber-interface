"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Eye, Bug, Database, ArrowRight, Scissors } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="glass-card sticky top-0 z-50 border-b-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl gradient-bg shadow-lg">
                  <Scissors className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">BarberPro</h1>
                <p className="text-sm text-muted-foreground font-medium">Sistema de Gestión de Barbería</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bienvenido a BarberPro
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige la vista que mejor se adapte a tus necesidades. 
            Gestiona tu barbería o explora nuestros servicios.
          </p>
        </div>

        {/* Tarjetas de navegación */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Vista Cliente */}
          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Vista Cliente</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Explora nuestros servicios, conoce a nuestros barberos y reserva tu cita
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/cliente">
                <Button className="w-full gradient-bg text-white hover:opacity-90 shadow-lg hover-lift">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Servicios
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vista Admin */}
          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Panel Administrativo</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Gestiona citas, clientes, servicios y analiza el rendimiento de tu barbería
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/admin">
                <Button className="w-full gradient-bg text-white hover:opacity-90 shadow-lg hover-lift">
                  <Settings className="h-4 w-4 mr-2" />
                  Administrar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Vista Debug */}
          <Card className="glass-card border-0 hover-lift group">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Herramientas Debug</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Diagnostica la conexión con la base de datos y visualiza los datos en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/debug">
                <Button className="w-full gradient-bg text-white hover:opacity-90 shadow-lg hover-lift">
                  <Bug className="h-4 w-4 mr-2" />
                  Debug
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="mt-16 text-center">
          <Card className="glass-card border-0 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">¿Necesitas ayuda?</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Cada vista está diseñada para una experiencia específica. 
                La vista cliente es perfecta para tus clientes, 
                el panel administrativo para gestionar tu negocio, 
                y las herramientas debug para resolver problemas técnicos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  <Database className="h-4 w-4 mr-2" />
                  Base de datos conectada
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  <Scissors className="h-4 w-4 mr-2" />
                  Sistema en funcionamiento
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
