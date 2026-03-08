'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter } from './types'
import { useAuth } from './auth-context'

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
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

// Mock de notas - será substituído por API real
const generateMockNotes = (userId: string): Note[] => [
  {
    id: 'note_1',
    userId,
    title: 'Bem-vindo ao CloudNotes',
    content:
      'Esta é sua primeira nota! Use o CloudNotes para organizar suas ideias, tarefas e lembretes. Experimente criar, editar e arquivar suas notas.',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    archived: false,
  },
  {
    id: 'note_2',
    userId,
    title: 'Lista de Compras',
    content: '- Leite\n- Pão\n- Ovos\n- Frutas\n- Café',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    archived: false,
  },
  {
    id: 'note_3',
    userId,
    title: 'Ideias de Projeto',
    content: '1. App de receitas\n2. Tracker de hábitos\n3. Calculadora de investimentos',
    createdAt: new Date(Date.now() - 43200000),
    updatedAt: new Date(Date.now() - 43200000),
    archived: true,
  },
]

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>(() => (user ? generateMockNotes(user.id) : []))
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<NoteFilter>('all')

  const filteredNotes = notes
    .filter((note) => {
      if (filter === 'archived') return note.archived
      if (filter === 'active') return !note.archived
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const createNote = useCallback(
    async (input: CreateNoteInput): Promise<Note> => {
      if (!user) throw new Error('Usuário não autenticado')

      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const now = new Date()
      const newNote: Note = {
        id: `note_${Date.now()}`,
        userId: user.id,
        title: input.title,
        content: input.content || '',
        createdAt: now,
        updatedAt: now,
        archived: false,
      }

      setNotes((prev) => [newNote, ...prev])
      setIsLoading(false)

      return newNote
    },
    [user],
  )

  const updateNote = useCallback(
    async (id: string, input: UpdateNoteInput): Promise<Note> => {
      if (!user) throw new Error('Usuário não autenticado')

      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      let updatedNote: Note | undefined

      setNotes((prev) =>
        prev.map((note) => {
          if (note.id === id && note.userId === user.id) {
            updatedNote = {
              ...note,
              ...input,
              updatedAt: new Date(),
            }
            return updatedNote
          }
          return note
        }),
      )

      setIsLoading(false)

      if (!updatedNote) throw new Error('Nota não encontrada')
      return updatedNote
    },
    [user],
  )

  const deleteNote = useCallback(
    async (id: string): Promise<void> => {
      if (!user) throw new Error('Usuário não autenticado')

      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotes((prev) => prev.filter((note) => !(note.id === id && note.userId === user.id)))
      setIsLoading(false)
    },
    [user],
  )

  const archiveNote = useCallback(
    async (id: string): Promise<void> => {
      await updateNote(id, { archived: true })
    },
    [updateNote],
  )

  const unarchiveNote = useCallback(
    async (id: string): Promise<void> => {
      await updateNote(id, { archived: false })
    },
    [updateNote],
  )

  const getNoteById = useCallback(
    (id: string): Note | undefined => {
      return notes.find((note) => note.id === id && note.userId === user?.id)
    },
    [notes, user],
  )

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
