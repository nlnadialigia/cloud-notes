'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, AuthState, LoginCredentials, SignUpCredentials, ConfirmSignUpInput } from './types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  confirmSignUp: (input: ConfirmSignUpInput) => Promise<void>
  logout: () => void
  resendConfirmationCode: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock de autenticação - será substituído por AWS Cognito
const MOCK_USERS: Map<string, { password: string; confirmed: boolean; user: User }> = new Map()

// MODO DESENVOLVIMENTO: Define como true para pular autenticação
const DEV_MODE_SKIP_AUTH = true

const DEV_USER: User = {
  id: 'dev_user_001',
  email: 'dev@cloudnotes.com',
  createdAt: new Date(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: DEV_MODE_SKIP_AUTH ? DEV_USER : null,
    isLoading: false,
    isAuthenticated: DEV_MODE_SKIP_AUTH,
  })

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const storedUser = MOCK_USERS.get(credentials.email)

    if (!storedUser) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Usuário não encontrado')
    }

    if (!storedUser.confirmed) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Email não confirmado')
    }

    if (storedUser.password !== credentials.password) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Senha incorreta')
    }

    setAuthState({
      user: storedUser.user,
      isLoading: false,
      isAuthenticated: true,
    })

    // Armazena token (simulado)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cloudnotes_token', `mock_jwt_${storedUser.user.id}`)
    }
  }, [])

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.password !== credentials.confirmPassword) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('As senhas não coincidem')
    }

    if (credentials.password.length < 8) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('A senha deve ter pelo menos 8 caracteres')
    }

    if (MOCK_USERS.has(credentials.email)) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Este email já está cadastrado')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      createdAt: new Date(),
    }

    MOCK_USERS.set(credentials.email, {
      password: credentials.password,
      confirmed: false,
      user: newUser,
    })

    setAuthState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const confirmSignUp = useCallback(async (input: ConfirmSignUpInput) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const storedUser = MOCK_USERS.get(input.email)

    if (!storedUser) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Usuário não encontrado')
    }

    // Mock: aceita qualquer código de 6 dígitos
    if (input.code.length !== 6) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw new Error('Código inválido')
    }

    storedUser.confirmed = true
    MOCK_USERS.set(input.email, storedUser)

    setAuthState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })

    if (typeof window !== 'undefined') {
      localStorage.removeItem('cloudnotes_token')
    }
  }, [])

  const resendConfirmationCode = useCallback(async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!MOCK_USERS.has(email)) {
      throw new Error('Email não encontrado')
    }

    // Mock: apenas simula o envio
    console.log(`[Mock] Código de confirmação enviado para ${email}`)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signUp,
        confirmSignUp,
        logout,
        resendConfirmationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
