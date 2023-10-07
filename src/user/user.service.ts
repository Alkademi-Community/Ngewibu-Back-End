import { Controller, Get, Injectable, Post } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'
import { Prisma, User } from '@prisma/client'
import { UserWithRole } from 'src/types/user'
import { ApiTags } from '@nestjs/swagger'
import { UpdateUserDto } from 'src/validation/user/index.dts'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  // allowed fields to display
  public USER_SAFE_FIELDS = {
    id: true,
    roleId: true,
    username: true,
    email: true,
    isActivated: true,
    isVerified: true,
    resetPasswordToken: true,
    password: false,
    token: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    role: true,
  }

  /**
   * Get all user records in database
   * @returns {any}
   */
  async getAllUsers(): Promise<UserWithRole[]> {
    return this.prisma.user.findMany({
      select: this.USER_SAFE_FIELDS,
    })
  }

  /**
   * Find one unique record based on username
   * @param {any} username:string
   * @returns {any}
   */
  async findOne(
    username: string,
    withPasswordField: boolean = false,
  ): Promise<UserWithRole | undefined | null> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
      include: {
        role: true,
        userProfile: true,
      },
    })

    if (!withPasswordField) {
      this.getUserSafeFields(user)
    }
    return user
  }

  async registerUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        password: data.password || undefined,
        isActivated: data.isActivated || undefined,
        isVerified: data.isVerified || undefined,
        roleId: data.roleId || undefined,
      },
    })
  }

  // public async updateUser() {
  //   // Assuming email, firstname and address fields exist in your prisma schema. 
  //   const updateUser = await prisma.user.update({
  //     where: {
  //       email: 'viola@prisma.io',
  //     },
  //     data: {
  //       // If req.firstname is falsy, then return undefined, otherwise return it's value
  //       firstname: req.firstname || undefined,
  //       email: req.email || undefined,
  //       address: req.address || undefined
  //     },
  //   })
  // }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id: Number(id) } })
  }

  /**
   * To remove password user object
   * @param {any} user:UserWithRole
   * @returns {any}
   */
  private getUserSafeFields(user: UserWithRole) {
    const userPasswordIsNotNull = ![null, undefined].includes(user?.password)
    if (userPasswordIsNotNull) {
      delete user?.password
    }
  }
}
