import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import configuration, { ExtraConfigLoad } from './config/configuration'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration, ...ExtraConfigLoad],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
