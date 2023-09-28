// prisma/seed.ts

function fakerUser(faker): [any, any] {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();

    let user = {
        username: faker.internet.userName({ firstName, lastName }),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 20, memorable: true }),
        roleId: faker.number.int({ min: 1, max: 2 }),
        token: faker.string.alpha(20),
        resetPasswordToken: faker.string.alpha(20),
        isActivated: faker.number.int(1),
        isVerified: faker.number.int(1)
    }

    let userProfile = {
        genderId: faker.number.int({ min: 1, max: 2 }),
        name: firstName + ' ' + lastName,
        address: faker.location.streetAddress({ useFullAddress: true }),
        bio: faker.word.words(30),
        dateOfBirth: faker.date.birthdate(),
        imageUrl: faker.image.url(),
    }

    return [user, userProfile]
};

export async function UserSeeder(prisma, faker) {
    for (let i = 0; i < 20; i++) {
        let [user, userProfile] = fakerUser(faker)
        user.id = i;
        userProfile.userId = i;

        await prisma.user.create({ data: user });
        await prisma.userProfile.create({ data: userProfile });
    }
};

module.exports = { UserSeeder }