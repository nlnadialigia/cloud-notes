'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'
export type Palette = 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'cyan' | 'purple' | 'stone'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  palette: Palette
  setPalette: (palette: Palette) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const PALETTES: { value: Palette; label: string; color: string }[] = [
  { value: 'indigo', label: 'Indigo', color: 'oklch(0.55 0.2 250)' },
  { value: 'emerald', label: 'Emerald', color: 'oklch(0.6 0.18 160)' },
  { value: 'rose', label: 'Rose', color: 'oklch(0.6 0.2 350)' },
  { value: 'amber', label: 'Amber', color: 'oklch(0.7 0.18 70)' },
  { value: 'slate', label: 'Slate', color: 'oklch(0.3 0 0)' },
  { value: 'cyan', label: 'Cyan', color: 'oklch(0.6 0.15 200)' },
  { value: 'purple', label: 'Purple', color: 'oklch(0.55 0.2 290)' },
  { value: 'stone', label: 'Stone', color: 'oklch(0.4 0.02 60)' },
]

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [palette, setPaletteState] = useState<Palette>('indigo')

  useEffect(() => {
    const storedTheme = localStorage.getItem('cloudnotes-theme') as Theme | null
    const storedPalette = localStorage.getItem('cloudnotes-palette') as Palette | null
    if (storedTheme) {
      setThemeState(storedTheme)
    }
    if (storedPalette) {
      setPaletteState(storedPalette)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('data-palette', palette)
  }, [palette])

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let resolved: 'light' | 'dark'

      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }

      setResolvedTheme(resolved)
      root.classList.remove('light', 'dark')
      root.classList.add(resolved)
    }

    updateTheme()

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateTheme)
      return () => mediaQuery.removeEventListener('change', updateTheme)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('cloudnotes-theme', newTheme)
  }

  const setPalette = (newPalette: Palette) => {
    setPaletteState(newPalette)
    localStorage.setItem('cloudnotes-palette', newPalette)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
