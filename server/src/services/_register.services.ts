import { Container } from 'inversify';
import TYPES from '../setup/ioc.types';
import AuthService from './auth.service';
import SubscriptionService from './subscription.service';
import IntegrationService from './integration.service';
import MailerService from './mailer.service';
import CronService from './cron.service';

export default function registerServices(container: Container) {
    /* Scoped */
    container
        .bind<AuthService>(TYPES.Services.Auth)
        .to(AuthService);
    container
        .bind<IntegrationService>(TYPES.Services.Integration)
        .to(IntegrationService);
    container
        .bind<SubscriptionService>(TYPES.Services.Subscription)
        .to(SubscriptionService);

    /* Singleton */
    container
        .bind<CronService>(TYPES.Services.Cron)
        .to(CronService)
        .inSingletonScope();
    container
        .bind<MailerService>(TYPES.Services.Mailer)
        .to(MailerService)
        .inSingletonScope();
};
