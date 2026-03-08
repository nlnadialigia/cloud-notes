import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notesService } from '@/lib/services/notes.service'
import type { CreateNoteInput, UpdateNoteInput } from '@/lib/types'

export function useNotesQuery(status?: string) {
  return useQuery({
    queryKey: ['notes', status],
    queryFn: () => notesService.getNotes(status),
  })
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateNoteInput) => notesService.createNote(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNoteInput }) => notesService.updateNote(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notesService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export function useArchiveNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notesService.archiveNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' })
    },
  })
}

export function useUnarchiveNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => notesService.unarchiveNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], refetchType: 'all' })
    },
  })
}
