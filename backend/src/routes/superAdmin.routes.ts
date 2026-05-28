import express from 'express';
import {
    superAdminLogin,
    getSuperAdminProfile,
    listAgents,
    getAgentById,
    verifyAgent,
    toggleAgentStatus,
    getAgentMetrics,
    getAgentPackages,
    adjustAgentBilling
} from '../controllers/superAdmin.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public auth route
router.post('/login', superAdminLogin);

// Protected routes (Admin role only)
router.get('/me', authMiddleware, isAdmin, getSuperAdminProfile);
router.get('/agents', authMiddleware, isAdmin, listAgents);
router.get('/agents/:id', authMiddleware, isAdmin, getAgentById);
router.patch('/agents/:id/verify', authMiddleware, isAdmin, verifyAgent);
router.patch('/agents/:id/status', authMiddleware, isAdmin, toggleAgentStatus);
router.patch('/agents/:id/billing', authMiddleware, isAdmin, adjustAgentBilling);
router.get('/agents/:id/metrics', authMiddleware, isAdmin, getAgentMetrics);
router.get('/agents/:id/packages', authMiddleware, isAdmin, getAgentPackages);

export default router;
