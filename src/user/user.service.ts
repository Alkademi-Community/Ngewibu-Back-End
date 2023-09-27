import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'
import { Prisma, User } from '@prisma/client'
import { UserWithRole } from 'src/types/user'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    const user = await this.prisma.user.findUnique({
      where: { username },
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

  async updateUser(id: number, data: User): Promise<User> {
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        password: data.password,
      },
    })
  }

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
