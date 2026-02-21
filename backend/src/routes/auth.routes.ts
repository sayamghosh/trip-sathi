import { Router } from 'express';
import { googleLogin, googleGuideLogin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/google', googleLogin);
router.post('/google/guide', googleGuideLogin);

export default router;
