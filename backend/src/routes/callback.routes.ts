import express from 'express';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';
import { createCallbackRequest, getGuideCallbacks, markCallbackAsRead, updateCallbackStatus } from '../controllers/callback.controller.js';

const router = express.Router();

router.post('/', authMiddleware, createCallbackRequest);
router.get('/mine', authMiddleware, isGuide, getGuideCallbacks);
router.patch('/:id/read', authMiddleware, isGuide, markCallbackAsRead);
router.patch('/:id/status', authMiddleware, isGuide, updateCallbackStatus);

export default router;