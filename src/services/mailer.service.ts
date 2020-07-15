import * as nodemailer from 'nodemailer';
const fs = require('fs');

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
        let htmlStream = fs.createReadStream(process.cwd() + '/src/uploads/html/mailer.html')
        return await this.transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: to,
            subject: 'Reset Password',
            html: `<html>
            <head>
              <meta charset="utf-8">
              <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            </head>
            <body>
              <br>
              <div class="container">
                <div class="d-flex justify-content-center">
                  <image  width="150" height="150" src="https://static.wixstatic.com/media/713d88_e9deee7c97044b14a9607dc75c8dcc4d~mv2.png/v1/crop/x_0,y_4,w_1145,h_1006/fill/w_298,h_258,al_c,q_85,usm_0.66_1.00_0.01/Avatar%20Twitter.webp"></image>
                </div>
                <br>
                <div class="d-flex justify-content-center">
                  <h2>Réinitialisation du mot de passe</h2>
                </div>
                <div class="d-flex justify-content-center">
                  <h5>Voici votre nouveau mot de passe généré</h5>
                </div>
                <div class="d-flex justify-content-center">
                  <div class="card">
                    <div class="card-body" style="background-color: darkseagreen;">
                      <span style="color: white;">${newPassword}</span>
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>`,
        });
    }
}