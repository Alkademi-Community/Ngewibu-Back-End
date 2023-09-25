
function fakerEvent(faker): any {
    return {
        eventTypeId: faker.number.int({ min: 1, max: 2 }),
        eventStatusId: faker.number.int({ min: 1, max: 5 }),
        cityId: faker.number.int({ min: 1, max: 2 }),
        title: faker.word.words({ count: { min: 3, max: 7 } }),
        slug: faker.lorem.slug({ min: 3, max: 4 }),
        description: faker.word.words(30),
        address: faker.location.streetAddress({ useFullAddress: true }),
        mapUrl: faker.internet.url(),
        meetUrl: faker.internet.url(),
        startDate: faker.date.anytime(),
        endDate: faker.date.anytime(),
    }
};

export async function EventSeeder(prisma, faker) {
    for (let i = 0; i < 10; i++) {
        let event = fakerEvent(faker)
        await prisma.event.create({ data: event });
    }
};