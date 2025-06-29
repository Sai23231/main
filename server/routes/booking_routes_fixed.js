import express from "express";
const router = express.Router();
import {
  createBooking,
  getBookings,
  getUserBookings,
  getVendorBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { verifyToken, verifyVendor } from "../middleware/verifyToken.js";

router.get("/", getBookings);
router.post("/create", createBooking);
router.get("/user-bookings", verifyToken, getUserBookings);
router.get("/vendor-bookings", verifyVendor, getVendorBookings);
router.put("/:bookingId/status", verifyVendor, updateBookingStatus);

export default router; 