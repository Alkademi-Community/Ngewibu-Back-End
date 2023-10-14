import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'
import { PrismaService } from 'src/service/prisma.service'
import { UserModule } from 'src/user/user.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from 'src/config/jwt.config'
import { MailModule } from 'src/mail/mail.module'
import { SessionService } from 'src/service/session.service'

@Module({
  controllers: [AuthController],
  imports: [
    MailModule,
    UserModule,
    PassportModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],

  providers: [AuthService, UserService, PrismaService, SessionService],
})
export class AuthModule { }
