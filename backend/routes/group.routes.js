import { Router } from "express";
import groupController from "../controllers/group.controller.js";
import { verifyToken } from "../middlewares/verify-auth.js";
import { verifyRole } from "../middlewares/verify-role.js";
import { upload } from "../middlewares/multer.js";

export const router = Router();

router.get('/groups', verifyToken, groupController.getAllGroupsByUser);
router.get('/groups/:idGroup', verifyToken, verifyRole, groupController.getGroupById);
router.post('/groups', verifyToken, upload.single('image'), groupController.createGroup);
router.delete('/groups/:idGroup', verifyToken, verifyRole, groupController.deleteGroup);
router.post('/groups/:idGroup/invite', verifyToken, verifyRole, groupController.addMemberToGroup);
router.post('/groups/invite/accept', verifyToken, groupController.acceptInvitation);
router.patch('/groups/:idGroup', verifyToken, verifyRole, upload.single('image'), groupController.editGroup);
router.patch('/groups/:idGroup/members/:idMember/admin', verifyToken, verifyRole, groupController.giveAdminRole);