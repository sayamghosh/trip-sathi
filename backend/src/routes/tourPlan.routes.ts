import express from 'express';
import { createTourPlan, getAllTourPlans, getTourPlansByGuide, getTourPlanById, updateTourPlan } from '../controllers/tourPlan.controller.js';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/public', getAllTourPlans);
router.post('/', authMiddleware, isGuide, createTourPlan);
router.get('/', authMiddleware, isGuide, getTourPlansByGuide);
router.get('/:id', getTourPlanById);
router.put('/:id', authMiddleware, isGuide, updateTourPlan);

export default router;
