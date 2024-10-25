import { Request } from 'express';
import { inject } from 'inversify';
import {
    BaseHttpController, controller, request,
    httpGet, httpPost, httpDelete,
} from 'inversify-express-utils';
import TYPES from '../setup/ioc.types';
import AuthService from '../services/auth.service';
import SubscriptionService from '../services/subscription.service';

@controller(TYPES.Namespace.Subscription)
export default class SubscriptionController extends BaseHttpController {
    private authService: AuthService;

    private subscriptionService: SubscriptionService;

    constructor(
        @inject(TYPES.Services.Auth) authService: AuthService,
        @inject(TYPES.Services.Subscription) subscriptionService: SubscriptionService,
    ) {
        super();
        this.authService = authService;
        this.subscriptionService = subscriptionService;
    }

    @httpGet('/')
    public async getSubscription(
        @request() req: Request,
    ) {
        try {
            const { email, expires, signature } = req.query as { email: string, expires: string, signature: string };

            // Validate auth signature
            await this.authService.validateAuthSignature({ email, expires, signature });

            // Retrieve subscription media content by email
            const content = await this.subscriptionService.listSubscriptionContentByEmail({ email });
            return this.json(content, 200);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }

    @httpPost('/')
    public async addMediaToSubscription(
        @request() req: Request,
    ) {
        try {
            const { email, expires, mediaId, signature } = req.body as { email: string, expires: string, mediaId: string, signature: string };

            // Validate auth signature
            await this.authService.validateAuthSignature({ email, expires, signature });

            // Validate expiration
            if (Date.now() > Number(expires)) {
                return this.json('User session expired.', 400);
            }

            // Create the new subscription
            await this.subscriptionService.createSubscription({ email, mediaId });
            return this.statusCode(201);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }

    @httpGet('/shallow-info')
    public async getSubscriptionsShallowInfo(
        @request() req: Request,
    ) {
        try {
            const { email, expires, signature } = req.query as { email: string, expires: string, signature: string };

            // Validate auth signature
            await this.authService.validateAuthSignature({ email, expires, signature });

            // Retrieve subscription media content by email
            const content = await this.subscriptionService.listSubscriptionIdsByEmail({ email });
            return this.json(content, 200);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }

    @httpDelete('/:mediaId')
    public async deleteMediaFromSubscription(
        @request() req: Request,
    ) {
        try {
            const { email, expires, signature } = req.body as { email: string, expires: string, signature: string };
            const { mediaId } = req.params as { mediaId: string };

            // Validate auth signature
            await this.authService.validateAuthSignature({ email, expires, signature });

            // Validate expiration
            if (Date.now() > Number(expires)) {
                return this.json('User session expired.', 400);
            }

            await this.subscriptionService.deleteSubscription({ email, mediaId });
            return this.statusCode(204);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }
}
