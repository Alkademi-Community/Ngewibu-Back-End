import {
  InternalServerErrorException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common'
import { exceptionHandler } from 'src/utils/exeption-handler.util'

/**
 * catch InternalServerErrorException and custom the response
 * @param {any} InternalServerErrorException
 * @returns {any}
 */
@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    exceptionHandler(exception, host)
  }
}
