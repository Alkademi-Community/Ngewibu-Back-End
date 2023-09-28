
function fakerCommentType(): any {
    return [
        {
            name: "to_post",
        }, {
            name: "to_reply"
        }
    ]
};

function fakerComment(faker): any {
    return {
        userId: faker.number.int({ min: 1, max: 10 }),
        eventId: faker.number.int({ min: 1, max: 10 }),
        commentId: faker.helpers.arrayElement([null, null, null, null, null, null, null, 2, null, 1, null, 1, null, null, 2, 2, null, null, null, null]),
        // typeId: faker.number.int({ min: 1, max: 2 }),
        content: faker.word.words({ count: { min: 3, max: 30 } }),
    }
};

export async function CommentSeeder(prisma, faker) {
    // let comment_type = fakerCommentType()
    // for (let i = 0; i < comment_type.length; i++) {
    //     await prisma.commentType.create({ data: comment_type[i] });
    // }

    for (let i = 0; i < 30; i++) {
        let comment = fakerComment(faker)
        await prisma.comment.create({ data: comment });
    }
};
