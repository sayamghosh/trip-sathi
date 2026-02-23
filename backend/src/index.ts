import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import hotelRoutes from './routes/hotel.routes.js';
import tourPlanRoutes from './routes/tourPlan.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Init DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/tour-plans', tourPlanRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Trip Sathi API is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
