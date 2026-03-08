import { Module } from '@nestjs/common'
import { DynamoModule } from './dynamo/dynamo.module'
import { AuthModule } from './modules/auth/auth.module'
import { NotesModule } from './modules/notes/notes.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [PrismaModule, DynamoModule, AuthModule, NotesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
