// Tipos de dados do CloudNotes

export interface User {
  id: string
  email: string
  createdAt: Date
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  archived: boolean
}

export interface CreateNoteInput {
  title: string
  content?: string
}

export interface UpdateNoteInput {
  title?: string
  content?: string
  archived?: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  confirmPassword: string
}

export interface ConfirmSignUpInput {
  email: string
  code: string
}

// Filtros para listagem de notas
export type NoteFilter = 'all' | 'archived' | 'active'

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
