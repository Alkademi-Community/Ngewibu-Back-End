import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import * as httpStatus from 'http-status'
import { PrismaService } from 'src/service/prisma.service'
import { ResponseData } from 'src/types/response'
import * as fs from 'fs'
import { join } from 'path'
import { UserMessage } from 'src/constants/user.constant'

@Injectable()
export class UserProfileService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update user profile by the given user id
   * @param {any} userId:number|null
   * @param {any} data:Prisma.UserProfileUncheckedUpdateInput
   * @param {any} schemeAndHost:string|null=null
   * @returns {any}
   */
  public async updateProfile(
    userId: number | null,
    data: Prisma.UserProfileUncheckedUpdateInput,
    schemeAndHost: string | null = null,
  ): Promise<ResponseData> {
    try {
      const userProfile = await this.prisma.userProfile.findFirstOrThrow({
        where: { userId },
      })

      this.deleteExistingImage(
        data.imageUrl as string | undefined,
        userProfile?.imageUrl,
        schemeAndHost,
      )
      data.dateOfBirth = new Date(data.dateOfBirth as string)
      const update = await this.prisma.userProfile.update({
        where: userProfile,
        data,
      })

      const response: ResponseData = {
        status: true,
        status_code: httpStatus.OK,
        message: UserMessage.USER_PROFILE_UPDATED,
        data: update,
      }
      return response
    } catch (e) {
      const response: ResponseData = {
        status: false,
        status_code: 400,
        message: UserMessage.USER_PROFILE_UPDATE_FAILED,
        errors: e.message,
      }
      return response
    }
  }

  /**
   * Delete existing user profile image from storage
   * @param {any} newImageUrl:string|undefined
   * @param {any} userImageUrl:null|string
   * @param {any} schemeAndHost:string
   * @returns {any}
   */
  private deleteExistingImage(
    newImageUrl: string | undefined,
    userImageUrl: null | string,
    schemeAndHost: string,
  ) {
    if (newImageUrl !== undefined && userImageUrl !== null) {
      let fileName = userImageUrl?.replace(schemeAndHost, '')
      fileName = join(__dirname, '../..', fileName)

      if (fs.existsSync(fileName)) fs.unlinkSync(fileName)
    }
  }
}
