import { Injectable } from '@nestjs/common'
import { ResponseData } from 'src/types/response'
import { UserService } from 'src/user/user.service'
import * as httpStatus from 'http-status'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import AuthMessage from 'src/constants/auth.constant'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * To generate jwt token based on the user information given
   * @param {any} username:string|null
   * @param {any} password:string|null
   * @returns {any}
   */
  public async login(username: string | null, password: string | null) {
    const userResponse: ResponseData = await this.validateUser(
      username,
      password,
    )

    if (!userResponse.status) return userResponse

    const jwtPayload = {
      username: username,
      id: userResponse?.data.id,
    }
    const response: ResponseData = {
      status: true,
      status_code: httpStatus.OK,
      message: '',
      data: {
        token: await this.jwtService.sign(jwtPayload),
      },
    }
    return response
  }

  /**
   * To validate user based on the credentials given
   * @param {any} username:string|null
   * @param {any} password:string|null
   * @returns {any}
   */
  public async validateUser(
    username: string | null,
    password: string | null,
  ): Promise<ResponseData> {
    const user = await this.userService.findOne(username, true)
    let response: ResponseData

    const userIsNotFound: boolean = [undefined, null].includes(user)
    if (userIsNotFound) {
      response = {
        status: false,
        status_code: httpStatus.NOT_FOUND,
        message: AuthMessage.USER_NOT_FOUND,
      }

      return response
    }

    const passwordIsValid: boolean = await bcrypt.compare(
      password,
      user?.password ?? '',
    )

    if (!passwordIsValid) {
      response = {
        status: false,
        status_code: httpStatus.BAD_REQUEST,
        message: AuthMessage.WRONG_PASSWORD,
      }

      return response
    }

    response = {
      status: true,
      status_code: httpStatus.OK,
      message: 'Success',
      data: user,
    }
    return response
  }
}
