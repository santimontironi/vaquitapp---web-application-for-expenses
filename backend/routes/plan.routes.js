import { Router } from "express";
import planController from "../controllers/plan.controller.js";
import { verifyToken } from "../middlewares/verify-auth.js";
import { verifyRole } from "../middlewares/verify-role.js";
import { upload } from "../middlewares/multer.js";
import { validateObjectId } from "../middlewares/validate-object-id.js";

export const router = Router();

router.get('/:idGroup/plans', verifyToken, validateObjectId('idGroup'), verifyRole, planController.getAllPlansByGroup);
router.get('/:idGroup/plans/:idPlan', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, planController.getPlanById);
router.post('/:idGroup/plans', verifyToken, validateObjectId('idGroup'), verifyRole, upload.single('image'), planController.createPlan);
router.patch('/:idGroup/plans/:idPlan/complete', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, planController.checkPlanAsCompleted);
router.patch('/:idGroup/plans/:idPlan/addMembers', verifyToken, validateObjectId('idGroup', 'idPlan'), verifyRole, planController.addMembersToPlan);