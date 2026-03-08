'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User, AuthState, LoginCredentials, SignUpCredentials, ConfirmSignUpInput } from './types'
import { authService } from './services/auth.service'
import { setCookie, getCookie, deleteCookie } from './cookies'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: SignUpCredentials) => Promise<void>
  confirmSignUp: (input: ConfirmSignUpInput) => Promise<void>
  logout: () => void
  resendConfirmationCode: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('token') || getCookie('token')
    if (token) {
      authService
        .getProfile()
        .then((user) => {
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          })
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          deleteCookie('token')
          deleteCookie('refreshToken')
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          })
        })
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await authService.login(credentials)
      
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      setCookie('token', response.accessToken, 7)
      setCookie('refreshToken', response.refreshToken, 7)

      setAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      await authService.register({
        name: credentials.email.split('@')[0],
        email: credentials.email,
        password: credentials.password,
      })

      // Não faz login automático - usuário precisa confirmar email primeiro
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const confirmSignUp = useCallback(async (input: ConfirmSignUpInput) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAuthState((prev) => ({ ...prev, isLoading: false }))
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    deleteCookie('token')
    deleteCookie('refreshToken')
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  const resendConfirmationCode = useCallback(async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
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
