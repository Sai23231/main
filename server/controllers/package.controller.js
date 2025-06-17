import Package from "../models/package.js";

// Create a booking for a package
export const createPackageBooking = async (req, res) => {
  try {
    const { weddingDate, guests, additionalRequests, packageName } = req.body;

    const newBooking = new Package({
      weddingDate,
      guests,
      additionalRequests,
      packageName,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: `Booking for ${packageName} is confirmed!`,
      booking: savedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating booking.",
      error: error.message,
    });
  }
};

// Get all package bookings
export const getPackageBookings = async (req, res) => {
  try {
    const bookings = await Package.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching bookings.",
      error: error.message,
    });
  }
};
