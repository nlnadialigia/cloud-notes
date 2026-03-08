'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useNotes } from '@/lib/notes-context'
import { useI18n } from '@/lib/i18n-context'
import type { Note } from '@/lib/types'
import { useState } from 'react'

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
}

export function DeleteModal({ isOpen, onClose, note }: DeleteModalProps) {
  const { deleteNote } = useNotes()
  const { t } = useI18n()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!note) return

    setIsDeleting(true)
    try {
      await deleteNote(note.id)
      onClose()
    } catch (error) {
      console.error('Erro ao excluir nota:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!note) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-card-foreground">{t('deleteConfirmTitle')}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {t('deleteConfirmMessage')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting} className="flex-1 sm:flex-none">
            {t('cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('deleting')}
              </>
            ) : (
              t('deleteNote')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
