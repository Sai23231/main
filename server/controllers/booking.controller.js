import mongoose, { isValidObjectId } from "mongoose";
import Booking from "../models/Booking.js";
import { createBookingNotification, createBookingStatusNotification } from "../utils/notificationService.js";
import VendorList from "../models/Vendor.model.js";
import User from "../models/user.model.js";
import Vendor from "../models/Vendor.model.js";
import Venue from "../models/Venue.model.js";

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for a specific vendor
export const getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.id; // from auth middleware
    if (!isValidObjectId(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }
    const bookings = await Booking.find({ vendorId });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Bookings for Venue Dashboard (optional)
export const getVenueBookings = async (req, res) => {
  try {
    const venueId = req.id; // from auth middleware
    if (!isValidObjectId(venueId)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }
    const bookings = await Booking.find({ venueId });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status (for vendors/venues)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, message, quotedPrice } = req.body;
    const userId = req.id; // From auth middleware

    if (!bookingId || !isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID"
      });
    }

    // Updated status values to match frontend expectations
    const validStatuses = ["pending", "confirmed", "rejected", "cancelled", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    // Find the booking and verify it belongs to this vendor/venue
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if user is authorized to update this booking
    const isVendor = booking.vendorId && booking.vendorId.toString() === userId;
    const isVenue = booking.venueId && booking.venueId.toString() === userId;
    
    if (!isVendor && !isVenue) {
      return res.status(403).json({
        success: false,
        message: "You can only update bookings for your own services"
      });
    }

    // Update booking status
    const updateData = {
      status,
      updatedAt: new Date(),
      vendorResponse: {
        message: message || "",
        respondedAt: new Date(),
        respondedBy: userId
      }
    };

    // Add quoted price if provided
    if (quotedPrice && status === "confirmed") {
      updateData.quotedPrice = quotedPrice;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    // Create notification for user (optional)
    try {
      await createBookingStatusNotification(booking.userId, {
        bookingId: booking._id,
        status,
        vendorName: isVendor ? "Your vendor" : "Your venue",
        message: message || ""
      });
    } catch (notificationError) {
      console.error("Error creating status notification:", notificationError);
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: updatedBooking
    });

  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the booking status."
    });
  }
};
