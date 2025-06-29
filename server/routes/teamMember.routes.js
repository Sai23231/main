import express from "express";
import { getTeamMembers, getUserTeamMembers, addTeamMember, addUserTeamMember } from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", getTeamMembers);
router.get("/getUserTeamMembers", verifyToken, getUserTeamMembers);
router.post("/add", addTeamMember);
router.post("/addUserTeamMember", verifyToken, addUserTeamMember);

export default router;
