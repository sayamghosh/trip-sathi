import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterSubscriber extends Document {
    email: string;
    status: 'subscribed' | 'unsubscribed';
}

const NewsletterSubscriberSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed', index: true },
}, { timestamps: true });

export default mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', NewsletterSubscriberSchema);
