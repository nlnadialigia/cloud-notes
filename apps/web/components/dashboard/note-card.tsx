'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n-context'
import type { Note } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Archive, ArchiveRestore, MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  onArchive: (note: Note) => void
  onUnarchive: (note: Note) => void
}

export function NoteCard({ note, onEdit, onDelete, onArchive, onUnarchive }: NoteCardProps) {
  const { t, locale } = useI18n()

  const formatDate = (date: Date): string => {
    const now = new Date()
    const noteDate = new Date(date)
    const diffTime = now.getTime() - noteDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return t('today')
    } else if (diffDays === 1) {
      return t('yesterday')
    } else if (diffDays < 7) {
      return `${diffDays} ${t('daysAgo')}`
    } else {
      return noteDate.toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: noteDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })
    }
  }
  return (
    <Card
      className={cn(
        'group bg-card hover:border-primary/50 transition-all duration-200 cursor-pointer',
        note.archived && 'opacity-60',
      )}
      onClick={() => onEdit(note)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-medium text-card-foreground line-clamp-1 flex-1">{note.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(note)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {t('edit')}
              </DropdownMenuItem>
              {note.archived ? (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onUnarchive(note)
                  }}
                >
                  <ArchiveRestore className="h-4 w-4 mr-2" />
                  {t('unarchiveNote')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onArchive(note)
                  }}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {t('archiveNote')}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(note)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap mb-3">
          {note.content || t('noContent')}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>
          {note.archived && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t('archivedNotes')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
