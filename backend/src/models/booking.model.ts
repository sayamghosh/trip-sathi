import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    guideId: mongoose.Types.ObjectId;
    tourPlanId: mongoose.Types.ObjectId;
    callbackRequestId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;

    travelerName: string;
    travelerEmail?: string;
    travelerPhone: string;
    travelerAddress?: string;
    governmentIdNumber?: string;

    tripDate: Date;
    numberOfTravelers: number;
    finalPrice: number;

    paymentStatus: 'unpaid' | 'advance_paid' | 'fully_paid';
    advanceAmount?: number;

    status: 'confirmed' | 'cancelled';
    cancelledAt?: Date;
    cancellationReason?: string;

    notes?: string;
}

const BookingSchema: Schema = new Schema({
    guideId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tourPlanId: { type: Schema.Types.ObjectId, ref: 'TourPlan', required: true },
    callbackRequestId: { type: Schema.Types.ObjectId, ref: 'CallbackRequest' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },

    travelerName: { type: String, required: true },
    travelerEmail: { type: String },
    travelerPhone: { type: String, required: true },
    travelerAddress: { type: String },
    governmentIdNumber: { type: String },

    tripDate: { type: Date, required: true },
    numberOfTravelers: { type: Number, required: true, default: 1, min: 1 },
    finalPrice: { type: Number, required: true, min: 0 },

    paymentStatus: { type: String, enum: ['unpaid', 'advance_paid', 'fully_paid'], default: 'unpaid' },
    advanceAmount: { type: Number, min: 0 },

    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed', index: true },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },

    notes: { type: String },
}, { timestamps: true });

BookingSchema.index({ guideId: 1, status: 1, createdAt: -1 });
BookingSchema.index({ guideId: 1, status: 1, tripDate: -1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
