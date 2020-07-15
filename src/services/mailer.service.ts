import * as nodemailer from 'nodemailer';
const dotenv = require("dotenv");

dotenv.config();

const translation = {
    subject: {
        en: 'Reset your Password',
        fr: 'Réinitialisation de votre mot de passe',
    },
    fSentence: {
        en: 'We received a request to reset your password related to the following email',
        fr: 'Nous avons reçu une demande de réinitialisation du mot de passe associé à votre email',
    },
    sSentence: {
        fr: 'Si vous n\'avez pas fait de demande, vous pouvez ignorer ce mail.',
        en: 'If you did not made this request, please ignore this email.',
    },
    tSentence: {
        en: 'To reset your password, please click the button below.',
        fr: 'Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous.',
    },
    reinit: {
        en: 'Reset My Password',
        fr: 'Réinitialiser Mon Mot De Passe',
    },
    morning: {
        en: 'Hello',
        fr: 'Bonjour',
    },
    alternative: {
        en: 'If the button above does not work, try copying and pasting the following URL into your browser:',
        fr: 'Si le bouton ci-dessus ne fonctionne pas, essayez de copier et coller l\'URL suivante dans votre navigateur:',
    },
    sincerely: {
        en: 'Sincerely',
        fr: 'Cordialement',
    },
    team: {
        en: 'Team',
        fr: 'Equipe',
    },
};

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
        const lang = 'en';
        return await this.transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: to,
            subject: 'Reset Password',
            html: `
                  <html lang="en">
        <body style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
            <div style="width:600px; margin: auto;">
                <div style="margin-bottom:55px">
                    <img src="https://static.wixstatic.com/media/713d88_e9deee7c97044b14a9607dc75c8dcc4d~mv2.png/v1/crop/x_0,y_4,w_1145,h_1006/fill/w_298,h_258,al_c,q_85,usm_0.66_1.00_0.01/Avatar%20Twitter.webp">
                </div>
                ${translation.morning[lang]},<br><br>
                ${translation.fSentence[lang]} <a href="mailto:${to}">${to}</a>.<br><br>
                ${translation.sSentence[lang]}<br><br>
                ${translation.tSentence[lang]}<br>
            </div>
            <a href="${"test"}" style="text-decoration: none">
                <div style="width: 200px;
                            height: 35px;
                            margin: 50px auto;
                            color: white;
                            font-size: 18px;
                            padding-top: 10px;
                            text-align: center;
                            border-radius: 5px;
                            background-color:#E43E37"
                >
                    ${translation.reinit[lang]}
                </div>
            </a>
            <div style="width:500px; margin: auto">
                <i>${translation.alternative[lang]}</i><br><br>
                <a href="${"test"}" style="word-wrap: break-word; font-size: 14px; color: black">
                    ${"tte"}
                </a>
            </div>
            <br><br><br>
            <div style="width:600px; margin: auto">
                ${translation.sincerely[lang]},<br>
                ${translation.team[lang]} BackInApp
            </div>
        </body>
    </html>
          
            `,
        });
    }
}
