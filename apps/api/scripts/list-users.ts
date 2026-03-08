import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

async function listUsers() {
  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    })

    const response = await client.send(command)
    const users = response.Users || []

    if (users.length === 0) {
      console.log('✅ Nenhum usuário encontrado no Cognito')
      return
    }

    console.log(`\n📋 Usuários no Cognito (${users.length}):\n`)

    users.forEach((user, index) => {
      const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value
      const emailVerified = user.Attributes?.find(attr => attr.Name === 'email_verified')?.Value
      const status = user.UserStatus
      const created = user.UserCreateDate?.toISOString()

      console.log(`${index + 1}. ${email}`)
      console.log(`   Status: ${status}`)
      console.log(`   Email verificado: ${emailVerified}`)
      console.log(`   Criado em: ${created}`)
      console.log(`   Username: ${user.Username}\n`)
    })
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error.message)
    process.exit(1)
  }
}

listUsers()
