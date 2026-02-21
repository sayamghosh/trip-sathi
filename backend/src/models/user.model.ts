import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    email: string;
    name: string;
    picture: string;
    role: string;
}

const UserSchema: Schema = new Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    role: { type: String, default: 'traveller', enum: ['traveller', 'guide', 'admin'] },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
