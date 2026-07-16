import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// mongodb+srv:// URIs require DNS SRV-record lookups. Some networks/ISP DNS
// servers refuse or drop these queries (ECONNREFUSED on querySrv), so pin a
// public resolver that reliably supports them instead of relying on the
// system-configured DNS server.
if (process.env.MONGODB_URI?.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-sathi';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            family: 4,
        });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};
