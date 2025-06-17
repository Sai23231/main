import express from "express";
import {
  createPackageBooking,
  getPackageBookings,
} from "../controllers/package.controller.js";

const router = express.Router();

// Create a new package booking
router.post("/packages", createPackageBooking);

// Get all package bookings
router.get("/", getPackageBookings);

export default router;
