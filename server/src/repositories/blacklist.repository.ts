import { injectable } from 'inversify';
import { BlacklistDocument, blacklistSchema } from '../models/blacklist.model';
import Repository from './_repository';

/* istanbul ignore next */
@injectable()
export default class BlacklistRepository extends Repository<BlacklistDocument> {
    public constructor() {
        super('blacklists', blacklistSchema);
    }
}
