import { Injectable, NotFoundException } from '@nestjs/common'
import { NotesNoSqlRepository } from './notes-nosql.repository'

@Injectable()
export class NotesNoSqlService {
  constructor(private repository: NotesNoSqlRepository) {}

  async create(userId: string, title: string, content: string) {
    return this.repository.create(userId, title, content)
  }

  async findAll(userId: string, status?: string) {
    return this.repository.findByUser(userId, status)
  }

  async findOne(userId: string, noteId: string) {
    const note = await this.repository.findById(userId, noteId)
    if (!note) throw new NotFoundException('Note not found')
    return note
  }

  async update(userId: string, noteId: string, data: { title?: string; content?: string; status?: string }) {
    const note = await this.repository.findById(userId, noteId)
    if (!note) throw new NotFoundException('Note not found')
    return this.repository.update(userId, noteId, data)
  }

  async archive(userId: string, noteId: string) {
    return this.update(userId, noteId, { status: 'archived' })
  }

  async unarchive(userId: string, noteId: string) {
    return this.update(userId, noteId, { status: 'active' })
  }

  async delete(userId: string, noteId: string) {
    const note = await this.repository.findById(userId, noteId)
    if (!note) throw new NotFoundException('Note not found')
    await this.repository.delete(userId, noteId)
  }
}
