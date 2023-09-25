import { PrismaClient } from '@prisma/client'
import userSeeder from './user.seeder'
import roleSeeder from './role.seeder'
import genderSeeder from './gender.seeder'
const prisma = new PrismaClient()

async function main() {
  roleSeeder(prisma)
  genderSeeder(prisma)
  userSeeder(prisma)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
