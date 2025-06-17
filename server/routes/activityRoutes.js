import express from "express";
import {
  getActivities,
  logActivity,
} from "../controllers/activityController.js";

const router = express.Router();

router.get("/", getActivities);
router.post("/log", logActivity);

export default router;
