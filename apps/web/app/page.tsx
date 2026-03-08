'use client'

import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n-context'
import { useTheme } from '@/lib/theme-context'
import { ArrowRight, Cloud, Database, Shield, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const { t } = useI18n()
  const { resolvedTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">{t('cloudNotes')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Header />
            <Link href="/login">
              <Button variant="ghost">{t('homeSignIn')}</Button>
            </Link>
            <Link href="/signup">
              <Button>{t('homeSignUp')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <Zap className="h-4 w-4" />
            {t('homeEducational')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{t('homeHero')}</h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">{t('homeDescription')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                {t('homeGetStarted')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://github.com/nlnadialigia/cloud-notes" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <Image
                  src={resolvedTheme === 'dark' ? '/github-white.svg' : '/github-black.svg'}
                  alt="GitHub"
                  width={16}
                  height={16}
                />
                {t('homeViewGithub')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-foreground mb-12">{t('homeAwsTech')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Cognito</CardTitle>
                <CardDescription className="text-muted-foreground">{t('homeCognito')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-card-foreground">DynamoDB</CardTitle>
                <CardDescription className="text-muted-foreground">{t('homeDynamoDB')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Database className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-card-foreground">RDS PostgreSQL</CardTitle>
                <CardDescription className="text-muted-foreground">{t('homeRDS')}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-card-foreground">Lambda + API Gateway</CardTitle>
                <CardDescription className="text-muted-foreground">{t('homeLambda')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">{t('homeArchitecture')}</h2>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">{t('homeFrontend')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Next.js</li>
                    <li>S3 + CloudFront</li>
                    <li>Tailwind CSS</li>
                  </ul>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">{t('homeBackend')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>AWS Lambda</li>
                    <li>API Gateway</li>
                    <li>Node.js</li>
                  </ul>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-2">{t('homePersistence')}</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>DynamoDB (NoSQL)</li>
                    <li>RDS PostgreSQL (SQL)</li>
                    <li>Repository Pattern</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t('homeReady')}</h2>
          <p className="text-muted-foreground mb-8">{t('homeReadyDesc')}</p>
          <Link href="/signup">
            <Button size="lg">{t('homeCreateAccount')}</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">{t('homeFooter')}</p>
        </div>
      </footer>
    </div>
  )
}
