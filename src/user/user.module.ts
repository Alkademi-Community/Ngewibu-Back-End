import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from 'src/service/prisma.service'
import { SessionService } from 'src/service/session.service'
import { JwtService } from '@nestjs/jwt'
import { UserProfileService } from './user-profile.service'

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    SessionService,
    JwtService,
    UserProfileService,
  ],
})
export class UserModule {}
