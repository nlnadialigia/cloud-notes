/**
 * Interface do Repositório de Notas
 *
 * Esta interface define o contrato para operações de CRUD de notas.
 * Será implementada por:
 * - DynamoNoteRepository (NoSQL)
 * - PostgresNoteRepository (SQL)
 *
 * Objetivo: Permitir trocar o banco sem alterar regras de negócio.
 */

import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter } from '@/lib/types'

export interface NoteRepository {
  /**
   * Cria uma nova nota
   * @param userId - ID do usuário dono da nota
   * @param input - Dados da nota (título, conteúdo)
   * @returns A nota criada
   */
  create(userId: string, input: CreateNoteInput): Promise<Note>

  /**
   * Busca uma nota por ID
   * @param userId - ID do usuário (para validação de propriedade)
   * @param noteId - ID da nota
   * @returns A nota encontrada ou null
   */
  findById(userId: string, noteId: string): Promise<Note | null>

  /**
   * Lista notas de um usuário
   * @param userId - ID do usuário
   * @param filter - Filtro (all, archived, active)
   * @returns Lista de notas ordenadas por createdAt DESC
   */
  findByUser(userId: string, filter?: NoteFilter): Promise<Note[]>

  /**
   * Atualiza uma nota
   * @param userId - ID do usuário (para validação de propriedade)
   * @param noteId - ID da nota
   * @param input - Campos a atualizar
   * @returns A nota atualizada
   */
  update(userId: string, noteId: string, input: UpdateNoteInput): Promise<Note>

  /**
   * Exclui uma nota (exclusão física)
   * @param userId - ID do usuário (para validação de propriedade)
   * @param noteId - ID da nota
   */
  delete(userId: string, noteId: string): Promise<void>

  /**
   * Arquiva uma nota
   * @param userId - ID do usuário
   * @param noteId - ID da nota
   */
  archive(userId: string, noteId: string): Promise<void>

  /**
   * Desarquiva uma nota
   * @param userId - ID do usuário
   * @param noteId - ID da nota
   */
  unarchive(userId: string, noteId: string): Promise<void>
}
