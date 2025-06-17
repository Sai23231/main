import express from "express";
const router = express.Router();
import {
  createBooking,
  getBookings,
  getUserBookings,
} from "../controllers/booking.controller.js";
import verifyToken from "../middleware/verifyToken.js";

router.get("/", getBookings);
router.post("/create", createBooking);
router.get("/user-bookings", verifyToken, getUserBookings);

export default router;
