import { ApiProperty } from '@nestjs/swagger'

export class CreateNoteDto {
  @ApiProperty({ example: 'My First Note' })
  title: string

  @ApiProperty({ example: 'This is the content of my note' })
  content: string
}
