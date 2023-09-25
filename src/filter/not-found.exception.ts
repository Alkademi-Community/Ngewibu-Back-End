import {
  NotFoundException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common'
import { exceptionHandler } from 'src/utils/exeption-handler.util'

/**
 * catch NotFoundException and custom the response
 * @param {any} NotFoundException
 * @returns {any}
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    exceptionHandler(exception, host)
  }
}
