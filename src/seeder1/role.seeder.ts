import { PrismaClient } from '@prisma/client'

export default async function (prisma: PrismaClient) {
  console.log('Running role seeder.')

  try {
    await prisma.role.createMany({
      data: [
        {
          id: 1,
          name: 'Member',
        },
        {
          id: 2,
          name: 'Admin',
        },
      ],
    })
  } catch (e) {
    console.error('Failed to run role seeder.')
  }
}
