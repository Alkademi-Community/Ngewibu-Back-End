// Like seeder
function fakerLikeType(): any {
    return [
        {
            name: "to_post",
        }, {
            name: "to_comment"
        }
    ]
};

function fakerLike(faker): any {
    return {
        eventId: faker.number.int({ min: 1, max: 10 }),
        commentId: faker.helpers.arrayElement([null, null, null, null, null, null, null, 2, null, 1, null, 1, null, null, 2, 2, null, null, null, null]),
        userId: faker.number.int({ min: 1, max: 10 }),
        // typeId: faker.number.int({ min: 1, max: 2 }),
        like: 1,
    }
};

export async function LikeSeeder(prisma, faker) {
    // let like_type = fakerLikeType()
    // for (let i = 0; i < like_type.length; i++) {
    //     await prisma.likeType.create({ data: like_type[i] });
    // }

    for (let i = 0; i < 10; i++) {
        let like = fakerLike(faker)
        await prisma.like.create({ data: like });
    }
};
