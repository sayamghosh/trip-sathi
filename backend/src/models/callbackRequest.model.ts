import mongoose, { Schema, Document } from 'mongoose';

export interface ICallbackRequest extends Document {
    guideId: mongoose.Types.ObjectId;
    tourPlanId: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    requesterName?: string;
    requesterPhone: string;
    status: 'pending' | 'contacted';
}

const CallbackRequestSchema: Schema = new Schema({
    guideId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tourPlanId: { type: Schema.Types.ObjectId, ref: 'TourPlan', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    requesterName: { type: String },
    requesterPhone: { type: String, required: true },
    status: { type: String, enum: ['pending', 'contacted'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<ICallbackRequest>('CallbackRequest', CallbackRequestSchema);