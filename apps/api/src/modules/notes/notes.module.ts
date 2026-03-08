import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { NotesNoSqlRepository } from './notes-nosql.repository'
import { NotesNoSqlService } from './notes-nosql.service'
import { NotesSqlRepository } from './notes-sql.repository'
import { NotesSqlService } from './notes-sql.service'
import { NotesController } from './notes.controller'
import { PrismaModule } from '../../prisma/prisma.module'
import { DynamoModule } from '../../dynamo/dynamo.module'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
    PrismaModule,
    DynamoModule,
  ],
  controllers: [NotesController],
  providers: [NotesSqlService, NotesNoSqlService, NotesSqlRepository, NotesNoSqlRepository],
})
export class NotesModule {}
