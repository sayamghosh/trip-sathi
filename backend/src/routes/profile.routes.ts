import { Router } from 'express';
import { updateGuideProfile } from '../controllers/profile.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// PATCH /api/profile/guide — update guide phone + address (requires auth JWT)
router.patch('/guide', authMiddleware, updateGuideProfile);

export default router;
