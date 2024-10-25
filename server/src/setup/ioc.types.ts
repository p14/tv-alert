const TYPES = {
    AuthMiddleware: Symbol('AuthMiddleware'),
    AuthProvider: Symbol('AuthProvider'),
    MongoDBClient: Symbol('MongoDBClient'),
    Repositories: {
        Blacklist: Symbol('BlacklistRepository'),
        Subscription: Symbol('SubscriptionRepository'),
    },
    Services: {
        Auth: Symbol('AuthService'),
        Cron: Symbol('CronService'),
        Integration: Symbol('IntegrationService'),
        Mailer: Symbol('MailerService'),
        Subscription: Symbol('SubscriptionService'),
    },
    Namespace: {
        Auth: '/auth',
        Integration: '/integrations',
        Subscription: '/subscriptions',
    },
};

export default TYPES;
