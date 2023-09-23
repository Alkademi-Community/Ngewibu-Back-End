import { Prisma } from '@prisma/client'

export class User implements Prisma.usersCreateInput {
  id: number
  name: string
  // username: string
  email: string
  password: string
  token?: string
  reset_password_token?: string
  created_at?: string | Date
  updated_at?: string | Date
  deleted_at?: string | Date
}
