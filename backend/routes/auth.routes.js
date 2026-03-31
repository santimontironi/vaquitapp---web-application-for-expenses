import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verify-auth.js';

export const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/confirm/:token', authController.confirmUser);
router.get('/dashboard', verifyToken, authController.dashboardUser);
