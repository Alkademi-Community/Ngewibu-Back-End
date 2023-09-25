import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    example: 'johndoe123',
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  password: string
}
