import { Injectable } from '@nestjs/common'
import { DynamoService } from '../../dynamo/dynamo.service'
import { GetCommand, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

@Injectable()
export class UsersNoSqlRepository {
  constructor(private dynamo: DynamoService) {}

  async findByCognitoId(cognitoId: string) {
    const result = await this.dynamo.docClient.send(
      new GetCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS || 'users',
        Key: { cognitoId },
      }),
    )
    return result.Item
  }

  async findByEmail(email: string) {
    const result = await this.dynamo.docClient.send(
      new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS || 'users',
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      }),
    )
    return result.Items?.[0]
  }

  async create(cognitoId: string, email: string, name: string) {
    const now = new Date().toISOString()

    const user = {
      cognitoId,
      email,
      name,
      createdAt: now,
      updatedAt: now,
    }

    await this.dynamo.docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS || 'users',
        Item: user,
      }),
    )

    return user
  }

  async update(cognitoId: string, data: { name?: string; avatar?: string; preferences?: any }) {
    const updateExpressions: string[] = []
    const expressionAttributeValues: any = {}
    const expressionAttributeNames: any = {}

    if (data.name) {
      updateExpressions.push('#name = :name')
      expressionAttributeNames['#name'] = 'name'
      expressionAttributeValues[':name'] = data.name
    }

    if (data.avatar) {
      updateExpressions.push('avatar = :avatar')
      expressionAttributeValues[':avatar'] = data.avatar
    }

    if (data.preferences) {
      updateExpressions.push('preferences = :preferences')
      expressionAttributeValues[':preferences'] = data.preferences
    }

    updateExpressions.push('updatedAt = :updatedAt')
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    const result = await this.dynamo.docClient.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS || 'users',
        Key: { cognitoId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames:
          Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    )

    return result.Attributes
  }

  async delete(cognitoId: string) {
    await this.dynamo.docClient.send(
      new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS || 'users',
        Key: { cognitoId },
      }),
    )
  }
}
