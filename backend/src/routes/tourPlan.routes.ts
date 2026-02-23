import express from 'express';
import { createTourPlan, getTourPlansByGuide, getTourPlanById } from '../controllers/tourPlan.controller.js';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, isGuide, createTourPlan);
router.get('/', authMiddleware, isGuide, getTourPlansByGuide);
router.get('/:id', getTourPlanById);

export default router;
