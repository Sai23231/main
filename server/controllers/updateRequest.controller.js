import UpdateRequest from '../models/UpdateRequest.js';
import Vendor from '../models/Vendor.model.js';
import Venue from '../models/Venue.model.js';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

// User submits a profile update request
export const submitRequest = catchAsync(async (req, res) => {
  const { field, value, reason } = req.body;
  const userType = req.baseUrl.includes('vendor') ? 'Vendor' : 'Venue';
  const user = req.user; // set by auth middleware

  if (!field || !value || !reason) {
    throw new ApiError(400, 'Field, value, and reason are required');
  }

  const newRequest = new UpdateRequest({
    userId: user._id,
    userType,
    userName: user.businessName || user.name || user.email,
    field,
    value,
    reason
  });

  await newRequest.save();
  
  res.status(201).json({
    success: true,
    message: 'Update request submitted successfully',
    data: newRequest
  });
});

// Admin: get all update requests
export const getAllRequests = catchAsync(async (req, res) => {
  const { status, userType, page = 1, limit = 10 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (userType) filter.userType = userType;

  const requests = await UpdateRequest.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('userId', 'businessName name email');

  const total = await UpdateRequest.countDocuments(filter);

  res.json({
    success: true,
    data: requests,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});

// Admin: approve or reject a request
export const handleRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { action, adminNote } = req.body;
  
  const request = await UpdateRequest.findById(id);
  if (!request) {
    throw new ApiError(404, 'Update request not found');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'Request has already been handled');
  }

  if (!['approve', 'reject'].includes(action)) {
    throw new ApiError(400, 'Invalid action. Must be "approve" or "reject"');
  }

  if (action === 'approve') {
    // Update the user's profile
    const userModel = request.userType === 'Vendor' ? Vendor : Venue;
    const updateData = { [request.field]: request.value };
    
    const updatedUser = await userModel.findByIdAndUpdate(
      request.userId, 
      updateData,
      { new: true }
    );
    
    if (!updatedUser) {
      throw new ApiError(404, 'User not found');
    }
    
    request.status = 'approved';
  } else {
    request.status = 'rejected';
  }
  
  request.adminNote = adminNote || '';
  await request.save();
  
  res.json({
    success: true,
    message: `Request ${action}d successfully`,
    data: request
  });
});

// Get user's own update requests
export const getUserRequests = catchAsync(async (req, res) => {
  const user = req.user;
  const userType = req.baseUrl.includes('vendor') ? 'Vendor' : 'Venue';
  
  const requests = await UpdateRequest.find({
    userId: user._id,
    userType
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: requests
  });
});

// Delete a request (only if pending)
export const deleteRequest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  const request = await UpdateRequest.findById(id);
  if (!request) {
    throw new ApiError(404, 'Update request not found');
  }

  // Only allow deletion if user owns the request and it's pending
  if (request.userId.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this request');
  }

  if (request.status !== 'pending') {
    throw new ApiError(400, 'Cannot delete non-pending request');
  }

  await UpdateRequest.findByIdAndDelete(id);
  
  res.json({
    success: true,
    message: 'Request deleted successfully'
  });
}); 