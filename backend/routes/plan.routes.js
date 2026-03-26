import { Router } from "express";
import planController from "../controllers/plan.controller.js";
import { verifyToken } from "../middlewares/verify-auth.js";
import { verifyRole } from "../middlewares/verify-role.js";
import { upload } from "../middlewares/multer.js";

export const router = Router();

router.get('/:idGroup/plans', verifyToken, verifyRole, planController.getAllPlansByGroup);
router.post('/:idGroup/plans', verifyToken, verifyRole, upload.single('image'), planController.createPlan);