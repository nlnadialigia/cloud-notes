import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  email: string

  @ApiProperty({ example: 'Password123!' })
  password: string
}
