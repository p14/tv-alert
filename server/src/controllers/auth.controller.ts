import { Request } from 'express';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, httpPost, request } from 'inversify-express-utils';
import TYPES from '../setup/ioc.types';
import AuthService from '../services/auth.service';

@controller(TYPES.Namespace.Auth)
export default class AuthController extends BaseHttpController {
    private authService: AuthService;

    constructor(
        @inject(TYPES.Services.Auth) authService: AuthService,
    ) {
        super();
        this.authService = authService;
    }

    @httpPost('/send-verification-link')
    public async login(
        @request() req: Request,
    ) {
        try {
            const { email } = req.body;

            await this.authService.sendVerificationLink({ email });
            return this.statusCode(204);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }

    @httpGet('/redirect')
    public async authRedirect(
        @request() req: Request,
    ) {
        try {
            const { email, expires, signature } = req.query as { email: string, expires: string, signature: string };

            // Validate signature and parameters
            await this.authService.validateAuthSignature({ email, expires, signature });

            // Validate expiration
            if (Date.now() > Number(expires)) {
                const params = new URLSearchParams({ email });
                return this.redirect(`${process.env.CLIENT_URL}/expired?${params}`);
            }

            const params = new URLSearchParams({ email, expires, signature });
            return this.redirect(`${process.env.CLIENT_URL}/redirect?${params}`);
        } catch (e: any) {
            console.error(e.message);
            return this.redirect(`${process.env.CLIENT_URL}/error?message=${encodeURIComponent(e.message)}`);
        }
    }

    @httpPost('/blacklist')
    public async blacklist(
        @request() req: Request,
    ) {
        try {
            const { email, expires, signature } = req.query as { email: string, expires: string, signature: string };

            // Validate signature and parameters
            await this.authService.validateAuthSignatureForBlacklist({ email, expires, signature });

            // Validate expiration
            if (Date.now() > Number(expires)) {
                const params = new URLSearchParams({ email });
                return this.redirect(`${process.env.CLIENT_URL}/expired?${params}`);
            }

            await this.authService.blacklistEmail({ email });
            return this.redirect(`${process.env.CLIENT_URL}/blacklist`);
        } catch (e: any) {
            console.error(e.message);
            return this.redirect(`${process.env.CLIENT_URL}/error?message=${encodeURIComponent(e.message)}`);
        }
    }
}
