import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
    guideId: mongoose.Types.ObjectId;
    name: string;
    location: string;
    description: string;
    images: string[];
    amenities: string[];
    pricePerNight: number;
}

const HotelSchema: Schema = new Schema({
    guideId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    pricePerNight: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IHotel>('Hotel', HotelSchema);
