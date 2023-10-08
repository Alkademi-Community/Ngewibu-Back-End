import { Prisma } from '@prisma/client'

export type UserWithRole = Prisma.UserGetPayload<{
  include: {
    role: true
  }
}>

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export type UsernameType = string | null
export type PasswordType = string | null
