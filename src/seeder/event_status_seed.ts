
function fakerEventStatus(): any {
    return [
        {
            name: "Pending",
        }, {
            name: "Confirmed"
        }, {
            name: "Canceled"
        }, {
            name: "Completed"
        }, {
            name: "In Progress"
        }
    ]
};

export async function EventStatusSeeder(prisma, faker) {
    let event_status = fakerEventStatus()
    for (let i = 0; i < event_status.length; i++) {
        await prisma.eventStatus.create({ data: event_status[i] });
    }
};