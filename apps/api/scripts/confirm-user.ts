import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
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
  console.error('❌ Uso: pnpm cognito:confirm <email>')
  process.exit(1)
}

async function confirmUser() {
  try {
    const command = new AdminConfirmSignUpCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      Username: email,
    })

    await client.send(command)
    console.log(`✅ Usuário ${email} confirmado com sucesso!`)
  } catch (error) {
    console.error('❌ Erro ao confirmar usuário:', error.message)
    process.exit(1)
  }
}

confirmUser()
