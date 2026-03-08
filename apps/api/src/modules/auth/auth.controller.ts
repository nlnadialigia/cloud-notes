import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { UsersService } from '../users/users.service'
import { CognitoService } from './cognito.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LoggerService } from '../../common/logger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private cognitoService: CognitoService,
    private usersService: UsersService,
    private logger: LoggerService,
    private configService: ConfigService,
  ) {
    this.logger.setContext('AuthController')
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with AWS Cognito' })
  async register(@Body() dto: RegisterDto) {
    try {
      this.logger.log(`Registering user: ${dto.email}`)
      
      const result = await this.cognitoService.signUp(dto.name, dto.email, dto.password)
      
      if (!result.UserSub) {
        this.logger.error('User registration failed - no UserSub returned')
        throw new Error('User registration failed')
      }
      
      this.logger.log(`Cognito user created: ${result.UserSub}`)
      
      // Auto-confirmar em desenvolvimento
      const autoConfirm = this.configService.get('AUTO_CONFIRM_USER', 'false') === 'true'
      if (autoConfirm) {
        this.logger.log(`Auto-confirming user: ${dto.email}`)
        await this.cognitoService.adminConfirmUser(dto.email)
        this.logger.log(`User auto-confirmed: ${dto.email}`)
      }
      
      // Criar usuário no banco
      const user = await this.usersService.findOrCreateUser(result.UserSub, dto.email, dto.name)
      
      // Se DB_TYPE=both, user é { sql, nosql }
      const userData = (user as any).sql || user
      
      this.logger.log(`User created in database: ${userData.id}`)
      
      return { 
        success: true, 
        message: autoConfirm 
          ? 'User registered and confirmed successfully' 
          : 'User registered successfully. Please check your email to confirm your account.',
        data: {
          userConfirmed: autoConfirm || result.UserConfirmed || false,
          email: dto.email,
        },
      }
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`, error.stack)
      throw error
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with AWS Cognito' })
  async login(@Body() dto: LoginDto) {
    const result = await this.cognitoService.login(dto.email, dto.password)

    // Extrair dados do token
    const idToken = result.AuthenticationResult?.IdToken
    if (!idToken) throw new Error('No ID token received')

    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())

    // Sincronizar usuário no banco
    const user = await this.usersService.findOrCreateUser(payload.sub, payload.email, payload.name)
    const userData = (user as any).sql || user

    return {
      success: true,
      data: {
        accessToken: idToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          createdAt: userData.createdAt,
        },
      },
    }
  }

  @Get('callback')
  @ApiOperation({ summary: 'OAuth callback handler' })
  async callback(@Query('code') code: string) {
    if (!code) {
      throw new Error('No authorization code provided')
    }

    const tokens = await this.cognitoService.exchangeCodeForTokens(code)
    
    // Extrair dados do token
    const idToken = tokens.id_token
    if (!idToken) throw new Error('No ID token received')

    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString())

    // Sincronizar usuário no banco
    const user = await this.usersService.findOrCreateUser(payload.sub, payload.email, payload.name)
    const userData = (user as any).sql || user

    return {
      success: true,
      data: {
        accessToken: idToken,
        refreshToken: tokens.refresh_token,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          createdAt: userData.createdAt,
        },
      },
    }
  }

  @Get('google')
  @ApiOperation({ summary: 'Login with Google via Cognito' })
  googleLogin(@Res() res: Response) {
    const domain = this.configService.get('AWS_COGNITO_DOMAIN')
    const region = this.configService.get('AWS_COGNITO_REGION', 'us-east-1')
    const clientId = this.configService.get('AWS_COGNITO_CLIENT_ID')
    const redirectUri = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/callback`
    const url = `https://${domain}.auth.${region}.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=email openid profile`
    res.redirect(url)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user (protected)' })
  getProfile(@Req() req: Request) {
    return { success: true, data: req.user }
  }
}
