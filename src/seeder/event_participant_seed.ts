// Event Participants seeder
function fakerEventParticipant(faker): any {
    return {
        eventId: faker.number.int({ min: 1, max: 10 }),
        userId: faker.number.int({ min: 1, max: 10 }),
    }
};

export async function EventParticipantsSeeder(prisma, faker) {
    for (let i = 0; i < 10; i++) {
        let participant = fakerEventParticipant(faker)
        await prisma.eventParticipant.create({ data: participant });
    }
};