import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class NotesSqlRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, title: string, content: string) {
    return this.prisma.note.create({
      data: { userId, title, content, status: 'active' },
    })
  }

  async findByUser(userId: string, status?: string) {
    return this.prisma.note.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(userId: string, noteId: string) {
    return this.prisma.note.findFirst({
      where: { id: noteId, userId },
    })
  }

  async update(userId: string, noteId: string, data: { title?: string; content?: string; status?: string }) {
    return this.prisma.note.update({
      where: { id: noteId, userId },
      data,
    })
  }

  async delete(userId: string, noteId: string) {
    await this.prisma.note.delete({
      where: { id: noteId, userId },
    })
  }
}
