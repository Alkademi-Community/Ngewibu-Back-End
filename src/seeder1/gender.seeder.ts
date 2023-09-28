import { PrismaClient } from '@prisma/client'

export default async function (prisma: PrismaClient) {
  console.log('Running Gender seeder.')

  try {
    await prisma.gender.createMany({
      data: [
        {
          id: 1,
          name: 'Male',
        },
        {
          id: 2,
          name: 'Female',
        },
      ],
    })
  } catch (e) {
    console.error('Failed to run gender seeder.')
  }
}
