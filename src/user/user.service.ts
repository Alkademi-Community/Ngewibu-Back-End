import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma?.users?.findMany()
    this.removeUnsafeFields(users)
    return users
  }

  /**
   * To remove the password, created_at, updated_at, and deleted_at fields from the User collections
   * @param {any} users:User[]
   * @returns {any}
   */
  private removeUnsafeFields(users: User[]) {
    return users.map((user: User) => {
      delete user?.created_at
      delete user?.password
      delete user?.deleted_at
      delete user?.updated_at

      return User
    })
  }
}
