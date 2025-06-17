import express from "express";
const router = express.Router();

// Controller import
import {
  createOrder,
  verifyPayment,
  getPaymentDetails,
} from "../controllers/payment.controller.js";

// ROUTE 1 : Create Order API Using POST Method http://localhost:3000/api/payment/order
router.post("/order", createOrder);

// ROUTE 2 : Verify Payment Using POST Method http://localhost:3000/api/payment/verify
router.post("/verify", verifyPayment);

// ROUTE 3 : Fetch Payment Details Using GET Method http://localhost:3000/api/payment/get-payment
router.get("/get-payment", getPaymentDetails);

export default router;
