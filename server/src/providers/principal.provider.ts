import { interfaces } from 'inversify-express-utils';

export default class Principal implements interfaces.Principal {
    public details: any;

    public constructor(details: any) {
        this.details = details;
    }

    isAuthenticated(): Promise<boolean> {
        if (!this.details) {
            return Promise.resolve(false);
        }

        // Add a condition for authentication
        return Promise.resolve(this.details._id !== undefined);
    }

    isResourceOwner(resourceId: string): Promise<boolean> {
        if (!this.isAuthenticated()) {
            return Promise.resolve(false);
        }

        // Add a condition for a resource owner
        return Promise.resolve(resourceId === '1');
    }

    isInRole(role: string): Promise<boolean> {
        if (!this.isAuthenticated()) {
            return Promise.resolve(false);
        }

        // Add a condition for a role
        return Promise.resolve(role === 'admin');
    }
}
