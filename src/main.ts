import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { ValidationPipe } from '@nestjs/common'
import { BadRequestExceptionFilter } from './filter/badrequest.exception'
import { UnauthorizedExceptionFilter } from './filter/unauthorized.exception'
import { NotFoundExceptionFilter } from './filter/not-found.exception'
import { InternalServerErrorExceptionFilter } from './filter/internal-server-error.exeption'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const globalPrefix =
    config.get<string>('APP_ENV') === 'local' ? 'api/v1' : 'v1'

  app.setGlobalPrefix(globalPrefix)

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new BadRequestExceptionFilter())
  app.useGlobalFilters(new NotFoundExceptionFilter())
  app.useGlobalFilters(new UnauthorizedExceptionFilter())
  app.useGlobalFilters(new InternalServerErrorExceptionFilter())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ngewibu API')
    .setDescription('Ngewibu API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
      },
      'Authorization',
    )
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)

  await app.listen(config.get('server_port'))
}
bootstrap()
