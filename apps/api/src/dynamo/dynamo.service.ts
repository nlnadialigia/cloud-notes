import { Injectable, OnModuleInit } from '@nestjs/common'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

@Injectable()
export class DynamoService implements OnModuleInit {
  private client: DynamoDBClient
  public docClient: DynamoDBDocumentClient

  onModuleInit() {
    const isLocal = process.env.NODE_ENV === 'development'

    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      ...(isLocal && {
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:7000',
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local',
        },
      }),
    })

    this.docClient = DynamoDBDocumentClient.from(this.client)
  }
}
