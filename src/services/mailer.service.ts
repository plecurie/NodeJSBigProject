import * as nodemailer from 'nodemailer';
const dotenv = require("dotenv");

dotenv.config();

export class MailerService {
    private static instance: MailerService;

    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASS
        }
    });

    constructor() {
    }

    public static getInstance(): MailerService {
        if (!MailerService.instance) {
            MailerService.instance = new MailerService();
        }
        return MailerService.instance;
    }

    public async sendEmail(to: string, newPassword: String) {
        return await this.transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: to,
            subject: 'Reset Password',
            html: `
                  <html lang="en">
                    <body style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
                        <div style="width:600px; margin: auto;">
                            <div style="margin-bottom: 40px;margin-left: 1rem">
                                <img src="https://static.wixstatic.com/media/713d88_e9deee7c97044b14a9607dc75c8dcc4d~mv2.png/v1/crop/x_0,y_4,w_1145,h_1006/fill/w_298,h_258,al_c,q_85,usm_0.66_1.00_0.01/Avatar%20Twitter.webp">
                            </div>
                            <h1 style="margin-bottom: 0rem;font-family: inherit;font-weight: 500;line-height: 0;color: black;">Réinitialisation du mot de passe</h1><br><br>
                            <h3 style="margin-bottom: .5rem;font-family: inherit;font-weight: 500;color: black;margin-top: 0;font-size: large;margin-left: 0.8rem;">Voici votre nouveau mot de passe généré</h3><br>
                            <p style="font-family: inherit;font-weight: 500;line-height: 1.2;color: inherit;margin-top: 0;font-size: x-large;margin-left: 4rem;">${newPassword}</p><br>
                        </div>
                    </body>
                </html>
            `,
        });
    }
}
