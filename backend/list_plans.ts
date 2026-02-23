import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TourPlan from './src/models/tourPlan.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-sathi';

import fs from 'fs';

async function listPlans() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const plans = await TourPlan.find({});
        fs.writeFileSync('plans_output.json', JSON.stringify(plans, null, 2));
        console.log('Saved plans to plans_output.json');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listPlans();
