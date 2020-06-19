import * as nodemailer from 'nodemailer';

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

    constructor() {}
    
    public static getInstance(): MailerService {
        if(!MailerService.instance) {
            MailerService.instance = new MailerService();
        }
        return MailerService.instance;
    }

    public async sendEmail(to: string, newPassword: String) {
        return await this.transporter.sendMail({
            from: process.env.MAILER_EMAIL,
            to: to,
            subject: 'Reset Password',
            html: `<p> Here, your new password generated ${newPassword} (write it down somewhere), 
            if you want to change your password, login to your account.</p>`,
        });
    }
}