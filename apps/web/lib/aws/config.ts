/**
 * Configuração AWS para CloudNotes
 *
 * Este arquivo contém as configurações necessárias para integração com AWS.
 * As variáveis de ambiente serão configuradas durante o deploy.
 *
 * Serviços AWS utilizados:
 * - Cognito: Autenticação de usuários
 * - DynamoDB: Persistência NoSQL
 * - RDS PostgreSQL: Persistência SQL
 * - API Gateway: Exposição da API
 * - Lambda: Backend serverless
 * - S3 + CloudFront: Hospedagem do frontend
 */

export const awsConfig = {
  // Região AWS
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',

  // Cognito Configuration
  cognito: {
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
  },

  // API Gateway Configuration
  api: {
    endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || '',
  },

  // DynamoDB Configuration (NoSQL)
  dynamodb: {
    tableName: process.env.DYNAMODB_TABLE_NAME || 'cloudnotes-notes',
    gsiUserIdCreatedAt: 'gsi-userId-createdAt',
  },

  // RDS PostgreSQL Configuration (SQL)
  rds: {
    host: process.env.RDS_HOST || '',
    port: parseInt(process.env.RDS_PORT || '5432'),
    database: process.env.RDS_DATABASE || 'cloudnotes',
    username: process.env.RDS_USERNAME || '',
    password: process.env.RDS_PASSWORD || '',
  },
}

// Verifica se as configurações do Cognito estão presentes
export function isCognitoConfigured(): boolean {
  return !!(awsConfig.cognito.userPoolId && awsConfig.cognito.clientId)
}

// Verifica se a API está configurada
export function isApiConfigured(): boolean {
  return !!awsConfig.api.endpoint
}

// Verifica se o DynamoDB está configurado
export function isDynamoDBConfigured(): boolean {
  return !!awsConfig.dynamodb.tableName
}

// Verifica se o RDS está configurado
export function isRDSConfigured(): boolean {
  return !!(awsConfig.rds.host && awsConfig.rds.username && awsConfig.rds.password)
}
