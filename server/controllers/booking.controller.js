import mongoose, { isValidObjectId } from "mongoose";
import Booking from "../models/booking.model.js";

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
    const { vendorId, userId, phone, eventDate } = req.body;

    const booking = await Booking.create({
      vendorId: new mongoose.Types.ObjectId(vendorId),
      userId: new mongoose.Types.ObjectId(userId),
      phone,
      eventDate,
    });
    res
      .status(201)
      .json({ success: true, message: "Booking created successfully!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while creating the booking.",
      });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.id;
    if (!(userId && isValidObjectId(userId))) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "vendorlists",
          let: { vendorId: "$vendorId" },
          localField: "vendorId",
          foreignField: "_id",
          as: "vendorDetails",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                CoverImage: 1,
                location: 1,
                contact: {
                  phone: 1,
                },
                type: 1,
                pricing: {
                  package: 1,
                  price: 1,
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          eventDate: 1,
          status: 1,
          createdAt: 1,
          vendorDetails: { $arrayElemAt: ["$vendorDetails", 0] },
        },
      },
    ]);

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
