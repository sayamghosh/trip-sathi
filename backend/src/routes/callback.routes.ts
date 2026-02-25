import express from 'express';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';
import { createCallbackRequest, getGuideCallbacks } from '../controllers/callback.controller.js';

const router = express.Router();

router.post('/', createCallbackRequest);
router.get('/mine', authMiddleware, isGuide, getGuideCallbacks);

export default router;