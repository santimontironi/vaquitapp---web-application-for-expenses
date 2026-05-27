import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verify-auth.js';
import { loginLimiter, registerLimiter } from '../middlewares/rate-limit.js';

export const router = Router();

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.get('/confirm/:token', authController.confirmUser);
router.get('/dashboard', verifyToken, authController.dashboardUser);
router.post('/logout', authController.logout);
