'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useI18n, type Locale } from '@/lib/i18n-context'
import { PALETTES, useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Globe, Moon, Palette, Sun } from 'lucide-react'

export function Header() {
  const { theme, setTheme, resolvedTheme, palette, setPalette } = useTheme()
  const { locale, setLocale, t } = useI18n()

  const themeOptions = [
    { value: 'light' as const, label: t('themeLight'), icon: Sun },
    { value: 'dark' as const, label: t('themeDark'), icon: Moon },
  ]

  const languageOptions: { value: Locale; label: string; flag: string }[] = [
    { value: 'pt-BR', label: t('shortPtBr'), flag: '🇧🇷' },
    { value: 'en', label: t('shortEn'), flag: '🇺🇸' },
  ]

  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur-sm flex items-center justify-end px-4 gap-2">
      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t('language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {languageOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setLocale(option.value)}
              className={cn('cursor-pointer gap-1', locale === option.value && 'bg-accent')}
            >
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Palette Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-4 w-4" />
            <span className="sr-only">{t('colorPalette')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {PALETTES.map((p) => (
            <DropdownMenuItem
              key={p.value}
              onClick={() => setPalette(p.value)}
              className={cn('cursor-pointer gap-2', palette === p.value && 'bg-accent')}
            >
              <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: p.color }} />
              <span>{p.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">{t('theme')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn('cursor-pointer gap-2', theme === option.value && 'bg-accent')}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
