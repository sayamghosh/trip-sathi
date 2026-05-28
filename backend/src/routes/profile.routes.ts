import { Router } from 'express';
import { updateGuideProfile, getProfile, rechargeProfile } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/profile/me — fetch current user's profile
router.get('/me', authMiddleware, getProfile);

// POST /api/profile/recharge — recharge credits/validity
router.post('/recharge', authMiddleware, rechargeProfile);

// PATCH /api/profile/guide — update guide phone + address (requires auth JWT)
router.patch('/guide', authMiddleware, updateGuideProfile);

export default router;

