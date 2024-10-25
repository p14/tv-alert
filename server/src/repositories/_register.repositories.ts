import { Container } from 'inversify';
import TYPES from '../setup/ioc.types';
import BlacklistRepository from './blacklist.repository';
import SubscriptionRepository from './subscription.repository';

export default function registerRepositories(container: Container) {
    /* Scoped */
    container
        .bind<BlacklistRepository>(TYPES.Repositories.Blacklist)
        .to(BlacklistRepository);
    container
        .bind<SubscriptionRepository>(TYPES.Repositories.Subscription)
        .to(SubscriptionRepository);
};
