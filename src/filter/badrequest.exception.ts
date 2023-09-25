import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common'
import { exceptionHandler } from 'src/utils/exeption-handler.util'

/**
 * To catch validation error from class validator and custom it
 * @param {any} BadRequestException
 * @returns {any}
 */
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    exceptionHandler(exception, host)
  }
}
