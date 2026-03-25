import { Router } from "express";
import groupController from "../controllers/group.controller.js";

export const router = Router();

router.post('/createGroup', groupController.createGroup);