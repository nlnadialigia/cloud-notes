/**
 * Implementação DynamoDB do Repositório de Notas
 *
 * Esta implementação usa AWS DynamoDB para persistência NoSQL.
 *
 * Estrutura da tabela:
 * - PK: NOTE#{noteId}
 * - SK: USER#{userId}
 * - GSI: userId-createdAt (para listagem ordenada por data)
 *
 * Para usar em produção:
 * 1. Configure as variáveis de ambiente AWS
 * 2. Instale o SDK: npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 * 3. Remova os comentários do código abaixo
 */

import type { Note, CreateNoteInput, UpdateNoteInput, NoteFilter } from '@/lib/types'
import type { NoteRepository } from './note-repository'
import { awsConfig } from '../config'

// TODO: Descomente quando integrar com AWS
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
// import {
//   DynamoDBDocumentClient,
//   PutCommand,
//   GetCommand,
//   QueryCommand,
//   UpdateCommand,
//   DeleteCommand,
// } from "@aws-sdk/lib-dynamodb"

export class DynamoNoteRepository implements NoteRepository {
  // private client: DynamoDBDocumentClient
  private tableName: string

  constructor() {
    this.tableName = awsConfig.dynamodb.tableName

    // TODO: Descomente quando integrar com AWS
    // const dynamoClient = new DynamoDBClient({
    //   region: awsConfig.region,
    // })
    // this.client = DynamoDBDocumentClient.from(dynamoClient)
  }

  async create(userId: string, input: CreateNoteInput): Promise<Note> {
    const now = new Date()
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const note: Note = {
      id: noteId,
      userId,
      title: input.title,
      content: input.content || '',
      createdAt: now,
      updatedAt: now,
      archived: false,
    }

    // TODO: Descomente quando integrar com AWS
    // await this.client.send(
    //   new PutCommand({
    //     TableName: this.tableName,
    //     Item: {
    //       PK: `NOTE#${noteId}`,
    //       SK: `USER#${userId}`,
    //       ...note,
    //       createdAt: now.toISOString(),
    //       updatedAt: now.toISOString(),
    //     },
    //   })
    // )

    console.log('[DynamoDB Mock] Nota criada:', note)
    return note
  }

  async findById(userId: string, noteId: string): Promise<Note | null> {
    // TODO: Descomente quando integrar com AWS
    // const result = await this.client.send(
    //   new GetCommand({
    //     TableName: this.tableName,
    //     Key: {
    //       PK: `NOTE#${noteId}`,
    //       SK: `USER#${userId}`,
    //     },
    //   })
    // )
    //
    // if (!result.Item) return null
    //
    // return {
    //   ...result.Item,
    //   createdAt: new Date(result.Item.createdAt),
    //   updatedAt: new Date(result.Item.updatedAt),
    // } as Note

    console.log('[DynamoDB Mock] Buscando nota:', noteId)
    return null
  }

  async findByUser(userId: string, filter?: NoteFilter): Promise<Note[]> {
    // TODO: Descomente quando integrar com AWS
    // const params: any = {
    //   TableName: this.tableName,
    //   IndexName: awsConfig.dynamodb.gsiUserIdCreatedAt,
    //   KeyConditionExpression: "userId = :userId",
    //   ExpressionAttributeValues: {
    //     ":userId": userId,
    //   },
    //   ScanIndexForward: false, // DESC order
    // }
    //
    // if (filter === "archived") {
    //   params.FilterExpression = "archived = :archived"
    //   params.ExpressionAttributeValues[":archived"] = true
    // } else if (filter === "active") {
    //   params.FilterExpression = "archived = :archived"
    //   params.ExpressionAttributeValues[":archived"] = false
    // }
    //
    // const result = await this.client.send(new QueryCommand(params))
    //
    // return (result.Items || []).map((item) => ({
    //   ...item,
    //   createdAt: new Date(item.createdAt),
    //   updatedAt: new Date(item.updatedAt),
    // })) as Note[]

    console.log('[DynamoDB Mock] Listando notas do usuário:', userId, 'filtro:', filter)
    return []
  }

  async update(userId: string, noteId: string, input: UpdateNoteInput): Promise<Note> {
    const now = new Date()

    // TODO: Descomente quando integrar com AWS
    // const updateExpressions: string[] = ["updatedAt = :updatedAt"]
    // const expressionAttributeValues: Record<string, any> = {
    //   ":updatedAt": now.toISOString(),
    // }
    //
    // if (input.title !== undefined) {
    //   updateExpressions.push("title = :title")
    //   expressionAttributeValues[":title"] = input.title
    // }
    // if (input.content !== undefined) {
    //   updateExpressions.push("content = :content")
    //   expressionAttributeValues[":content"] = input.content
    // }
    // if (input.archived !== undefined) {
    //   updateExpressions.push("archived = :archived")
    //   expressionAttributeValues[":archived"] = input.archived
    // }
    //
    // const result = await this.client.send(
    //   new UpdateCommand({
    //     TableName: this.tableName,
    //     Key: {
    //       PK: `NOTE#${noteId}`,
    //       SK: `USER#${userId}`,
    //     },
    //     UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    //     ExpressionAttributeValues: expressionAttributeValues,
    //     ReturnValues: "ALL_NEW",
    //   })
    // )

    console.log('[DynamoDB Mock] Nota atualizada:', noteId, input)
    return {
      id: noteId,
      userId,
      title: input.title || '',
      content: input.content || '',
      createdAt: now,
      updatedAt: now,
      archived: input.archived || false,
    }
  }

  async delete(userId: string, noteId: string): Promise<void> {
    // TODO: Descomente quando integrar com AWS
    // await this.client.send(
    //   new DeleteCommand({
    //     TableName: this.tableName,
    //     Key: {
    //       PK: `NOTE#${noteId}`,
    //       SK: `USER#${userId}`,
    //     },
    //   })
    // )

    console.log('[DynamoDB Mock] Nota excluída:', noteId)
  }

  async archive(userId: string, noteId: string): Promise<void> {
    await this.update(userId, noteId, { archived: true })
  }

  async unarchive(userId: string, noteId: string): Promise<void> {
    await this.update(userId, noteId, { archived: false })
  }
}
