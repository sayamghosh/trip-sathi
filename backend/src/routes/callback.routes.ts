import express from 'express';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';
import { createCallbackRequest, getGuideCallbacks, markCallbackAsRead } from '../controllers/callback.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createCallbackRequest);
router.get('/mine', authMiddleware, isGuide, getGuideCallbacks);
router.patch('/:id/read', authMiddleware, isGuide, markCallbackAsRead);

export default router;