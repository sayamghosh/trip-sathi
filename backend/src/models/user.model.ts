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
    isAuthorized: boolean;
    isActive: boolean;
    isProfilePublic: boolean;
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
    isAuthorized: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isProfilePublic: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
