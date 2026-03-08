import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:7000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
})

async function createUsersTable() {
  const command = new CreateTableCommand({
    TableName: 'users',
    KeySchema: [{ AttributeName: 'cognitoId', KeyType: 'HASH' }],
    AttributeDefinitions: [
      { AttributeName: 'cognitoId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  })

  try {
    await client.send(command)
    console.log('✅ Tabela users criada com sucesso')
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Tabela users já existe')
    } else {
      console.error('❌ Erro ao criar tabela users:', error)
    }
  }
}

async function createNotesTable() {
  const command = new CreateTableCommand({
    TableName: 'notes',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
      { AttributeName: 'noteId', KeyType: 'RANGE' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'noteId', AttributeType: 'S' },
    ],
    ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
  })

  try {
    await client.send(command)
    console.log('✅ Tabela notes criada com sucesso')
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Tabela notes já existe')
    } else {
      console.error('❌ Erro ao criar tabela notes:', error)
    }
  }
}

async function init() {
  await createUsersTable()
  await createNotesTable()
}

init()
