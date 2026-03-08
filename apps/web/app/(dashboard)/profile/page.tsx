'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import { userService } from '@/lib/services/user.service'
import { ChevronLeft, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/lib/i18n-context'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userService.updateProfile({ name })
      toast.success(t('profileUpdated'))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('profileUpdateError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordsDontMatch'))
      return
    }

    if (newPassword.length < 8) {
      toast.error(t('passwordTooShort'))
      return
    }

    setIsLoading(true)

    try {
      await userService.updatePassword({ currentPassword, newPassword })
      toast.success(t('passwordUpdated'))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('passwordUpdateError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    try {
      await userService.deleteAccount()
      toast.success(t('accountDeleted'))
      logout()
      router.push('/')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('accountDeleteError'))
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('profile')}</h1>
            <p className="text-muted-foreground">{t('managePersonalInfo')}</p>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('personalInfo')}</CardTitle>
            <CardDescription>{t('updateProfileData')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">{t('emailCannotBeChanged')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('yourName')}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('memberSince')}</Label>
                <Input
                  type="text"
                  value={new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  t('saveChanges')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>{t('changePassword')}</CardTitle>
            <CardDescription>{t('updateYourPassword')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t('enterCurrentPassword')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('newPassword')}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('enterNewPassword')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('confirmNewPassword')}
                />
              </div>

              <Button type="submit" disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : (
                  t('updatePassword')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
            <CardDescription>{t('irreversibleActions')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t('deleteAccount')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('deleteAccountWarning')}
                </p>
              </div>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('delete')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('areYouSure')}</DialogTitle>
            <DialogDescription>
              {t('deleteAccountConfirmation')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('deleting')}
                </>
              ) : (
                t('yesDeleteAccount')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
