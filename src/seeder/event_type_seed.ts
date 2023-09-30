
function fakerEventType(): any {
    return [
        {
            name: "online",
        }, {
            name: "offline"
        }
    ]
};

export async function EventTypeSeeder(prisma, faker) {
    let event_type = fakerEventType()
    for (let i = 0; i < event_type.length; i++) {
        await prisma.eventType.create({ data: event_type[i] });
    }
};