import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.users.findMany()
  }

  async getUser(id: number): Promise<User> {
    return this.prisma.users.findUnique({ where: { id: Number(id) } })
  }

  async registerUser(data: User): Promise<User> {
    return this.prisma.users.create({ data })
  }

  async updateUser(id: number, data: User): Promise<User> {
    return this.prisma.users.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        password: data.password,
      }
    })
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.users.delete({ where: { id: Number(id) } })
  }
}
