import { inject, injectable } from 'inversify';
import cron from 'node-cron';
import pLimit from 'p-limit';
import MailerService from './mailer.service';
import { SendNotificationEmailRequest } from '../types/cron.types';
import TYPES from '../setup/ioc.types';
import IntegrationService from './integration.service';
import BlacklistRepository from '../repositories/blacklist.repository';
import SubscriptionRepository from '../repositories/subscription.repository';

@injectable()
export default class CronService {
    private tvdbLimit = pLimit(10);
    private emailLimit = pLimit(3);

    private integrationService: IntegrationService;
    private mailerService: MailerService;
    private blacklistRepository: BlacklistRepository;
    private subscriptionRepository: SubscriptionRepository;

    constructor(
        @inject(TYPES.Services.Integration) integrationService: IntegrationService,
        @inject(TYPES.Services.Mailer) mailerService: MailerService,
        @inject(TYPES.Repositories.Blacklist) blacklistRepository: BlacklistRepository,
        @inject(TYPES.Repositories.Subscription) subscriptionRepository: SubscriptionRepository,
    ) {
        this.integrationService = integrationService;
        this.mailerService = mailerService;
        this.blacklistRepository = blacklistRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.initializeCronJobs(); // Schedule the cron jobs
    }

    private initializeCronJobs() {
        cron.schedule('0 0 * * *', this.handleDailyPoll.bind(this));
        // cron.schedule('*/1 * * * *', this.handleDailyPoll.bind(this));
    }

    public async handleDailyPoll(): Promise<void> {
        console.log('***** STARTING NIGHTLY POLL *****');

        try {
            // Get all blacklisted email addresses
            const blacklist = await this.blacklistRepository.find({});
            const blacklistedEmails = blacklist.map((blacklistedDocument) => blacklistedDocument.email);

            // Pull all subscriptions and group by email address
            const allSubscriptions = await this.subscriptionRepository.find({});

            // Track the number of emails sent out
            let sentEmails = 0;

            // Loop through each user's subscriptions and see if there is a new episode today
            await Promise.allSettled(
                allSubscriptions
                    .filter((userSubscription) => !blacklistedEmails.includes(userSubscription.email))
                    .map(async (userSubscription) => {
                        const seriesToday = await this.getSeriesPremieringToday(userSubscription.mediaIds);
                        await this.sendNotificationEmail({ email: userSubscription.email, seriesToday });
                        sentEmails++;
                    })
            );

            // Log the numbers of emails sent
            console.log(`Sent notifications to ${sentEmails} out of the ${allSubscriptions.length} users polled.`);
        } catch (error) {
            console.error('Error during nightly poll:', error);
        }

        console.log('****** ENDING NIGHTLY POLL ******');
    }

    private async getSeriesPremieringToday(mediaIds: string[]): Promise<string[]> {
        const seriesToday: string[] = [];

        await Promise.all(
            mediaIds.map((mediaId) =>
                this.tvdbLimit(async () => {
                    try {
                        const content = await this.integrationService.getShow(mediaId);
                        if (content.nextAiredDate && CronService.checkWithinNextHours(content.nextAiredDate)) {
                            seriesToday.push(content.name);
                        }
                    } catch {
                        console.error(`Cron job error: Failed to retrieve media content ${mediaId}.`);
                    }
                })
            )
        );

        return seriesToday;
    }

    private static checkWithinNextHours(dateString: string): boolean {
        const inputDate = new Date(dateString);
        const today = new Date();

        return (
            inputDate.getUTCFullYear() === today.getUTCFullYear() &&
            inputDate.getUTCMonth() === today.getUTCMonth() &&
            inputDate.getUTCDate() === today.getUTCDate()
        );
    }

    private async sendNotificationEmail({ email, seriesToday }: SendNotificationEmailRequest): Promise<void> {
        if (seriesToday.length > 0) {
            this.emailLimit(async () => {
                try {
                    await this.mailerService.sendDailyNotification({ email, seriesToday });
                } catch {
                    console.error(`Cron job error: Failed to send email to ${email}.`);
                }
            });
        }
    }
}
