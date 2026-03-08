import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DynamoModule } from './dynamo/dynamo.module'
import { AuthModule } from './modules/auth/auth.module'
import { NotesModule } from './modules/notes/notes.module'
import { PrismaModule } from './prisma/prisma.module'
import { LoggerModule } from './common/logger'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    PrismaModule,
    DynamoModule,
    AuthModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
