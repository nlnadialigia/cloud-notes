import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UsersSqlRepository {
  constructor(private prisma: PrismaService) {}

  async findByCognitoId(cognitoId: string) {
    return this.prisma.user.findUnique({ where: { id: cognitoId } })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async create(cognitoId: string, email: string, name: string) {
    return this.prisma.user.create({
      data: { id: cognitoId, email, name },
    })
  }

  async update(id: string, data: { name?: string; avatar?: string; preferences?: any }) {
    return this.prisma.user.update({
      where: { id },
      data,
    })
  }
}
