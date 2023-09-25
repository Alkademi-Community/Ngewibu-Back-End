import { Module } from '@nestjs/common'

import { UserModule } from './user/user.module'
import { PrismaService } from './service/prisma.service'
import { UserService } from './user/user.service'

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [PrismaService, UserService],
})
export class AppModule { }
