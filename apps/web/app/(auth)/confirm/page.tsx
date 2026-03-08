'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Cloud, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { useAuth } from '@/lib/auth-context'

function ConfirmForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email') || ''

  const { confirmSignUp, resendConfirmationCode, isLoading } = useAuth()
  const [email, setEmail] = useState(emailFromUrl)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await confirmSignUp({ email, code })
      router.push('/login?confirmed=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao confirmar email')
    }
  }

  const handleResend = async () => {
    setError('')
    setResendSuccess(false)

    try {
      await resendConfirmationCode(email)
      setResendSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reenviar código')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Cloud className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">CloudNotes</span>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-card-foreground">Confirme seu email</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enviamos um código de 6 dígitos para seu email. Digite-o abaixo para confirmar sua conta.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="code">Código de confirmação</FieldLabel>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground text-center text-2xl tracking-widest font-mono"
                  />
                </Field>

                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                {resendSuccess && (
                  <div className="text-sm text-primary bg-primary/10 p-3 rounded-md">Código reenviado com sucesso!</div>
                )}
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  'Confirmar email'
                )}
              </Button>

              <div className="flex items-center justify-between w-full text-sm">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || !email}
                  className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reenviar código
                </button>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Voltar ao login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Use o código 123456 para teste (ambiente de desenvolvimento)
        </p>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmForm />
    </Suspense>
  )
}
