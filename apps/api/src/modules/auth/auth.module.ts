import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { CognitoService } from './cognito.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [CognitoService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
