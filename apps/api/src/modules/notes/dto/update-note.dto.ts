import { ApiProperty } from '@nestjs/swagger'

export class UpdateNoteDto {
  @ApiProperty({ example: 'Updated Title', required: false })
  title?: string

  @ApiProperty({ example: 'Updated content', required: false })
  content?: string

  @ApiProperty({ example: 'active', enum: ['active', 'archived'], required: false })
  status?: 'active' | 'archived'
}
