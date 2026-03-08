import { Injectable } from '@nestjs/common'
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

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_COGNITO_REGION || 'us-east-1',
    })
    this.clientId = process.env.AWS_COGNITO_CLIENT_ID || ''
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
}
