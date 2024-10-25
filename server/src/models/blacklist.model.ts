import { Schema, model, Document } from 'mongoose';

export interface BlacklistDocument extends Document {
    email: string
}

export const blacklistSchema = new Schema<BlacklistDocument>({
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    minimize: false,
    versionKey: false,
});
