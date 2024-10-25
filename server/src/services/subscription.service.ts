import { inject, injectable } from 'inversify';
import TYPES from '../setup/ioc.types';
import SubscriptionRepository from '../repositories/subscription.repository';
import { MediaContent } from '../types/integrations.types';
import { CreateSubscriptionRequest, DeleteSubscriptionRequest, ListSubscriptionContentByEmailRequest } from '../types/subscriptions.types';
import IntegrationService from './integration.service';

@injectable()
export default class SubscriptionService {
    private subscriptionRepository: SubscriptionRepository;

    constructor(
        @inject(TYPES.Repositories.Subscription) subscriptionRepository: SubscriptionRepository,
    ) {
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Retrieves subscriptions and media content by the provided email address
     * @param {ListSubscriptionContentByEmailRequest} params 
     * @returns {Promise<MediaContent[]>}
     */
    public async listSubscriptionContentByEmail({
        email,
    }: ListSubscriptionContentByEmailRequest): Promise<MediaContent[]> {
        const subscription = await this.subscriptionRepository.findOne({ email });

        if (!subscription) {
            return [];
        }

        const integrationService = new IntegrationService();

        const { mediaContent, errors } = await subscription.mediaIds
            .reduce(async (accPromise, mediaId) => {
                const acc = await accPromise;

                try {
                    const mediaContent = await integrationService.getShow(mediaId);
                    acc.mediaContent.push({ ...mediaContent });
                } catch (error) {
                    acc.errors.push(mediaId);
                }

                return acc;
            }, Promise.resolve({
                mediaContent: [] as MediaContent[],
                errors: [] as string[],
            }));

        if (errors.length > 0) {
            console.error(`User ${email} could not retrieve the following media:`, errors);
        }

        return mediaContent;
    }

    /**
     * Retrieves subscriptions IDs by the provided email address
     * @param {ListSubscriptionContentByEmailRequest} params 
     * @returns {Promise<MediaContent[]>}
     */
    public async listSubscriptionIdsByEmail({
        email,
    }: ListSubscriptionContentByEmailRequest): Promise<string[]> {
        const subscription = await this.subscriptionRepository.findOne({ email });

        if (!subscription) {
            return [];
        }

        return subscription.toObject().mediaIds;
    }

    /**
     * Creates a new subscription
     * @param {CreateSubscriptionRequest} params
     * @returns {Promise<void>}
     */
    public async createSubscription({
        email,
        mediaId,
    }: CreateSubscriptionRequest): Promise<void> {
        await this.subscriptionRepository.updateOne(
            { email },
            {
                $addToSet: {
                    mediaIds: mediaId,
                },
                $setOnInsert: {
                    email,
                },
            },
            {
                upsert: true,
            }
        );
    }

    /**
     * Deletes a subscription by ID
     * @param {DeleteSubscriptionRequest} params
     * @returns {Promise<void>}
     */
    public async deleteSubscription({
        email,
        mediaId,
    }: DeleteSubscriptionRequest): Promise<void> {
        await this.subscriptionRepository.updateOne(
            { email },
            {
                $pull: {
                    mediaIds: mediaId,
                },
            },
        );
    }
}
