import express from 'express';
import { optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { createContactMessage } from '../controllers/contactMessage.controller.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, createContactMessage);

export default router;
