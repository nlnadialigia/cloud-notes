'use client'

import { FileText, Search } from 'lucide-react'
import { NoteCard } from './note-card'
import { Input } from '@/components/ui/input'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { NoteGridSkeleton } from '@/components/ui/note-skeleton'
import { useNotes } from '@/lib/notes-context'
import { useI18n } from '@/lib/i18n-context'
import type { Note } from '@/lib/types'
import { useState, useMemo } from 'react'

interface NotesGridProps {
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

export function NotesGrid({ onEdit, onDelete }: NotesGridProps) {
  const { filteredNotes, archiveNote, unarchiveNote, filter, isLoading } = useNotes()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')

  const searchedNotes = useMemo(() => {
    if (!searchQuery.trim()) return filteredNotes

    const query = searchQuery.toLowerCase()
    return filteredNotes.filter(
      (note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query),
    )
  }, [filteredNotes, searchQuery])

  const filterLabels: Record<string, string> = {
    all: t('allNotes'),
    active: t('activeNotes'),
    archived: t('archivedNotes'),
  }

  return (
    <div className="flex-1 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{filterLabels[filter]}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchedNotes.length} {searchedNotes.length === 1 ? t('noteFound') : t('notesFound')}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchNotes')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>

        {isLoading ? (
          <NoteGridSkeleton />
        ) : searchedNotes.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{searchQuery ? t('noNotesFound') : t('noNotesYet')}</EmptyTitle>
              <EmptyDescription>
                {searchQuery ? t('searchOtherTerms') : filter === 'archived' ? t('noArchivedNotes') : t('clickNewNote')}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                onArchive={(n) => archiveNote(n.id)}
                onUnarchive={(n) => unarchiveNote(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
