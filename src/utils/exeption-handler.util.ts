import { ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import { ResponseData, ValidatorResponseData } from 'src/types/response'

export function exceptionHandler(exception: any, host: ArgumentsHost) {
  const ctx = host.switchToHttp()
  const response = ctx.getResponse<Response>()
  const status = exception.getStatus()

  const exceptionResponse: ValidatorResponseData =
    exception.getResponse() as ValidatorResponseData
  let responseData: ResponseData

  if (Array.isArray(exceptionResponse?.message)) {
    responseData = {
      status: false,
      status_code: status,
      message: 'Validation fails, please fill the given form correctly.',
      errors: exceptionResponse?.message ?? [],
    }
  }

  responseData = {
    status: false,
    status_code: status,
    message: exceptionResponse?.message as string,
  }

  response.status(status).json(responseData)
}
