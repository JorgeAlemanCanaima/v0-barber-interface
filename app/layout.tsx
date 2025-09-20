import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BarberPro - Sistema de Gestión',
  description: 'Sistema de gestión completo para barberías con control de citas, clientes y servicios',
  keywords: ['barbería', 'gestión', 'citas', 'clientes', 'servicios'],
  authors: [{ name: 'BarberPro Team' }],
  creator: 'BarberPro',
  publisher: 'BarberPro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/barber-shop.png',
    shortcut: '/barber-shop.png',
    apple: '/barber-shop.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BarberPro',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BarberPro" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/barber-shop.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
