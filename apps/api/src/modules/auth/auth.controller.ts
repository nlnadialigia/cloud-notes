import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { UsersService } from '../users/users.service'
import { CognitoService } from './cognito.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private cognitoService: CognitoService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register with AWS Cognito' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.cognitoService.signUp(dto.name, dto.email, dto.password)
    
    if (!result.UserSub) throw new Error('User registration failed')
    
    // Criar usuário no banco
    const user = await this.usersService.findOrCreateUser(result.UserSub, dto.email, dto.name)
    
    return { 
      success: true, 
      message: 'User registered successfully', 
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
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

    return {
      success: true,
      data: {
        accessToken: idToken,
        refreshToken: result.AuthenticationResult?.RefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
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

    return {
      success: true,
      data: {
        accessToken: idToken,
        refreshToken: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      },
    }
  }

  @Get('google')
  @ApiOperation({ summary: 'Login with Google via Cognito' })
  googleLogin(@Res() res: Response) {
    const domain = process.env.AWS_COGNITO_DOMAIN
    const clientId = process.env.AWS_COGNITO_CLIENT_ID
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
    const url = `https://${domain}.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=email openid profile`
    res.redirect(url)
  }

  @Get('github')
  @ApiOperation({ summary: 'Login with GitHub via Cognito' })
  githubLogin(@Res() res: Response) {
    const domain = process.env.AWS_COGNITO_DOMAIN
    const clientId = process.env.AWS_COGNITO_CLIENT_ID
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
    const url = `https://${domain}.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=GitHub&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=email openid profile`
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
