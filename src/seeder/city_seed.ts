// City seeder
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from "rxjs";

async function fakerCity(): Promise<any> {
    try {
        let result = []
        let request = new HttpService()
        let response = await lastValueFrom(
            await request.get('http://api.iksgroup.co.id/apilokasi/provinsi?t=11')
        );

        let provincies = response.data.data

        for (let i = 0; i < provincies.length; i++) {
            response = await lastValueFrom(
                await request.get('http://api.iksgroup.co.id/apilokasi/kabupaten?provinsi=' + provincies[i].provinsi_id)
            );

            let cities = response.data.data

            for (let j = 0; j < cities.length; j++) {
                result.push({
                    id: parseInt(cities[j].kabupatenkota_id),
                    name: cities[j].kabupatenkota_nama
                })
            }
        }
        return result

    } catch (error) {
        console.log({ error })
    }
};

export async function CitySeeder(prisma, faker) {
    let cities = await fakerCity()
    for (let i = 0; i < cities.length; i++) {
        await prisma.city.create({ data: cities[i] });
    }
};

// http://api.iksgroup.co.id/apilokasi/provinsi?t=1
// http://api.iksgroup.co.id/apilokasi/kabupaten?provinsi=11

// firstValueFrom(
//     this.httpService.get(`http://some-url.com`)
// ).then(value => {
//     /* Do something with value */
// });