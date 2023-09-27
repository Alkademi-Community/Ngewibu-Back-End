export interface ResponseData {
  status: boolean
  status_code: number
  message: string
  errors?: string[] | object | string
  data?: object | array
}

export interface ValidatorResponseData {
  message: string[] | string | object
  error: string
  statusCode: number
}
