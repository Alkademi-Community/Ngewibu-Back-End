import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UserService } from './user.service'
import { IsAuthenticated } from 'src/guard/is-authenticated.guard'
import { Prisma, User } from '@prisma/client'
import { ResponseData } from 'src/types/response'
import * as httpStatus from 'http-status'
import AuthMessage from 'src/constants/auth.constant'
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger'
import { SessionService } from 'src/service/session.service'
import { SessionData } from 'src/types/session'
import { UserProfileService } from './user-profile.service'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { StorageConstants } from 'src/constants/file.constant'
import { UpdateUserProfile, UpdateUserPasswordDto } from 'src/validation/user/index.dts'
import * as bcrypt from 'bcrypt'

import {
  imageFilter,
  getUniqueFilename,
} from 'src/utils/image-upload-handler.util'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private userProfileService: UserProfileService,
  ) { }

  /**
   * get the data of the user who is currently logged in
   * @param {any} 'profile
   * @returns {any}
   */

  @Get('profile')
  @ApiBearerAuth('Authorization')
  @UseGuards(IsAuthenticated)
  public async profile(
    @Headers() headers: Record<string, string>,
    @Res() res: Response,
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

    const user: User | undefined | null = await this.userService.findOne(
      sessionData?.username,
    )

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
    return res.status(response.status_code).json(response)
  }

  @Post('profile/update')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFilter,
      limits: { fileSize: StorageConstants.oneMb * 4 },
      storage: diskStorage({
        destination: StorageConstants.userProfileImagePath,
        filename: getUniqueFilename,
      }),
    }),
  )
  @UseGuards(IsAuthenticated)
  public async updateProfile(
    @Headers() headers: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UpdateUserProfile,
    @UploadedFile() image: Express.Multer.File,
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

    const { gender_id, name, bio, date_of_birth, address } = body
    const data: Prisma.UserProfileUncheckedUpdateInput = {
      genderId: Number(gender_id),
      name,
      bio,
      dateOfBirth: date_of_birth,
      address,
    }

    const userUploadImage = image !== undefined
    const schemeAndHost = `${req.protocol}://${req.headers.host}`
    if (userUploadImage) {
      data.imageUrl = `${schemeAndHost}/${image.path}`
    }

    const update = await this.userProfileService.updateProfile(
      sessionData.id,
      data,
      schemeAndHost,
    )

    return res.status(update?.status_code).json(update)
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
