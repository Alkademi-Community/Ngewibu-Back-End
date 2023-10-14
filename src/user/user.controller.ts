import {
  Body,
  Controller,
  Get,
  Headers,
  Post, Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { UserService } from './user.service'
import { IsAuthenticated } from 'src/guard/is-authenticated.guard'
import { Prisma, User } from '@prisma/client'
import { ResponseData } from 'src/types/response'
import * as httpStatus from 'http-status'
import AuthMessage from 'src/constants/auth.constant'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SessionService } from 'src/service/session.service'
import { SessionData } from 'src/types/session'
import { UserProfileService } from './user-profile.service'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { StorageConstants } from 'src/constants/file.constant'
import { UpdateUserProfile } from 'src/validation/user/index.dts'

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
}
