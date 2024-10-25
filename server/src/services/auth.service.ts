import { compare } from 'bcrypt';
import * as dotenv from 'dotenv';
import { inject, injectable } from 'inversify';
import TYPES from '../setup/ioc.types';
import BlacklistRepository from '../repositories/blacklist.repository';
import { AuthSignatureData, BlacklistEmailRequest, SendVerificationLinkRequest } from '../types/auth.types';
import MailerService from './mailer.service';

dotenv.config();

@injectable()
export default class AuthService {
    private blacklistRepository: BlacklistRepository;

    private mailerService: MailerService;

    constructor(
        @inject(TYPES.Repositories.Blacklist) blacklistRepository: BlacklistRepository,
        @inject(TYPES.Services.Mailer) mailerService: MailerService,
    ) {
        this.blacklistRepository = blacklistRepository;
        this.mailerService = mailerService;
    }

    /**
     * Sends an auth validation link to the provided email address
     * If the email address is blacklisted, then no email will be sent to mitigate numeration attacks
     * @param {SendVerificationLinkRequest} params
     * @returns {Promise<void>}
     */
    public async sendVerificationLink({
        email,
    }: SendVerificationLinkRequest): Promise<void> {
        const blacklisted = await this.blacklistRepository.findOne({ email });

        if (!blacklisted) {
            await this.mailerService.sendVerificationLink({ email });
        }
    }

    /**
     * Validates the auth signature with the email and expiration provided
     * @param {AuthSignatureData} params
     * @returns {Promise<void>}
     */
    public async validateAuthSignature({
        email,
        expires,
        signature,
    }: AuthSignatureData): Promise<void> {
        const signatureDataToValidate = JSON.stringify({ email, expires, secret: process.env.SECRET_KEY });
        const isValid = await compare(signatureDataToValidate, signature);

        if (!isValid) {
            throw new Error('Invalid signature.');
        }

        const blacklisted = await this.blacklistRepository.findOne({ email });

        if (blacklisted) {
            throw new Error('Authentication failed.');
        }
    }

    /**
     * Validates the auth signature with the email and expiration provided for blacklisting action
     * @param {AuthSignatureData} params
     * @returns {Promise<void>}
     */
    public async validateAuthSignatureForBlacklist({
        email,
        expires,
        signature,
    }: AuthSignatureData): Promise<void> {
        const signatureDataToValidate = JSON.stringify({ email, expires, secret: process.env.SECRET_KEY });
        const isValid = await compare(signatureDataToValidate, signature);

        if (!isValid) {
            throw new Error('Invalid signature.');
        }
    }

    /**
     * Adds an email to a blacklist collection to prevent receiving future emails
     * @param {BlacklistEmailRequest} params
     * @returns {Promise<void>}
     */
    public async blacklistEmail({
        email,
    }: BlacklistEmailRequest): Promise<void> {
        const blacklisted = await this.blacklistRepository.findOne({ email });

        if (blacklisted) {
            throw new Error('This email is already blacklisted.');
        }

        const blacklistEmail = await this.blacklistRepository.create({ email });
        await blacklistEmail.save();
    }
}
