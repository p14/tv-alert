import { injectable } from 'inversify';
import { SubscriptionDocument, subscriptionSchema } from '../models/subscription.model';
import Repository from './_repository';

/* istanbul ignore next */
@injectable()
export default class SubscriptionRepository extends Repository<SubscriptionDocument> {
    public constructor() {
        super('subscriptions', subscriptionSchema);
    }
}
