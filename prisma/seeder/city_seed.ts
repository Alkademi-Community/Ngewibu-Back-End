// City seeder
function fakerCity(faker): any {
    return [
        {
            name: "city",
        }, {
            name: "city1"
        }, {
            name: "city2"
        }
    ]
};

export async function CitySeeder(prisma, faker) {
    let cities = fakerCity(faker)
    for (let i = 0; i < cities.length; i++) {
        await prisma.city.create({ data: cities[i] });
    }
};