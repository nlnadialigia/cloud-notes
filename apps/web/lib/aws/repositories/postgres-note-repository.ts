/**
 * Implementação PostgreSQL do Repositório de Notas
 *
 * Esta implementação usa AWS RDS PostgreSQL para persistência SQL.
 *
 * Schema SQL:
 * CREATE TABLE notes (
 *   id VARCHAR(50) PRIMARY KEY,
 *   user_id VARCHAR(50) NOT NULL,
 *   title VARCHAR(255) NOT NULL,
 *   content TEXT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   archived BOOLEAN DEFAULT FALSE
 * );
 *
 * CREATE INDEX idx_notes_user_id ON notes(user_id);
 * CREATE INDEX idx_notes_user_archived ON notes(user_id, archived);
 *
 * Para usar em produção:
 * 1. Configure as variáveis de ambiente do RDS
 * 2. Instale o driver: npm install pg @types/pg
 * 3. Remova os comentários do código abaixo
 */

import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter } from '@/lib/types'
import type { NoteRepository } from './note-repository'
import { awsConfig } from '../config'

// TODO: Descomente quando integrar com AWS
// import { Pool } from "pg"

export class PostgresNoteRepository implements NoteRepository {
  // private pool: Pool

  constructor() {
    // TODO: Descomente quando integrar com AWS
    // this.pool = new Pool({
    //   host: awsConfig.rds.host,
    //   port: awsConfig.rds.port,
    //   database: awsConfig.rds.database,
    //   user: awsConfig.rds.username,
    //   password: awsConfig.rds.password,
    //   ssl: { rejectUnauthorized: false },
    // })
  }

  async create(userId: string, input: CreateNoteInput): Promise<Note> {
    const now = new Date()
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // TODO: Descomente quando integrar com AWS
    // const query = `
    //   INSERT INTO notes (id, user_id, title, content, created_at, updated_at, archived)
    //   VALUES ($1, $2, $3, $4, $5, $6, $7)
    //   RETURNING *
    // `
    // const values = [noteId, userId, input.title, input.content || "", now, now, false]
    // const result = await this.pool.query(query, values)
    // return this.mapRowToNote(result.rows[0])

    const note: Note = {
      id: noteId,
      userId,
      title: input.title,
      content: input.content || '',
      createdAt: now,
      updatedAt: now,
      archived: false,
    }

    console.log('[PostgreSQL Mock] Nota criada:', note)
    return note
  }

  async findById(userId: string, noteId: string): Promise<Note | null> {
    // TODO: Descomente quando integrar com AWS
    // const query = `
    //   SELECT * FROM notes
    //   WHERE id = $1 AND user_id = $2
    // `
    // const result = await this.pool.query(query, [noteId, userId])
    // return result.rows[0] ? this.mapRowToNote(result.rows[0]) : null

    console.log('[PostgreSQL Mock] Buscando nota:', noteId)
    return null
  }

  async findByUser(userId: string, filter?: NoteFilter): Promise<Note[]> {
    // TODO: Descomente quando integrar com AWS
    // let query = `
    //   SELECT * FROM notes
    //   WHERE user_id = $1
    // `
    // const values: any[] = [userId]
    //
    // if (filter === "archived") {
    //   query += " AND archived = true"
    // } else if (filter === "active") {
    //   query += " AND archived = false"
    // }
    //
    // query += " ORDER BY created_at DESC"
    //
    // const result = await this.pool.query(query, values)
    // return result.rows.map(this.mapRowToNote)

    console.log('[PostgreSQL Mock] Listando notas do usuário:', userId, 'filtro:', filter)
    return []
  }

  async update(userId: string, noteId: string, input: UpdateNoteInput): Promise<Note> {
    const now = new Date()

    // TODO: Descomente quando integrar com AWS
    // const updates: string[] = ["updated_at = $3"]
    // const values: any[] = [noteId, userId, now]
    // let paramCount = 3
    //
    // if (input.title !== undefined) {
    //   paramCount++
    //   updates.push(`title = $${paramCount}`)
    //   values.push(input.title)
    // }
    // if (input.content !== undefined) {
    //   paramCount++
    //   updates.push(`content = $${paramCount}`)
    //   values.push(input.content)
    // }
    // if (input.archived !== undefined) {
    //   paramCount++
    //   updates.push(`archived = $${paramCount}`)
    //   values.push(input.archived)
    // }
    //
    // const query = `
    //   UPDATE notes
    //   SET ${updates.join(", ")}
    //   WHERE id = $1 AND user_id = $2
    //   RETURNING *
    // `
    //
    // const result = await this.pool.query(query, values)
    // if (!result.rows[0]) throw new Error("Nota não encontrada")
    // return this.mapRowToNote(result.rows[0])

    console.log('[PostgreSQL Mock] Nota atualizada:', noteId, input)
    return {
      id: noteId,
      userId,
      title: input.title || '',
      content: input.content || '',
      createdAt: now,
      updatedAt: now,
      archived: input.archived || false,
    }
  }

  async delete(userId: string, noteId: string): Promise<void> {
    // TODO: Descomente quando integrar com AWS
    // const query = `
    //   DELETE FROM notes
    //   WHERE id = $1 AND user_id = $2
    // `
    // await this.pool.query(query, [noteId, userId])

    console.log('[PostgreSQL Mock] Nota excluída:', noteId)
  }

  async archive(userId: string, noteId: string): Promise<void> {
    await this.update(userId, noteId, { archived: true })
  }

  async unarchive(userId: string, noteId: string): Promise<void> {
    await this.update(userId, noteId, { archived: false })
  }

  // private mapRowToNote(row: any): Note {
  //   return {
  //     id: row.id,
  //     userId: row.user_id,
  //     title: row.title,
  //     content: row.content,
  //     createdAt: new Date(row.created_at),
  //     updatedAt: new Date(row.updated_at),
  //     archived: row.archived,
  //   }
  // }
}
