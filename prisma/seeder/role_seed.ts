// Role seeder
function fakerRole(): any {
    return [
        {
            name: "admin",
        }, {
            name: "user"
        }
    ]
};

export async function RoleSeeder(prisma, faker) {
    let role = fakerRole()
    for (let i = 0; i < role.length; i++) {
        await prisma.role.create({ data: role[i] });
    }
};