import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId?: string;
    email: string;
    name: string;
    picture?: string;
    role: string;
    phone?: string;
    address?: string;
    bio?: string;
    password?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    isActive: boolean;
    isProfilePublic: boolean;
    credits: number;
    planExpiresAt?: Date;
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    role: { type: String, default: 'traveller', enum: ['traveller', 'guide', 'admin'] },
    phone: { type: String },
    address: { type: String },
    bio: { type: String },
    password: { type: String },
    verificationStatus: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
    isActive: { type: Boolean, default: true },
    isProfilePublic: { type: Boolean, default: false },
    credits: { type: Number, default: 0 },
    planExpiresAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
