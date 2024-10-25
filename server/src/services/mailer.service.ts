import { hash } from 'bcrypt';
import dotenv from 'dotenv';
import { injectable } from 'inversify';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { AuthSignatureData } from '../types/auth.types';
import { DailyNotificationRequest, VerificationLinkRequest } from '../types/mailer.types';
import { buildDailyNotificationEmail, buildMagicLinkEmail } from '../utilities/email_templates';

dotenv.config();

@injectable()
export default class MailerService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = MailerService.buildTransporter();
    }

    /**
     * Builds a nodemailer transporter to handle sending emails
     * @returns {Transporter<SMTPTransport.SentMessageInfo>}
     */
    private static buildTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
        return createTransport({
            host: `${process.env.MAILER_HOST}`,
            secure: true,
            port: Number(process.env.MAILER_PORT),
            auth: {
                user: `${process.env.MAILER_USER}`,
                pass: `${process.env.MAILER_PASS}`,
            },
        });
    }

    /**
     * Sends a verification link via email to the provided email address
     * @param {VerificationLinkRequest} params
     * @returns {Promise<void>}
     */
    public async sendVerificationLink({
        email,
    }: VerificationLinkRequest): Promise<void> {
        const signatureData = await this.createAuthSignature({ email });
        const params = new URLSearchParams(signatureData);

        await this.transporter.sendMail({
            from: {
                name: 'TV Alert',
                address: `${process.env.MAILER_USER}`,
            },
            to: email,
            subject: 'Verify Your Email to Access TV Alert',
            html: buildMagicLinkEmail({ params }),
        });
    }

    /**
     * Creates an auth signature for the provided email address
     * @param {VerificationLinkRequest} params
     * @returns {Promise<AuthSignatureData>}
     */
    private async createAuthSignature({
        email,
    }: VerificationLinkRequest): Promise<AuthSignatureData> {
        const expires = String(Date.now() + (1000 * 60 * 60 * 24)); // 1 day from now
        const signatureData = JSON.stringify({ email, expires, secret: process.env.SECRET_KEY });
        const signature = await hash(signatureData, 12);

        return { email, expires, signature };
    }

    /**
     * Sends a daily notification via email to the provided email address
     * @param {VerificationLinkRequest} params
     * @returns {Promise<void>}
     */
    public async sendDailyNotification({
        email,
        seriesToday,
    }: DailyNotificationRequest): Promise<void> {
        const signatureData = await this.createAuthSignature({ email });
        const params = new URLSearchParams(signatureData);

        const date = new Date();
        const formattedDate = date.toLocaleString('default', {
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        await this.transporter.sendMail({
            from: {
                name: 'TV Alert',
                address: `${process.env.MAILER_USER}`,
            },
            to: email,
            subject: `New Episodes of Your Favorite Shows (${formattedDate})`,
            html: buildDailyNotificationEmail({ seriesToday, params }),
        });
    }
}
