import express from 'express';
import { createHotel, getHotelsByGuide } from '../controllers/hotel.controller.js';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, isGuide, createHotel);
router.get('/', authMiddleware, isGuide, getHotelsByGuide);

export default router;
