import { Prisma } from '@prisma/client'

export class User implements Prisma.usersCreateInput {
  id: number
  name: string
  email: string
  password: string
  token?: string
  reset_password_token?: string
}
