
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
        parentId: faker.number.int({ min: 1, max: 20 }),
        typeId: faker.number.int({ min: 1, max: 2 }),
        content: faker.word.words({ count: { min: 3, max: 30 } }),
    }
};

export async function CommentSeeder(prisma, faker) {
    let comment_type = fakerCommentType()
    for (let i = 0; i < comment_type.length; i++) {
        await prisma.commentType.create({ data: comment_type[i] });
    }

    for (let i = 0; i < 10; i++) {
        let comment = fakerComment(faker)
        await prisma.comment.create({ data: comment });
    }
};