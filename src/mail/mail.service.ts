import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async forgotPassword(user: User, token: string) {
        const url = `http://localhost:8080/auth/confirm?token=${token}`;

        let result = await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Reset your password by click the button',
            template: './forgot-password', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.username,
                url,
            },
        });
        console.log({ result })
    }
}
