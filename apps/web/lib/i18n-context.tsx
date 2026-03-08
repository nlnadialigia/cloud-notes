'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'pt-BR' | 'en'

const translations = {
  'pt-BR': {
    // Common
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    search: 'Buscar',
    loading: 'Carregando...',

    // Auth
    login: 'Entrar',
    signup: 'Cadastrar',
    logout: 'Sair',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem uma conta?',
    hasAccount: 'Já tem uma conta?',

    // Profile
    profile: 'Perfil',
    personalInfo: 'Informações Pessoais',
    updateProfileData: 'Atualize seus dados de perfil',
    name: 'Nome',
    yourName: 'Seu nome',
    emailCannotBeChanged: 'O email não pode ser alterado',
    memberSince: 'Membro desde',
    changePassword: 'Alterar Senha',
    updateYourPassword: 'Atualize sua senha de acesso',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    enterCurrentPassword: 'Digite sua senha atual',
    enterNewPassword: 'Digite a nova senha',
    confirmNewPassword: 'Confirme a nova senha',
    updatePassword: 'Atualizar senha',
    dangerZone: 'Zona de Perigo',
    irreversibleActions: 'Ações irreversíveis na sua conta',
    deleteAccount: 'Deletar conta',
    deleteAccountWarning: 'Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.',
    areYouSure: 'Tem certeza?',
    deleteAccountConfirmation: 'Esta ação não pode ser desfeita. Sua conta e todas as suas notas serão permanentemente deletadas.',
    yesDeleteAccount: 'Sim, deletar minha conta',
    managePersonalInfo: 'Gerencie suas informações pessoais',
    profileUpdated: 'Perfil atualizado com sucesso!',
    profileUpdateError: 'Erro ao atualizar perfil',
    passwordUpdated: 'Senha atualizada com sucesso!',
    passwordUpdateError: 'Erro ao atualizar senha',
    passwordsDontMatch: 'As senhas não coincidem',
    passwordTooShort: 'A senha deve ter no mínimo 8 caracteres',
    accountDeleted: 'Conta deletada com sucesso',
    accountDeleteError: 'Erro ao deletar conta',

    // Dashboard
    allNotes: 'Todas as notas',
    activeNotes: 'Ativas',
    archivedNotes: 'Arquivadas',
    newNote: 'Nova Nota',
    searchNotes: 'Buscar notas...',
    noNotesFound: 'Nenhuma nota encontrada',
    noNotesYet: 'Você ainda não tem notas',
    createFirstNote: 'Crie sua primeira nota para começar',

    // Note
    noteTitle: 'Título',
    noteContent: 'Conteúdo',
    createNote: 'Criar Nota',
    editNote: 'Editar nota',
    deleteNote: 'Excluir nota',
    archiveNote: 'Arquivar',
    unarchiveNote: 'Desarquivar',
    deleteConfirmTitle: 'Excluir nota',
    deleteConfirmMessage: 'Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.',
    noteTitlePlaceholder: 'Digite o título da nota',
    noteContentPlaceholder: 'Digite o conteúdo da nota (opcional)',
    titleRequired: 'O título é obrigatório',
    saveError: 'Erro ao salvar nota',
    saving: 'Salvando...',
    saveChanges: 'Salvar alterações',
    newNoteDescription: 'Preencha os campos abaixo para criar uma nova nota',
    editNoteDescription: 'Faça as alterações desejadas e salve',
    noContent: 'Nota sem conteúdo',
    today: 'Hoje',
    yesterday: 'Ontem',
    daysAgo: 'dias atrás',
    noteFound: 'nota encontrada',
    notesFound: 'notas encontradas',
    searchOtherTerms: 'Tente buscar por outros termos',
    noArchivedNotes: 'Você não tem notas arquivadas',
    clickNewNote: "Crie sua primeira nota clicando no botão 'Nova Nota'",
    deleting: 'Excluindo...',

    // Settings
    settings: 'Configurações',
    appearance: 'Aparência',
    theme: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Escuro',
    themeSystem: 'Sistema',
    language: 'Idioma',
    languagePtBr: 'Português (Brasil)',
    languageEn: 'English',
    shortPtBr: 'PT-BR',
    shortEn: 'EN',
    account: 'Conta',
    activeAccount: 'Conta ativa',

    // Header
    cloudNotes: 'CloudNotes',

    // Palette
    colorPalette: 'Paleta de cores',
    colorPaletteDescription: 'Escolha a cor principal da interface',
    paletteIndigo: 'Indigo',
    paletteEmerald: 'Esmeralda',
    paletteRose: 'Rosa',
    paletteAmber: 'Âmbar',
    paletteSlate: 'Cinza',
    paletteCyan: 'Ciano',
    palettePurple: 'Roxo',
    paletteStone: 'Pedra',

    // Settings descriptions
    themeLightDesc: 'Tema claro para ambientes iluminados',
    themeDarkDesc: 'Tema escuro para reduzir cansaço visual',
    themeSystemDesc: 'Segue as configurações do sistema',
    managePreferences: 'Gerencie suas preferências',
    accountInfo: 'Informações da sua conta',
    customizeAppearance: 'Personalize a aparência do CloudNotes',
    chooseLanguage: 'Escolha o idioma da interface',
    interfacePtBr: 'Interface em português brasileiro',
    interfaceEn: 'Interface in English',

    // Home page
    homeHero: 'Suas notas na nuvem, sempre acessíveis',
    homeDescription:
      'CloudNotes é uma aplicação de gerenciamento de notas pessoais construída como laboratório de aprendizado em AWS, explorando arquitetura serverless, infraestrutura como código e CI/CD.',
    homeGetStarted: 'Começar agora',
    homeViewGithub: 'Ver no GitHub',
    homeAwsTech: 'Tecnologias AWS utilizadas',
    homeCognito: 'Autenticação segura com JWT, registro de usuários e confirmação por email',
    homeDynamoDB: 'Banco NoSQL serverless para persistência de dados com alta disponibilidade',
    homeRDS: 'Banco relacional gerenciado como alternativa SQL ao DynamoDB',
    homeLambda: 'Backend serverless com escalabilidade automática e baixo custo',
    homeArchitecture: 'Arquitetura',
    homeFrontend: 'Frontend',
    homeBackend: 'Backend',
    homePersistence: 'Persistência',
    homeReady: 'Pronto para começar?',
    homeReadyDesc: 'Crie sua conta gratuitamente e comece a organizar suas notas na nuvem.',
    homeCreateAccount: 'Criar conta gratuita',
    homeFooter: 'CloudNotes - Projeto educacional para aprendizado AWS',
    homeEducational: 'Projeto educacional AWS',
    homeSignIn: 'Entrar',
    homeSignUp: 'Criar conta',
  },
  en: {
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    loading: 'Loading...',

    // Auth
    login: 'Login',
    signup: 'Sign up',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',

    // Profile
    profile: 'Profile',
    personalInfo: 'Personal Information',
    updateProfileData: 'Update your profile data',
    name: 'Name',
    yourName: 'Your name',
    emailCannotBeChanged: 'Email cannot be changed',
    memberSince: 'Member since',
    changePassword: 'Change Password',
    updateYourPassword: 'Update your access password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    enterCurrentPassword: 'Enter your current password',
    enterNewPassword: 'Enter new password',
    confirmNewPassword: 'Confirm new password',
    updatePassword: 'Update password',
    dangerZone: 'Danger Zone',
    irreversibleActions: 'Irreversible actions on your account',
    deleteAccount: 'Delete account',
    deleteAccountWarning: 'This action cannot be undone. All your data will be permanently removed.',
    areYouSure: 'Are you sure?',
    deleteAccountConfirmation: 'This action cannot be undone. Your account and all your notes will be permanently deleted.',
    yesDeleteAccount: 'Yes, delete my account',
    managePersonalInfo: 'Manage your personal information',
    profileUpdated: 'Profile updated successfully!',
    profileUpdateError: 'Error updating profile',
    passwordUpdated: 'Password updated successfully!',
    passwordUpdateError: 'Error updating password',
    passwordsDontMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 8 characters',
    accountDeleted: 'Account deleted successfully',
    accountDeleteError: 'Error deleting account',

    // Dashboard
    allNotes: 'All notes',
    activeNotes: 'Active',
    archivedNotes: 'Archived',
    newNote: 'New Note',
    searchNotes: 'Search notes...',
    noNotesFound: 'No notes found',
    noNotesYet: "You don't have any notes yet",
    createFirstNote: 'Create your first note to get started',

    // Note
    noteTitle: 'Title',
    noteContent: 'Content',
    createNote: 'Create Note',
    editNote: 'Edit note',
    deleteNote: 'Delete note',
    archiveNote: 'Archive',
    unarchiveNote: 'Unarchive',
    deleteConfirmTitle: 'Delete note',
    deleteConfirmMessage: 'Are you sure you want to delete this note? This action cannot be undone.',
    noteTitlePlaceholder: 'Enter note title',
    noteContentPlaceholder: 'Enter note content (optional)',
    titleRequired: 'Title is required',
    saveError: 'Error saving note',
    saving: 'Saving...',
    saveChanges: 'Save changes',
    newNoteDescription: 'Fill in the fields below to create a new note',
    editNoteDescription: 'Make your changes and save',
    noContent: 'No content',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    noteFound: 'note found',
    notesFound: 'notes found',
    searchOtherTerms: 'Try searching for other terms',
    noArchivedNotes: "You don't have any archived notes",
    clickNewNote: "Create your first note by clicking 'New Note'",
    deleting: 'Deleting...',

    // Settings
    settings: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    language: 'Language',
    languagePtBr: 'Português (Brasil)',
    languageEn: 'English',
    shortPtBr: 'PT-BR',
    shortEn: 'EN',
    account: 'Account',
    activeAccount: 'Active account',

    // Header
    cloudNotes: 'CloudNotes',

    // Palette
    colorPalette: 'Color palette',
    colorPaletteDescription: 'Choose the main color of the interface',
    paletteIndigo: 'Indigo',
    paletteEmerald: 'Emerald',
    paletteRose: 'Rose',
    paletteAmber: 'Amber',
    paletteSlate: 'Slate',
    paletteCyan: 'Cyan',
    palettePurple: 'Purple',
    paletteStone: 'Stone',

    // Settings descriptions
    themeLightDesc: 'Light theme for bright environments',
    themeDarkDesc: 'Dark theme to reduce eye strain',
    themeSystemDesc: 'Follows system settings',
    managePreferences: 'Manage your preferences',
    accountInfo: 'Your account information',
    customizeAppearance: 'Customize the appearance of CloudNotes',
    chooseLanguage: 'Choose the interface language',
    interfacePtBr: 'Interface em português brasileiro',
    interfaceEn: 'Interface in English',

    // Home page
    homeHero: 'Your notes in the cloud, always accessible',
    homeDescription:
      'CloudNotes is a personal note management application built as an AWS learning lab, exploring serverless architecture, infrastructure as code, and CI/CD.',
    homeGetStarted: 'Get started',
    homeViewGithub: 'View on GitHub',
    homeAwsTech: 'AWS Technologies Used',
    homeCognito: 'Secure authentication with JWT, user registration and email confirmation',
    homeDynamoDB: 'Serverless NoSQL database for data persistence with high availability',
    homeRDS: 'Managed relational database as SQL alternative to DynamoDB',
    homeLambda: 'Serverless backend with automatic scalability and low cost',
    homeArchitecture: 'Architecture',
    homeFrontend: 'Frontend',
    homeBackend: 'Backend',
    homePersistence: 'Persistence',
    homeReady: 'Ready to get started?',
    homeReadyDesc: 'Create your free account and start organizing your notes in the cloud.',
    homeCreateAccount: 'Create free account',
    homeFooter: 'CloudNotes - Educational project for AWS learning',
    homeEducational: 'AWS educational project',
    homeSignIn: 'Sign in',
    homeSignUp: 'Sign up',
  },
} as const

type TranslationKey = keyof (typeof translations)['pt-BR']

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt-BR')

  useEffect(() => {
    const stored = localStorage.getItem('cloudnotes-locale') as Locale | null
    if (stored && (stored === 'pt-BR' || stored === 'en')) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('cloudnotes-locale', newLocale)
  }

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
