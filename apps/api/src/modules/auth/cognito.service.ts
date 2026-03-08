import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider'

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient
  private clientId: string

  constructor(private configService: ConfigService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get('AWS_COGNITO_REGION', 'us-east-1'),
    })
    this.clientId = this.configService.get('AWS_COGNITO_CLIENT_ID', '')
  }

  async signUp(name: string, email: string, password: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'name', Value: name },
        { Name: 'email', Value: email },
      ],
    })

    return this.client.send(command)
  }

  async login(email: string, password: string) {
    const command = new InitiateAuthCommand({
      ClientId: this.clientId,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    })

    return this.client.send(command)
  }

  async exchangeCodeForTokens(code: string) {
    const domain = this.configService.get('AWS_COGNITO_DOMAIN')
    const redirectUri = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/auth/callback`
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      code,
      redirect_uri: redirectUri,
    })

    const response = await fetch(`https://${domain}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    return response.json()
  }
}
