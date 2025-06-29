import express from "express";
import { 
  createBooking, 
  getVendorBookings, 
  getVenueBookings, 
  updateBookingStatus,
  getUserBookings,
  getBookings
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyVendor } from "../middleware/verifyVendor.js";
import { verifyVenue } from "../middleware/verifyVenue.js";

const router = express.Router();

// Public routes
router.post("/create", createBooking);

// Protected routes
router.get("/vendor", verifyToken, verifyVendor, getVendorBookings);
router.get("/venue", verifyToken, verifyVenue, getVenueBookings);
router.get("/user/:userId", verifyToken, getUserBookings);
router.put("/:bookingId/status", verifyToken, updateBookingStatus);

// Admin routes (optional)
router.get("/all", verifyToken, getBookings);

export default router; 