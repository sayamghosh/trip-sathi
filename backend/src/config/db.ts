import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-sathi';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
