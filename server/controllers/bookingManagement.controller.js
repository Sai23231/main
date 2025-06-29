import Booking from '../models/Booking.js';
import Vendor from '../models/Vendor.model.js';
import Venue from '../models/Venue.model.js';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

// Get all bookings for admin
export const getAllBookings = catchAsync(async (req, res) => {
  const { status, userType, page = 1, limit = 10, search } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (userType) filter.userType = userType;
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } },
      { eventType: { $regex: search, $options: 'i' } }
    ];
  }

  const bookings = await Booking.find(filter)
    .populate('vendorId', 'businessName')
    .populate('venueId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(filter);

  res.json({
    success: true,
    data: bookings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});

// Get vendor's bookings
export const getVendorBookings = catchAsync(async (req, res) => {
  const user = req.user;
  const { status, page = 1, limit = 10 } = req.query;
  
  const filter = { vendorId: user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('venueId', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(filter);

  res.json({
    success: true,
    data: bookings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});

// Get venue's bookings
export const getVenueBookings = catchAsync(async (req, res) => {
  const user = req.user;
  const { status, page = 1, limit = 10 } = req.query;
  
  const filter = { venueId: user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate('vendorId', 'businessName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Booking.countDocuments(filter);

  res.json({
    success: true,
    data: bookings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});

// Update booking status
export const updateBookingStatus = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const { status, note } = req.body;
  const user = req.user;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check if user is authorized to update this booking
  const isVendor = booking.vendorId && booking.vendorId.toString() === user._id.toString();
  const isVenue = booking.venueId && booking.venueId.toString() === user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isVendor && !isVenue && !isAdmin) {
    throw new ApiError(403, 'Not authorized to update this booking');
  }

  // Validate status transition
  const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  booking.status = status;
  if (note) {
    booking.notes = booking.notes || [];
    booking.notes.push({
      text: note,
      addedBy: user._id,
      addedAt: new Date()
    });
  }

  await booking.save();

  res.json({
    success: true,
    message: 'Booking status updated successfully',
    data: booking
  });
});

// Get booking details
export const getBookingDetails = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user;

  const booking = await Booking.findById(bookingId)
    .populate('vendorId', 'businessName email phone')
    .populate('venueId', 'name email phone');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check authorization
  const isVendor = booking.vendorId && booking.vendorId._id.toString() === user._id.toString();
  const isVenue = booking.venueId && booking.venueId._id.toString() === user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isVendor && !isVenue && !isAdmin) {
    throw new ApiError(403, 'Not authorized to view this booking');
  }

  res.json({
    success: true,
    data: booking
  });
});

// Admin: Get booking statistics
export const getBookingStats = catchAsync(async (req, res) => {
  const { period = 'month' } = req.query;
  
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const stats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const totalBookings = await Booking.countDocuments({ createdAt: { $gte: startDate } });
  const totalRevenue = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      period,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats
    }
  });
});

// Vendor/Venue: Get dashboard stats
export const getDashboardStats = catchAsync(async (req, res) => {
  const user = req.user;
  const userType = req.baseUrl.includes('vendor') ? 'vendorId' : 'venueId';
  
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthBookings, lastMonthBookings, totalBookings, completedBookings] = await Promise.all([
    Booking.countDocuments({ [userType]: user._id, createdAt: { $gte: thisMonth } }),
    Booking.countDocuments({ [userType]: user._id, createdAt: { $gte: lastMonth, $lt: thisMonth } }),
    Booking.countDocuments({ [userType]: user._id }),
    Booking.countDocuments({ [userType]: user._id, status: 'completed' })
  ]);

  const revenue = await Booking.aggregate([
    {
      $match: {
        [userType]: user._id,
        status: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      thisMonthBookings,
      lastMonthBookings,
      totalBookings,
      completedBookings,
      totalRevenue: revenue[0]?.total || 0,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0
    }
  });
}); 