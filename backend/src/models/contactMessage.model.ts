import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
    email: string;
    message: string;
    userId?: mongoose.Types.ObjectId;
    status: 'new' | 'resolved';
}

const ContactMessageSchema: Schema = new Schema({
    email: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['new', 'resolved'], default: 'new', index: true },
}, { timestamps: true });

export default mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);
