// Re-export types do package compartilhado
export * from '@cloud-notes/types'

// Types específicos do frontend (Cognito)
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

// Import User para usar no AuthState
import type { User } from '@cloud-notes/types'
