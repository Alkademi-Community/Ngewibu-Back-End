import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/service/prisma.service'
import { User } from './user.model'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.users.findMany()
  }
}
