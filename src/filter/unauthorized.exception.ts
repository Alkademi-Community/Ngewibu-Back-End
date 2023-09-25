import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common'
import { exceptionHandler } from 'src/utils/exeption-handler.util'

/**
 * catch unothorizedexception and custom the response
 * @param {any} UnauthorizedException
 * @returns {any}
 */
@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    exceptionHandler(exception, host)
  }
}
