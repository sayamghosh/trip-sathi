import express from 'express';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';
import { createBooking, getGuideBookings, getBookingMetrics, cancelBooking } from '../controllers/booking.controller.js';

const router = express.Router();

router.post('/', authMiddleware, isGuide, createBooking);
router.get('/mine', authMiddleware, isGuide, getGuideBookings);
router.get('/metrics', authMiddleware, isGuide, getBookingMetrics);
router.patch('/:id/cancel', authMiddleware, isGuide, cancelBooking);

export default router;
