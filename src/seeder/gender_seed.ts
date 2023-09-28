// Gender seeder
function fakerGender(faker): any {
    return [
        {
            name: "male",
        }, {
            name: "female"
        }
    ]
};

export async function GenderSeeder(prisma, faker) {
    let gender = fakerGender(faker)
    for (let i = 0; i < gender.length; i++) {
        await prisma.gender.create({ data: gender[i] });
    }
};