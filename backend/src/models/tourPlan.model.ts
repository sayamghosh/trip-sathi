import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityItem {
    type: 'transfer' | 'sightseeing' | 'hotel' | 'meal' | 'other';
    title: string;
    description: string;
    duration?: string; // e.g. "2 hrs"
    images: string[];
    hotelRef?: mongoose.Types.ObjectId; // If type is 'hotel', reference the hotel
}

export interface IDayPlan {
    dayNumber: number;
    title: string; // e.g. "Port Blair", "Arrival and Cellular Jail"
    activities: IActivityItem[];
}

export interface ITourPlan extends Document {
    guideId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    basePrice: number;
    durationDays: number;
    durationNights: number;
    locations: string[]; // e.g. ["Port Blair", "Havelock"]
    bannerImages?: string[]; // Images for the landing page banner
    days: IDayPlan[];
}

const ActivityItemSchema = new Schema<IActivityItem>({
    type: { type: String, enum: ['transfer', 'sightseeing', 'hotel', 'meal', 'other'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    images: [{ type: String }],
    hotelRef: { type: Schema.Types.ObjectId, ref: 'Hotel' }
});

const DayPlanSchema = new Schema<IDayPlan>({
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [ActivityItemSchema]
});

const TourPlanSchema: Schema = new Schema({
    guideId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },
    locations: [{ type: String }],
    bannerImages: [{ type: String }],
    days: [DayPlanSchema]
}, { timestamps: true });

export default mongoose.model<ITourPlan>('TourPlan', TourPlanSchema);
