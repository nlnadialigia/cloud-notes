import { CognitoIdentityProviderClient, ListUsersCommand, AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_COGNITO_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

async function deleteAllUsers() {
  try {
    // Listar todos os usuários
    const listCommand = new ListUsersCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    })

    const response = await client.send(listCommand)
    const users = response.Users || []

    if (users.length === 0) {
      console.log('✅ Nenhum usuário encontrado no Cognito')
      return
    }

    console.log(`📋 Encontrados ${users.length} usuários. Deletando...`)

    // Deletar cada usuário
    for (const user of users) {
      const username = user.Username
      const email = user.Attributes?.find(attr => attr.Name === 'email')?.Value

      try {
        const deleteCommand = new AdminDeleteUserCommand({
          UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
          Username: username,
        })

        await client.send(deleteCommand)
        console.log(`✅ Deletado: ${email || username}`)
      } catch (error) {
        console.error(`❌ Erro ao deletar ${email || username}:`, error.message)
      }
    }

    console.log(`\n✅ Processo concluído! ${users.length} usuários deletados do Cognito`)
  } catch (error) {
    console.error('❌ Erro ao listar/deletar usuários:', error.message)
    process.exit(1)
  }
}

deleteAllUsers()
