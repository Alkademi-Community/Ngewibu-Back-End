import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { ResponseData } from 'src/types/response'
import { LoginDto } from 'src/validation/login.dts'
import { ConfigService } from '@nestjs/config'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('login')
  async login(@Res() response: Response, @Body() body: LoginDto) {
    const user: ResponseData = await this.authService.login(
      body?.username,
      body?.password,
    )
    return response.status(user.status_code).json(user)
  }
}
