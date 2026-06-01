import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import { connectDB } from './config/db.js';

async function seed() {
    try {
        console.log('Connecting to database...');
        await connectDB();
        
        console.log('Checking for existing super admin user...');
        const existing = await User.findOne({ email: 'admin' });
        if (existing) {
            console.log('Super admin already exists. Updating schema fields...');
            existing.isAuthorized = true;
            existing.isActive = true;
            await existing.save();
            console.log('Super admin updated successfully.');
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB.');
            process.exit(0);
        }
        
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash('admin@ts.com', 10);
        
        console.log('Creating super admin user...');
        await User.create({
            googleId: 'super-admin',  // placeholder, not used for Google auth since we sparse-index it
            email: 'admin',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'admin',
            isAuthorized: true,
            isActive: true,
        });
        
        console.log('Super admin successfully created: email=admin, password=admin@ts.com');
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

seed();
