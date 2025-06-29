import ServiceInquiry from '../models/ServiceInquiry.js';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

// Create a new service inquiry
const createServiceInquiry = catchAsync(async (req, res) => {
  const { name, phone, eventDate, vision, service } = req.body;
  
  // Add user ID if logged in
  const inquiryData = {
    name,
    phone,
    eventDate,
    vision,
    service
  };
  
  if (req.id && req.role === 'user') {
    inquiryData.user = req.id;
  }

  const serviceInquiry = await ServiceInquiry.create(inquiryData);

  res.status(201).json({
    success: true,
    message: 'Service inquiry submitted successfully',
    data: serviceInquiry
  });
});

// Get all service inquiries (for admin)
const getAllServiceInquiries = catchAsync(async (req, res) => {
  const inquiries = await ServiceInquiry.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: inquiries
  });
});

// Get service inquiries for a specific user
const getUserServiceInquiries = catchAsync(async (req, res) => {
  if (!req.id || req.role !== 'user') {
    throw new ApiError(401, 'User not authenticated');
  }

  const inquiries = await ServiceInquiry.find({ user: req.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: inquiries
  });
});

// Update service inquiry status (for admin)
const updateServiceInquiryStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const inquiry = await ServiceInquiry.findByIdAndUpdate(
    id,
    { status, adminNotes },
    { new: true }
  );

  if (!inquiry) {
    throw new ApiError(404, 'Service inquiry not found');
  }

  res.status(200).json({
    success: true,
    message: 'Service inquiry updated successfully',
    data: inquiry
  });
});

// Get service inquiry by ID
const getServiceInquiryById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const inquiry = await ServiceInquiry.findById(id)
    .populate('user', 'name email');

  if (!inquiry) {
    throw new ApiError(404, 'Service inquiry not found');
  }

  res.status(200).json({
    success: true,
    data: inquiry
  });
});

export {
  createServiceInquiry,
  getAllServiceInquiries,
  getUserServiceInquiries,
  updateServiceInquiryStatus,
  getServiceInquiryById
}; 