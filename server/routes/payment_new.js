import express from "express";
const router = express.Router();

// Controller import
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  createSponsorPaymentOrder,
  verifySponsorPayment,
  getOrganizerPayments,
  getSponsorPayments
} from "../controllers/payment.controller.js";

// Middleware import
import { verifyToken } from "../middleware/verifyToken.js";

// Legacy payment routes (for backward compatibility)
router.post("/order", createOrder);
router.post("/verify", verifyPayment);

// Sponsor payment routes (with authentication)
router.post("/sponsor/create-order", verifyToken, createSponsorPaymentOrder);
router.post("/sponsor/verify", verifyToken, verifySponsorPayment);

// Payment history routes
router.get("/organizer/history", verifyToken, getOrganizerPayments);
router.get("/sponsor/:sponsorId/history", verifyToken, getSponsorPayments);

// Admin payment details (requires admin role)
router.get("/admin/details", verifyToken, getPaymentDetails);

// Legacy route for backward compatibility
router.get("/get-payment", getPaymentDetails);

export default router; 