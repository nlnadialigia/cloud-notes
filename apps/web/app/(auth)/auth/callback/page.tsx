'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { setCookie } from '@/lib/cookies'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      router.push('/login?error=oauth_failed')
      return
    }

    if (!code) {
      router.push('/login')
      return
    }

    // Trocar code por tokens
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          localStorage.setItem('token', data.data.accessToken)
          localStorage.setItem('refreshToken', data.data.refreshToken)
          setCookie('token', data.data.accessToken, 7)
          setCookie('refreshToken', data.data.refreshToken, 7)
          router.push('/dashboard')
        } else {
          router.push('/login?error=oauth_failed')
        }
      })
      .catch(() => {
        router.push('/login?error=oauth_failed')
      })
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-rose-500" />
        <p className="mt-4 text-sm text-muted-foreground">Autenticando...</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
