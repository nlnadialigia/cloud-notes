'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useI18n } from '@/lib/i18n-context'
import { useNotes } from '@/lib/notes-context'
import type { NoteFilter } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Archive, Cloud, FileText, LogOut, Menu, Plus, Settings, User, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface SidebarProps {
  onNewNote: () => void
}

export function Sidebar({ onNewNote }: SidebarProps) {
  const { user, logout } = useAuth()
  const { filter, setFilter, notes } = useNotes()
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = notes.filter((n) => !n.archived).length
  const archivedCount = notes.filter((n) => n.archived).length

  const navItems: { label: string; filter: NoteFilter; icon: typeof FileText; count: number }[] = [
    { label: t('allNotes'), filter: 'all', icon: FileText, count: notes.length },
    { label: t('activeNotes'), filter: 'active', icon: FileText, count: activeCount },
    { label: t('archivedNotes'), filter: 'archived', icon: Archive, count: archivedCount },
  ]

  const handleFilterChange = (newFilter: NoteFilter) => {
    setFilter(newFilter)
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-14 p-4 border-b flex items-center">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Cloud className="h-8 w-8 text-sidebar-primary" />
          <span className="text-xl font-bold text-sidebar-foreground">{t('cloudNotes')}</span>
        </Link>
      </div>

      <div className="p-4">
        <Button onClick={onNewNote} className="w-full justify-start gap-2" size="lg">
          <Plus className="h-5 w-5" />
          {t('newNote')}
        </Button>
      </div>

      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.filter}>
              <Button
                onClick={() => handleFilterChange(item.filter)}
                variant="ghost"
                className="w-full justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    filter === item.filter
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'bg-sidebar-accent text-muted-foreground',
                  )}
                >
                  {item.count}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="py-3 border-t">
        <p className="px-3 pb-3 text-xs text-muted-foreground">{t('activeAccount')}</p>
        <div className="flex justify-between gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Perfil
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              {t('settings')}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  )
}
