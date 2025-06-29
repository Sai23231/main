import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";

// Controller function
import { createPricingPlans } from "../controllers/pricingPlans.controller.js";

router.post("/create", verifyToken, createPricingPlans);

export default router;
