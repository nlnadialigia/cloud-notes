import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import jwksClient from 'jwks-rsa'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwksClient: jwksClient.JwksClient

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const region = this.configService.get('AWS_COGNITO_REGION', 'us-east-1')
    const userPoolId = this.configService.get('AWS_COGNITO_USER_POOL_ID')

    this.jwksClient = jwksClient({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)

    if (!token) throw new UnauthorizedException('Token not found')

    try {
      const decoded = this.jwtService.decode(token, { complete: true }) as any
      if (!decoded) throw new UnauthorizedException('Invalid token')

      const key = await this.jwksClient.getSigningKey(decoded.header.kid)
      const publicKey = key.getPublicKey()

      const payload = await this.jwtService.verifyAsync(token, {
        secret: publicKey,
        algorithms: ['RS256'],
      })

      request.user = { userId: payload.sub, email: payload.email, name: payload.name }
      return true
    } catch (error) {
      console.error('[JwtAuthGuard] JWT verification failed:', error.message)
      console.error('[JwtAuthGuard] Token:', token?.substring(0, 50) + '...')
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization
    if (!authHeader) return null
    const [type, token] = authHeader.split(' ')
    return type === 'Bearer' ? token : null
  }
}
