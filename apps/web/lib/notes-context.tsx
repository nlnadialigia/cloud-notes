'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter } from './types'
import { useAuth } from './auth-context'
import {
  useNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useArchiveNoteMutation,
  useUnarchiveNoteMutation,
} from '@/hooks/use-notes-query'
import { toast } from 'sonner'

interface NotesContextType {
  notes: Note[]
  isLoading: boolean
  filter: NoteFilter
  setFilter: (filter: NoteFilter) => void
  createNote: (input: CreateNoteInput) => Promise<Note>
  updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>
  deleteNote: (id: string) => Promise<void>
  archiveNote: (id: string) => Promise<void>
  unarchiveNote: (id: string) => Promise<void>
  getNoteById: (id: string) => Note | undefined
  filteredNotes: Note[]
  refreshNotes: () => Promise<void>
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [filter, setFilter] = useState<NoteFilter>('all')

  const { data: notes = [], isLoading, refetch } = useNotesQuery()
  const createMutation = useCreateNoteMutation()
  const updateMutation = useUpdateNoteMutation()
  const deleteMutation = useDeleteNoteMutation()
  const archiveMutation = useArchiveNoteMutation()
  const unarchiveMutation = useUnarchiveNoteMutation()

  const filteredNotes = notes
    .filter((note) => {
      if (filter === 'archived') return note.status === 'archived'
      if (filter === 'active') return note.status === 'active'
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const createNote = async (input: CreateNoteInput): Promise<Note> => {
    try {
      const note = await createMutation.mutateAsync(input)
      toast.success('Nota criada com sucesso!')
      return note
    } catch (error) {
      toast.error('Erro ao criar nota')
      throw error
    }
  }

  const updateNote = async (id: string, input: UpdateNoteInput): Promise<Note> => {
    try {
      const note = await updateMutation.mutateAsync({ id, input })
      toast.success('Nota atualizada com sucesso!')
      return note
    } catch (error) {
      toast.error('Erro ao atualizar nota')
      throw error
    }
  }

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Nota deletada com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar nota')
      throw error
    }
  }

  const archiveNote = async (id: string): Promise<void> => {
    try {
      await archiveMutation.mutateAsync(id)
      toast.success('Nota arquivada com sucesso!')
    } catch (error) {
      toast.error('Erro ao arquivar nota')
      throw error
    }
  }

  const unarchiveNote = async (id: string): Promise<void> => {
    try {
      await unarchiveMutation.mutateAsync(id)
      toast.success('Nota desarquivada com sucesso!')
    } catch (error) {
      toast.error('Erro ao desarquivar nota')
      throw error
    }
  }

  const getNoteById = (id: string): Note | undefined => {
    return notes.find((note) => note.id === id)
  }

  const refreshNotes = async () => {
    await refetch()
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        isLoading,
        filter,
        setFilter,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote,
        getNoteById,
        filteredNotes,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error('useNotes deve ser usado dentro de um NotesProvider')
  }
  return context
}
