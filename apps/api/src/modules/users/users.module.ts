import { Global, Module } from '@nestjs/common'
import { UsersNoSqlRepository } from './users-nosql.repository'
import { UsersSqlRepository } from './users-sql.repository'
import { UsersService } from './users.service'

@Global()
@Module({
  imports: [],
  providers: [UsersService, UsersSqlRepository, UsersNoSqlRepository],
  exports: [UsersService],
})
export class UsersModule {}
