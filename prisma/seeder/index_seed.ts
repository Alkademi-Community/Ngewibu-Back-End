// index seed.ts
import { PrismaClient } from '../prisma-generated/client';
import { faker, id_ID } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { GenderSeeder } from './gender_seed';
import { RoleSeeder } from './role_seed';
import { UserSeeder } from './user_seed';
import { EventTypeSeeder } from './event_type_seed';
import { EventStatusSeeder } from './event_status_seed';
import { EventSeeder } from './event_seed';
import { EventParticipantsSeeder } from './event_participant_seed';
import { CommentSeeder } from './comment_seed';
import { LikeSeeder } from './like_seed';
import { CitySeeder } from './city_seed';

const prisma = new PrismaClient();
// const faker = new Faker({ locale: [id_ID] });

async function main() {
    dotenv.config();
    console.log('Seeding...');
    /// --------- Genders ---------------
    await GenderSeeder(prisma, faker)

    /// --------- Roles ---------------
    await RoleSeeder(prisma, faker)

    /// --------- Users ---------------
    await UserSeeder(prisma, faker)

    /// --------- Cities Type ---------------
    await CitySeeder(prisma, faker)

    /// --------- Events Type ---------------
    await EventTypeSeeder(prisma, faker)

    /// --------- Event Statuses ---------------
    await EventStatusSeeder(prisma, faker)

    /// --------- Events ---------------
    await EventSeeder(prisma, faker)

    /// --------- Event Participants ---------------
    await EventParticipantsSeeder(prisma, faker)

    /// --------- Comments ---------------
    await CommentSeeder(prisma, faker)

    /// --------- Likes ---------------
    await LikeSeeder(prisma, faker)
};

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });