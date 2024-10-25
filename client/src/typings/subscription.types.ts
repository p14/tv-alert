// import { MediaContent } from './media.types';

export type Subscription = {
    _id: string
    email: string
    lastNotificationDate: Date | null
    lastPolledDate: Date | null
    mediaId: string
};

// export type SubscriptionMedia = MediaContent & {
//     _id: string
// };
