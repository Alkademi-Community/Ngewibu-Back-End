import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    example: 'password123',
  })
  password: string

  @ApiProperty({
    example: 'new_password123',
  })
  new_password: string

  @ApiProperty({
    example: '1',
  })
  isActivated: number

  @ApiProperty({
    example: '1',
  })
  isVerified: number

  @ApiProperty({
    example: 'user',
  })
  role: string

  roleId: number
}
