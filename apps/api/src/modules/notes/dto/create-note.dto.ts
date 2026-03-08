import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateNoteDto as ICreateNoteDto } from '@cloud-notes/types'

export class CreateNoteDto implements ICreateNoteDto {
  @ApiProperty({ example: 'My First Note' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'This is the content of my note' })
  @IsString()
  @IsNotEmpty()
  content: string
}
