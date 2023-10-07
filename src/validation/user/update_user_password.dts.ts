import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserPasswordDto {
  @ApiProperty({
    example: 'password123',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: 'new_password123',
  })
  new_password: string
}
