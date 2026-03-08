'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/lib/auth-context'
import { useI18n, type Locale } from '@/lib/i18n-context'
import { PALETTES, useTheme, type Palette } from '@/lib/theme-context'
import { ChevronLeft, Loader2, Monitor, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const { theme, setTheme, palette, setPalette } = useTheme()
  const { locale, setLocale, t } = useI18n()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const themeOptions = [
    { value: 'light' as const, label: t('themeLight'), icon: Sun, description: t('themeLightDesc') },
    { value: 'dark' as const, label: t('themeDark'), icon: Moon, description: t('themeDarkDesc') },
    { value: 'system' as const, label: t('themeSystem'), icon: Monitor, description: t('themeSystemDesc') },
  ]

  const languageOptions: { value: Locale; label: string; flag: string; description: string }[] = [
    { value: 'pt-BR', label: t('languagePtBr'), flag: '🇧🇷', description: t('interfacePtBr') },
    { value: 'en', label: t('languageEn'), flag: '🇺🇸', description: t('interfaceEn') },
  ]

  const paletteLabels: Record<Palette, string> = {
    indigo: t('paletteIndigo'),
    emerald: t('paletteEmerald'),
    rose: t('paletteRose'),
    amber: t('paletteAmber'),
    slate: t('paletteSlate'),
    cyan: t('paletteCyan'),
    purple: t('palettePurple'),
    stone: t('paletteStone'),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
            <p className="text-muted-foreground">{t('managePreferences')}</p>
          </div>
        </div>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('account')}</CardTitle>
            <CardDescription>{t('accountInfo')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">{user?.email?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('appearance')}</CardTitle>
            <CardDescription>{t('customizeAppearance')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-4">
              <Label className="text-base">{t('theme')}</Label>
              <RadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                className="grid gap-3"
              >
                {themeOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`theme-${option.value}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                  >
                    <RadioGroupItem value={option.value} id={`theme-${option.value}`} />
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Color Palette */}
            <div className="space-y-4">
              <Label className="text-base">{t('colorPalette')}</Label>
              <p className="text-sm text-muted-foreground -mt-2">{t('colorPaletteDescription')}</p>
              <div className="grid grid-cols-4 gap-2">
                {PALETTES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPalette(p.value)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors ${
                      palette === p.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border-2 border-background shadow-sm"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs font-medium text-foreground">{paletteLabels[p.value]}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
            <CardDescription>{t('chooseLanguage')}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)} className="grid gap-3">
              {languageOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`lang-${option.value}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                >
                  <RadioGroupItem value={option.value} id={`lang-${option.value}`} />
                  <span className="text-2xl">{option.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
