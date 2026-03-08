'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { NotesGrid } from '@/components/dashboard/notes-grid'
import { NoteModal } from '@/components/dashboard/note-modal'
import { DeleteModal } from '@/components/dashboard/delete-modal'
import { useAuth } from '@/lib/auth-context'
import type { Note } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleNewNote = () => {
    setSelectedNote(null)
    setNoteModalOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setNoteModalOpen(true)
  }

  const handleDeleteNote = (note: Note) => {
    setSelectedNote(note)
    setDeleteModalOpen(true)
  }

  const handleCloseNoteModal = () => {
    setNoteModalOpen(false)
    setSelectedNote(null)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedNote(null)
  }

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

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onNewNote={handleNewNote} />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="pt-16 lg:pt-0">
            <NotesGrid onEdit={handleEditNote} onDelete={handleDeleteNote} />
          </div>
        </main>
      </div>

      <NoteModal isOpen={noteModalOpen} onClose={handleCloseNoteModal} note={selectedNote} />

      <DeleteModal isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} note={selectedNote} />
    </div>
  )
}
