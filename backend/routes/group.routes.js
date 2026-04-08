import { Router } from "express";
import groupController from "../controllers/group.controller.js";
import { verifyToken } from "../middlewares/verify-auth.js";
import { verifyRole } from "../middlewares/verify-role.js";
import { upload } from "../middlewares/multer.js";

export const router = Router();

// Grupos
router.get('/groups', verifyToken, groupController.getAllGroupsByUser);
router.get('/groups/:idGroup', verifyToken, verifyRole, groupController.getGroupById);
router.patch('/groups/:idGroup', verifyToken, verifyRole, upload.single('image'), groupController.editGroup);
router.delete('/groups/:idGroup', verifyToken, verifyRole, groupController.deleteGroup);
router.post('/groups', verifyToken, upload.single('image'), groupController.createGroup);

// Miembros
router.get('/groups/:idGroup/members', verifyToken, verifyRole, groupController.getGroupMembers);
router.delete('/groups/:idGroup/members/:idMember', verifyToken, verifyRole, groupController.deleteMemberFromGroup);
router.patch('/groups/:idGroup/members/:idMember/admin', verifyToken, verifyRole, groupController.giveAdminRole);

// Invitaciones
router.post('/groups/:idGroup/invite', verifyToken, verifyRole, groupController.addMemberToGroup);
router.get('/groups/invite/accept/:token', groupController.acceptInvitation);