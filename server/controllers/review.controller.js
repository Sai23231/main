import mongoose, { isValidObjectId } from 'mongoose';
import Review from '../models/Review.model.js'; // make sure the path is correct
import Venue from '../models/Venue.model.js';   // make sure the path is correct
import Vendor from '../models/vendor.model.js'; // ensure correct path

export const addVenueReview = async (req, res) => {
  try {
    const { venueId } = req.params;
    if (!(venueId && isValidObjectId(venueId))) {
      return res.status(400).json({ message: 'Invalid venueId' });
    };
    const userId = req.id; // assumed to be coming from auth middleware
    const { rating, comment } = req.body;

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Create review
    const newReview = await Review.create({
      venueId : new mongoose.Types.ObjectId(venueId),
      userId: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
    });

    // Calculate average rating
    const reviews = await Review.find({ venueId: new mongoose.Types.ObjectId(venueId) });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    venue.averageRating = averageRating.toFixed(1); // rounded to 1 decimal
    await venue.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error adding venue review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addVendorReview = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const userId = req.id; // from auth middleware
    const { rating, comment } = req.body;

    // Validate ObjectId
    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({ message: 'Invalid vendorId' });
    }

    // Check if vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Create review
    const newReview = await Review.create({
      vendorId : new mongoose.Types.ObjectId(vendorId),
      userId: new mongoose.Types.ObjectId(userId),
      rating,
      comment,
    });

    // Calculate average rating
    const reviews = await Review.find({ vendorId: new mongoose.Types.ObjectId(vendorId) });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    vendor.averageRating = averageRating.toFixed(1); // rounded to 1 decimal
    await vendor.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error adding vendor review:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// export const getVenueReviewsById = async (req, res) => {
//   try {
//     const { venueId } = req.params;
//     if (!(venueId && isValidObjectId(venueId))) {
//       return res.status(400).json({ message: 'Invalid venueId' });
//     }

//     const reviews = await Review.find({
//       venueId: new mongoose.Types.ObjectId(venueId)
//     }).populate('name'); // optional: populate user details

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error('Error fetching venue reviews:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const getVenueReviewsById = async (req, res) => {
  try {
    const { venueId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit; 

    if (!(venueId && isValidObjectId(venueId))) {
      return res.status(400).json({ message: 'Invalid venueId' });
    }

    const totalReviews = await Review.countDocuments({ venueId: new mongoose.Types.ObjectId(venueId) });
    const totalPages = Math.ceil(totalReviews / limit);

    const reviews = await Review.find({ venueId: new mongoose.Types.ObjectId(venueId) })
      .populate('userId','email') // optional: populate user details
      .sort({ createdAt: -1 }) // optional: most recent first
      .skip(skip)
      .limit(limit);

    // console.log('venue reviews:', reviews);

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages,
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching venue reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// export const getVendorReviewsById = async (req, res) => {
//   try {
//     const { vendorId } = req.params;
//     if (!(vendorId && isValidObjectId(vendorId))) {
//       return res.status(400).json({ message: 'Invalid vendorId' });
//     }

//     const reviews = await Review.find({
//       vendorId: new mongoose.Types.ObjectId(vendorId)
//     }).populate('name'); // optional

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error('Error fetching vendor reviews:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const getVendorReviewsById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    if (!(vendorId && isValidObjectId(vendorId))) {
      return res.status(400).json({ message: 'Invalid vendorId' });
    }

    const totalReviews = await Review.countDocuments({ vendorId: new mongoose.Types.ObjectId(vendorId) });
    const totalPages = Math.ceil(totalReviews / limit);

    const reviews = await Review.find({ vendorId: new mongoose.Types.ObjectId(vendorId) })
      .populate('userId','email') // optional
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    // console.log('vendor reviews:', reviews);
    

    res.status(200).json({
      reviews,
      currentPage: page,
      totalPages,
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching vendor reviews:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
