import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const email = process.argv[2]

if (!email) {
  console.error('❌ Uso: pnpm cognito:delete <email>')
  process.exit(1)
}

async function deleteUser() {
  try {
    const command = new AdminDeleteUserCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      Username: email,
    })

    await client.send(command)
    console.log(`✅ Usuário ${email} deletado do Cognito com sucesso!`)
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error.message)
    process.exit(1)
  }
}

deleteUser()
