import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/theme-context'
import { I18nProvider } from '@/lib/i18n-context'
import { QueryProvider } from '@/lib/query-provider'
import { Toaster } from '@/components/ui/toaster'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CloudNotes - Suas notas na nuvem',
  description: 'Aplicação de gerenciamento de notas pessoais com AWS',
  icons: {
    icon: [
      {
        url: '/cloud.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/cloud.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/cloud.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider>
            <I18nProvider>
              {children}
              <Toaster />
            </I18nProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
