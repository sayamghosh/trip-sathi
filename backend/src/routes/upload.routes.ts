import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { authMiddleware, isGuide } from '../middleware/auth.middleware.js';

const router = express.Router();

// Memory storage keeps the file as a Buffer entirely in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authMiddleware, isGuide, upload.single('image'), uploadImage);

export default router;
