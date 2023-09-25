import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Request } from 'express'
import { IsAuthenticated } from 'src/guard/is-authenticated.guard'
import { User } from '@prisma/client'
import { ResponseData } from 'src/types/response'
import * as httpStatus from 'http-status'
import AuthMessage from 'src/constants/auth.constant'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get one specific user record by username
   * @param {any} 'profile/:username'
   * @returns {any}
   */
  @Get('profile/:username')
  @UseGuards(IsAuthenticated)
  public async profile(@Req() request: Request) {
    const user: User | undefined | null = await this.userService.findOne(
      request?.params?.username,
    )
    let response: ResponseData

    const userIsNotFound = [null, undefined].includes(user)
    if (userIsNotFound) {
      response = {
        status: false,
        status_code: httpStatus.NOT_FOUND,
        message: AuthMessage.USER_NOT_FOUND,
      }
      return response
    }

    response = {
      status: true,
      status_code: httpStatus.OK,
      message: '',
      data: user,
    }
    return response
  }
}
