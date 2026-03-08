import { Injectable } from '@nestjs/common'
import { DynamoService } from '../../dynamo/dynamo.service'
import { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { randomUUID } from 'crypto'

@Injectable()
export class NotesNoSqlRepository {
  constructor(private dynamo: DynamoService) {}

  async create(userId: string, title: string, content: string) {
    const noteId = randomUUID()
    const now = new Date().toISOString()

    const note = {
      noteId,
      userId,
      title,
      content,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    }

    await this.dynamo.docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_NOTES || 'cloud-notes-dev-notes',
        Item: note,
      }),
    )

    return note
  }

  async findByUser(userId: string, status?: string) {
    const params: any = {
      TableName: process.env.DYNAMODB_TABLE_NOTES || 'cloud-notes-dev-notes',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }

    if (status) {
      params.FilterExpression = 'status = :status'
      params.ExpressionAttributeValues[':status'] = status
    }

    const result = await this.dynamo.docClient.send(new QueryCommand(params))
    return result.Items || []
  }

  async findById(userId: string, noteId: string) {
    const result = await this.dynamo.docClient.send(
      new GetCommand({
        TableName: process.env.DYNAMODB_TABLE_NOTES || 'cloud-notes-dev-notes',
        Key: { userId, noteId },
      }),
    )

    return result.Item
  }

  async update(userId: string, noteId: string, data: { title?: string; content?: string; status?: string }) {
    const updateExpressions: string[] = []
    const expressionAttributeValues: any = {}
    const expressionAttributeNames: any = {}

    if (data.title) {
      updateExpressions.push('#title = :title')
      expressionAttributeNames['#title'] = 'title'
      expressionAttributeValues[':title'] = data.title
    }

    if (data.content) {
      updateExpressions.push('#content = :content')
      expressionAttributeNames['#content'] = 'content'
      expressionAttributeValues[':content'] = data.content
    }

    if (data.status) {
      updateExpressions.push('#status = :status')
      expressionAttributeNames['#status'] = 'status'
      expressionAttributeValues[':status'] = data.status
    }

    updateExpressions.push('updatedAt = :updatedAt')
    expressionAttributeValues[':updatedAt'] = new Date().toISOString()

    const result = await this.dynamo.docClient.send(
      new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE_NOTES || 'cloud-notes-dev-notes',
        Key: { userId, noteId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames:
          Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    )

    return result.Attributes
  }

  async delete(userId: string, noteId: string) {
    await this.dynamo.docClient.send(
      new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE_NOTES || 'cloud-notes-dev-notes',
        Key: { userId, noteId },
      }),
    )
  }
}
