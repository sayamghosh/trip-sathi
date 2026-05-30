import express from 'express';
import {
    superAdminLogin,
    getSuperAdminProfile,
    listAgents,
    getAgentById,
    authorizeAgent,
    toggleAgentStatus,
    getAgentMetrics,
    getAgentPackages
} from '../controllers/superAdmin.controller.js';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public auth route
router.post('/login', superAdminLogin);

// Protected routes (Admin role only)
router.get('/me', authMiddleware, isAdmin, getSuperAdminProfile);
router.get('/agents', authMiddleware, isAdmin, listAgents);
router.get('/agents/:id', authMiddleware, isAdmin, getAgentById);
router.patch('/agents/:id/authorize', authMiddleware, isAdmin, authorizeAgent);
router.patch('/agents/:id/status', authMiddleware, isAdmin, toggleAgentStatus);
router.get('/agents/:id/metrics', authMiddleware, isAdmin, getAgentMetrics);
router.get('/agents/:id/packages', authMiddleware, isAdmin, getAgentPackages);

export default router;
