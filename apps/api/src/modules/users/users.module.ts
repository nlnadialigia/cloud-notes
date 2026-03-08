import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersNoSqlRepository } from './users-nosql.repository'
import { UsersSqlRepository } from './users-sql.repository'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { PrismaModule } from '../../prisma/prisma.module'
import { DynamoModule } from '../../dynamo/dynamo.module'
import { CognitoService } from '../auth/cognito.service'

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
    }),
    PrismaModule,
    DynamoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersSqlRepository, UsersNoSqlRepository, CognitoService],
  exports: [UsersService],
})
export class UsersModule {}
