import { Body, Controller, Get, Headers, Post, Put, Query, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'
import { ResponseData } from 'src/types/response'
import { LoginDto } from 'src/validation/login.dts'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger'
import { IsAuthenticated } from 'src/guard/is-authenticated.guard'
import { UpdateUserPasswordDto } from 'src/validation/user/index.dts'
import { SessionService } from 'src/service/session.service'
import { SessionData } from 'src/types/session'
import * as httpStatus from 'http-status'
import AuthMessage from 'src/constants/auth.constant'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { MailService } from 'src/mail/mail.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private sessionService: SessionService,
    private mailService: MailService,
    private config: ConfigService,
  ) { }

  @Post('login')
  async login(@Res() response: Response, @Body() body: LoginDto) {
    const user: ResponseData = await this.authService.login(
      body?.username,
      body?.password,
    )
    return response.status(user.status_code).json(user)
  }


  /**
   * Request forgot password
   * @param {any} 'profile/:username'
   * @returns {any}
   */

  @Get('/forgot/password')
  @ApiQuery({ name: 'email' })
  public async forgotPassword(
    @Query('email') email: string,
  ) {
    let response: ResponseData
    if (!email) {
      response = {
        status: false,
        status_code: httpStatus.BAD_REQUEST,
        message: "Email tidak ditemukan",
      }
      return response
    }

    const user: User | undefined | null = await this.userService.findOne(
      email, true
    )

    let userIsNotFound = [null, undefined].includes(user)
    if (userIsNotFound) {
      response = {
        status: false,
        status_code: httpStatus.UNAUTHORIZED,
        message: AuthMessage.USER_NOT_FOUND,
      }
      return response
    }

    const jwtPayload = {
      username: user.username,
      id: user.id,
    }
    let token = await this.authService.jwtGenerate(jwtPayload)
    await this.mailService.forgotPassword(user, token);

    response = {
      status: true,
      status_code: httpStatus.OK,
      message: '',
      data: null,
    }
    return response
  }


  /**
   * Update user (password only) get by username
   * @param {any} 'profile/:username'
   * @returns {any}
   */

  @Put('/change/password')
  @ApiBearerAuth('Authorization')
  // @ApiParam({
  //   name: 'password',
  //   example: 'johndoe123',
  // })
  @UseGuards(IsAuthenticated)
  public async updateUserPassword(
    @Headers() headers: Record<string, string>,
    @Body() body: UpdateUserPasswordDto,
  ) {
    const authToken = this.sessionService.getAuthToken(headers)
    const sessionData: SessionData =
      await this.sessionService.getSessionData(authToken)

    let response: ResponseData
    const sessionDataIsNull: boolean = sessionData === null
    if (sessionDataIsNull) {
      response = {
        status: false,
        status_code: httpStatus.UNAUTHORIZED,
        message: AuthMessage.TOKEN_INVALID,
      }
      return response
    }

    const authUser: User | undefined | null = await this.userService.findOne(
      sessionData?.username, true
    )

    let userIsNotFound = [null, undefined].includes(authUser)
    // TODO : message for authuser not found
    if (userIsNotFound) {
      response = {
        status: false,
        status_code: httpStatus.UNAUTHORIZED,
        message: AuthMessage.USER_NOT_FOUND,
      }
      return response
    }

    if (!body.password && !body.new_password) {
      response = {
        status: false,
        status_code: httpStatus.BAD_REQUEST,
        message: AuthMessage.WRONG_PASSWORD,
      }
      return response
    }

    const passwordIsValid: boolean = await bcrypt.compare(
      body.password,
      authUser?.password ?? '',
    )

    if (!passwordIsValid) {
      response = {
        status: false,
        status_code: httpStatus.BAD_REQUEST,
        message: AuthMessage.WRONG_PASSWORD,
      }

      return response
    }

    body.password = bcrypt.hashSync(body.new_password, 10)
    body.new_password = undefined

    const result = await this.userService.updateUser(
      authUser.id, body

    )

    response = {
      status: true,
      status_code: httpStatus.OK,
      message: '',
      data: result,
    }
    return response
  }
}
