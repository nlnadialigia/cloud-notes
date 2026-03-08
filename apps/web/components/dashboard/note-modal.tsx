'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { useNotes } from '@/lib/notes-context'
import { useI18n } from '@/lib/i18n-context'
import type { Note } from '@/lib/types'

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  note?: Note | null
}

export function NoteModal({ isOpen, onClose, note }: NoteModalProps) {
  const { createNote, updateNote, isLoading } = useNotes()
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const isEditing = !!note

  useEffect(() => {
    if (isOpen) {
      if (note) {
        setTitle(note.title)
        setContent(note.content)
      } else {
        setTitle('')
        setContent('')
      }
      setError('')
    }
  }, [isOpen, note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError(t('titleRequired'))
      return
    }

    try {
      if (isEditing && note) {
        await updateNote(note.id, { title: title.trim(), content })
      } else {
        await createNote({ title: title.trim(), content })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveError'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{isEditing ? t('editNote') : t('newNote')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing ? t('editNoteDescription') : t('newNoteDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="note-title">{t('noteTitle')}</FieldLabel>
              <Input
                id="note-title"
                placeholder={t('noteTitlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-input border-border text-foreground"
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="note-content">{t('noteContent')}</FieldLabel>
              <Textarea
                id="note-content"
                placeholder={t('noteContentPlaceholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-input border-border text-foreground min-h-[150px] resize-none"
              />
            </Field>

            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          </FieldGroup>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : isEditing ? (
                t('saveChanges')
              ) : (
                t('createNote')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
