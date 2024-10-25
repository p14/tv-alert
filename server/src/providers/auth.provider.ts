import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { interfaces } from 'inversify-express-utils';
import AuthService from '../services/auth.service';
import Principal from './principal.provider';
import container from '../setup/ioc.config';
import TYPES from '../setup/ioc.types';

@injectable()
export default class AuthProvider implements interfaces.AuthProvider {
    private authService = container.get<AuthService>(TYPES.Services.Auth);

    private publicRoutes: Record<string, string[]> = {
        DELETE: [],
        GET: [
            '/',
            '/api/status-check',
            '/api/generate-workout',
        ],
        POST: [
            '/auth/login',
            '/auth/register',
        ],
        PUT: [],
        OPTIONS: [
            '/',
            '/api/status-check',
            '/api/generate-workout',
            '/auth/login',
            '/auth/register',
        ],
    };

    public async getUser(
        req: Request,
        _res: Response,
        _next: NextFunction,
    ): Promise<interfaces.Principal> {
        const bearerToken = req.headers.authorization ?? '';
        let response = {};

        // if (!this.publicRoutes[req.method].includes(req.path) && bearerToken) {
        //     response = await this.authService.getUser(bearerToken);
        // }

        return new Principal({ ...response });
    }
}
