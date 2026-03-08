import { AuthProvider } from '@/lib/auth-context'
import { NotesProvider } from '@/lib/notes-context'
import { ThemeProvider } from '@/lib/theme-context'
import { I18nProvider } from '@/lib/i18n-context'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <NotesProvider>{children}</NotesProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
