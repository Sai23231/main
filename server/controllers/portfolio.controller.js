import Vendor from '../models/Vendor.model.js';
import Venue from '../models/Venue.model.js';
import { ApiError } from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

// Upload portfolio images
export const uploadPortfolioImages = catchAsync(async (req, res) => {
  const user = req.user;
  const userType = req.baseUrl.includes('vendor') ? 'Vendor' : 'Venue';
  const userModel = userType === 'Vendor' ? Vendor : Venue;

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No images provided');
  }

  const uploadPromises = req.files.map(async (file) => {
    const result = await uploadOnCloudinary(file.path, 'portfolio');
    return {
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.originalname
    };
  });

  const uploadedImages = await Promise.all(uploadPromises);

  // Add images to user's portfolio
  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      $push: { portfolio: { $each: uploadedImages } }
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Portfolio images uploaded successfully',
    data: {
      portfolio: updatedUser.portfolio,
      uploadedImages
    }
  });
});

// Remove portfolio image
export const removePortfolioImage = catchAsync(async (req, res) => {
  const { imageId } = req.params;
  const user = req.user;
  const userType = req.baseUrl.includes('vendor') ? 'Vendor' : 'Venue';
  const userModel = userType === 'Vendor' ? Vendor : Venue;

  const currentUser = await userModel.findById(user._id);
  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  const imageToRemove = currentUser.portfolio.find(img => img._id.toString() === imageId);
  if (!imageToRemove) {
    throw new ApiError(404, 'Image not found in portfolio');
  }

  // Delete from Cloudinary
  if (imageToRemove.publicId) {
    await deleteFromCloudinary(imageToRemove.publicId);
  }

  // Remove from database
  const updatedUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      $pull: { portfolio: { _id: imageId } }
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Portfolio image removed successfully',
    data: {
      portfolio: updatedUser.portfolio
    }
  });
});

// Get portfolio images
export const getPortfolio = catchAsync(async (req, res) => {
  const user = req.user;
  const userType = req.baseUrl.includes('vendor') ? 'Vendor' : 'Venue';
  const userModel = userType === 'Vendor' ? Vendor : Venue;

  const currentUser = await userModel.findById(user._id);
  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    success: true,
    data: {
      portfolio: currentUser.portfolio || []
    }
  });
});

// Admin: Moderate portfolio images
export const moderatePortfolioImage = catchAsync(async (req, res) => {
  const { userId, imageId } = req.params;
  const { action, reason } = req.body; // action: 'approve' or 'reject'
  const userType = req.query.userType || 'Vendor';
  const userModel = userType === 'Vendor' ? Vendor : Venue;

  if (!['approve', 'reject'].includes(action)) {
    throw new ApiError(400, 'Invalid action. Must be "approve" or "reject"');
  }

  const user = await userModel.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const imageIndex = user.portfolio.findIndex(img => img._id.toString() === imageId);
  if (imageIndex === -1) {
    throw new ApiError(404, 'Image not found');
  }

  if (action === 'reject') {
    // Remove image if rejected
    const imageToRemove = user.portfolio[imageIndex];
    if (imageToRemove.publicId) {
      await deleteFromCloudinary(imageToRemove.publicId);
    }
    user.portfolio.splice(imageIndex, 1);
  } else {
    // Mark as approved
    user.portfolio[imageIndex].status = 'approved';
  }

  await user.save();

  res.json({
    success: true,
    message: `Portfolio image ${action}d successfully`,
    data: {
      portfolio: user.portfolio
    }
  });
});

// Admin: Get all pending portfolio images
export const getPendingPortfolioImages = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const vendors = await Vendor.find({
    'portfolio.status': 'pending'
  }).select('businessName portfolio');

  const venues = await Venue.find({
    'portfolio.status': 'pending'
  }).select('name portfolio');

  const allPendingImages = [];

  vendors.forEach(vendor => {
    vendor.portfolio.forEach(image => {
      if (image.status === 'pending') {
        allPendingImages.push({
          userId: vendor._id,
          userType: 'Vendor',
          userName: vendor.businessName,
          image
        });
      }
    });
  });

  venues.forEach(venue => {
    venue.portfolio.forEach(image => {
      if (image.status === 'pending') {
        allPendingImages.push({
          userId: venue._id,
          userType: 'Venue',
          userName: venue.name,
          image
        });
      }
    });
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedImages = allPendingImages.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedImages,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(allPendingImages.length / limit),
      totalItems: allPendingImages.length
    }
  });
}); 