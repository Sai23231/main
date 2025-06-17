import express from "express";
const router = express.Router();

// Controller function
import { questionnaire } from "../controllers/questionnaire.controller.js";

router.post("/question", questionnaire);

export default router; // Exporting router with default
