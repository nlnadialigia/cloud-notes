import { Injectable } from '@nestjs/common'
import { UsersSqlRepository } from './users-sql.repository'
import { UsersNoSqlRepository } from './users-nosql.repository'

@Injectable()
export class UsersService {
  constructor(
    private sqlRepo: UsersSqlRepository,
    private nosqlRepo: UsersNoSqlRepository,
  ) {}

  private getDbType() {
    return process.env.DB_TYPE || 'nosql'
  }

  async findOrCreateUser(cognitoId: string, email: string, name: string) {
    const dbType = this.getDbType()

    if (dbType === 'both') {
      const [sqlUser, nosqlUser] = await Promise.all([
        this.findOrCreateSql(cognitoId, email, name),
        this.findOrCreateNoSql(cognitoId, email, name),
      ])
      return { sql: sqlUser, nosql: nosqlUser }
    }

    return dbType === 'sql'
      ? this.findOrCreateSql(cognitoId, email, name)
      : this.findOrCreateNoSql(cognitoId, email, name)
  }

  private async findOrCreateSql(cognitoId: string, email: string, name: string) {
    let user = await this.sqlRepo.findByCognitoId(cognitoId)
    if (!user) {
      user = await this.sqlRepo.create(cognitoId, email, name)
    }
    return user
  }

  private async findOrCreateNoSql(cognitoId: string, email: string, name: string) {
    let user = await this.nosqlRepo.findByCognitoId(cognitoId)
    if (!user) {
      user = await this.nosqlRepo.create(cognitoId, email, name)
    }
    return user
  }
}
