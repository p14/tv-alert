import { Request } from 'express';
import { inject } from 'inversify';
import {
    BaseHttpController, controller,
    httpGet, request,
} from 'inversify-express-utils';
import TYPES from '../setup/ioc.types';
import IntegrationService from '../services/integration.service';

@controller(TYPES.Namespace.Integration)
export default class IntegrationController extends BaseHttpController {
    private integrationService: IntegrationService;

    constructor(
        @inject(TYPES.Services.Integration) integrationService: IntegrationService,
    ) {
        super();
        this.integrationService = integrationService;
    }

    @httpGet('/search')
    public async searchShows(
        @request() req: Request,
    ) {
        try {
            const { query } = req.query as { query: string };

            const content = await this.integrationService.searchShows(query);
            return this.json(content, 200);
        } catch (e: any) {
            console.error(e.message);
            return this.json(e.message, 500);
        }
    }
}
