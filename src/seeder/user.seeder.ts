import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'

export default async function (prisma: PrismaClient) {
  console.log('Running user seeder.')

  const password = await bcrypt.hash('password', 10)
  const users = [
    {
      id: 1,
      username: 'admin',
      password,
      email: 'admin@ngewibu.com',
      roleId: 2,
    },
  ]

  for (let i = 2; i < 12; i++) {
    users.push({
      id: i,
      username: faker.internet.userName().toLocaleLowerCase(),
      email: faker.internet.email().toLocaleLowerCase(),
      password,
      roleId: 1,
    })
  }

  try {
    await prisma.user.deleteMany()
    await prisma.user.createMany({
      data: users,
    })
  } catch (e) {
    console.log(e)
    console.error('Failed to run user seeder')
  }
}
