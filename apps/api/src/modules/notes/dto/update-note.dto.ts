import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { UpdateNoteDto as IUpdateNoteDto, NoteStatus } from '@cloud-notes/types'

export class UpdateNoteDto implements IUpdateNoteDto {
  @ApiProperty({ example: 'Updated Title', required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ example: 'Updated content', required: false })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ example: 'active', enum: ['active', 'archived'], required: false })
  @IsOptional()
  @IsEnum(['active', 'archived'])
  status?: NoteStatus
}
