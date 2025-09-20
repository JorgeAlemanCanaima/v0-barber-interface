import { Metadata } from 'next'

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
  metadataBase: new URL('https://tu-dominio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BarberPro - Sistema de Gestión',
    description: 'Sistema de gestión completo para barberías',
    url: 'https://tu-dominio.com',
    siteName: 'BarberPro',
    images: [
      {
        url: '/barber-shop.png',
        width: 1200,
        height: 630,
        alt: 'BarberPro Logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BarberPro - Sistema de Gestión',
    description: 'Sistema de gestión completo para barberías',
    images: ['/barber-shop.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
