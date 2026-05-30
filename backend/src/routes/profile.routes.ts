import { Router } from 'express';
import { updateGuideProfile, getProfileMe } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// GET /api/profile/me — retrieve logged in user profile (requires auth JWT)
router.get('/me', authMiddleware, getProfileMe);

// PATCH /api/profile/guide — update guide phone + address (requires auth JWT)
router.patch('/guide', authMiddleware, updateGuideProfile);

export default router;
