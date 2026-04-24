import mongoose, { Schema, Document } from 'mongoose';

export interface ICallbackRequest extends Document {
    guideId: mongoose.Types.ObjectId;
    tourPlanId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    requesterName?: string;
    requesterEmail?: string;
    requesterPhone?: string;
    status: 'pending' | 'positive' | 'negative';
    isRead: boolean;
}

const CallbackRequestSchema: Schema = new Schema({
    guideId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tourPlanId: { type: Schema.Types.ObjectId, ref: 'TourPlan', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    requesterName: { type: String },
    requesterEmail: { type: String },
    requesterPhone: { type: String },
    status: { type: String, enum: ['pending', 'positive', 'negative'], default: 'pending' },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ICallbackRequest>('CallbackRequest', CallbackRequestSchema);