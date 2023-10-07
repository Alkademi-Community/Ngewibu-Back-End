import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserProfile {
  @ApiProperty({
    example: 'johndoe123',
  })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string

  @ApiProperty({
    example: 'Jl. cisitu indah 2 no.16',
  })
  @MinLength(5)
  address: string

  @ApiProperty({
    example: 'Hai nama saya Rijal',
  })
  @MinLength(5)
  bio: string

  @ApiProperty({
    example: '2023-02-01',
  })
  @IsDateString()
  date_of_birth?: Date

  @ApiProperty({
    example: 1,
  })
  @IsNumberString()
  gender_id: number

  @ApiProperty({
    example: 'Gambar.png',
  })
  image: Express.Multer.File
}
