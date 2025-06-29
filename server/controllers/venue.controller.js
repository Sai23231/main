import Venue from "../models/Venue.model.js";
import Review from "../models/Review.model.js";
import mongoose from "mongoose";
import { isValidObjectId } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all venues (return all, no status filter)
export const getVenues = async (req, res) => {
  try {
    // Return all venues
    const venues = await Venue.find({});
    // Normalize for frontend
    const formattedVenues = venues.map(venue => ({
      _id: venue._id,
      name: venue.name,
      location: venue.location,
      pax: venue.pax,
      guests: venue.guests,
      capacity: venue.capacity,
      price: venue.price,
      rentPrice: venue.rentPrice,
      CoverImage: venue.coverImgSrc || (venue.photos && venue.photos[0]) || 'https://via.placeholder.com/400x300?text=No+Image',
      contact: venue.contact,
      photos: venue.photos,
      categories: venue.categories,
      services: venue.services,
      policies: venue.policies,
      mapEmbedUrl: venue.mapEmbedUrl,
      averageRating: venue.averageRating || 0,
      status: venue.status
    }));
    res.status(200).json({ venues: formattedVenues });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a venue
export const getVenueReviews = async (req, res) => {
  try {
    const { venueId } = req.params;
    const reviews = await Review.find({ venueId: new mongoose.Types.ObjectId(venueId) });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

//Add Review //Its for loggedIn user
export const addReview = async (req, res) => {    
  try {
    const { venueId } = req.params;
    // const { userId, rating, comment } = req.body;
    const { rating, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const newReview = await Review.create({
      venueId: venueId,
      // userId: userId,
      rating: rating,
      comment: comment
    })

    // Update Average Rating
    const reviews = await Review.find({ venueId:venueId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    venue.averageRating = averageRating.toFixed(1); // Round to 1 decimal place
    await venue.save();

    res.status(201).json({ message: "Review added successfully", newReview, updatedRating: venue.averageRating });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};

//Its for Dashboard, currently use postman to create venues
// export const addVenue = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       location,
//       pax,
//       guests,
//       capacity,
//       price,
//       rentPrice,
//       coverImgSrc,
//       contact,
//       photos,
//       categories,
//       services,
//       policies,
//       mapEmbedUrl,
//       // detailUrl
//     } = req.body;

//     // Validate required fields
//     if (
//       !name || !location || !pax || !guests || !capacity?.seating || !capacity?.maxCapacity ||
//       !price?.veg || !rentPrice || !coverImgSrc || !contact?.phone || !mapEmbedUrl
//     ) {
//       return res.status(400).json({message: "All Fields are Required"});
//     }

//     // Creating new venue instance
//     const newVenue = await Venue.create({
//       name:name,
//       description:description,
//       location:location,
//       pax:pax,
//       guests:guests,
//       capacity:capacity,
//       price:price,
//       rentPrice:rentPrice,
//       coverImgSrc:coverImgSrc,
//       contact:contact,
//       photos:photos,
//       categories:categories,
//       services:services,
//       policies:policies,
//       mapEmbedUrl:mapEmbedUrl,
//       // detailUrl:detailUrl,
//     });

//     res.status(200).json(newVenue);

//   } catch (error) {
//     console.error("Error adding venue:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addVenue = async (req, res) => {
  try {
    let {
      name,
      description,
      location,
      pax,
      guests,
      capacity,
      price,
      rentPrice,
      contact,
      categories,
      services,
      policies,
      mapEmbedUrl,
    } = req.body;

    const parseJSONField = (field, fieldName) => {
      try {
        return JSON.parse(field);
      } catch (err) {
        throw new Error(`Invalid JSON in field: ${fieldName}`);
      }
    };
    
    try {
      capacity = parseJSONField(req.body.capacity, 'capacity');
      price = parseJSONField(req.body.price, 'price');
      contact = parseJSONField(req.body.contact, 'contact');
      categories = parseJSONField(req.body.categories, 'categories');
      services = parseJSONField(req.body.services, 'services');
      policies = parseJSONField(req.body.policies, 'policies');
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
    

    // Validate required fields
    if (
      !name || !location || !pax || !guests ||
      !capacity?.seating || !capacity?.maxCapacity ||
      !price?.veg || !rentPrice ||
      !contact?.phone || !contact?.email ||
      !mapEmbedUrl
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Handle cover image upload
    const coverImageFile = req.files?.['coverImgSrc']?.[0];
    let uploadedCoverImg = null;

    if (coverImageFile) {
      uploadedCoverImg = await uploadOnCloudinary(coverImageFile.path);
    } else {
      return res.status(400).json({ message: "Cover image is required." });
    }

    // Handle photos upload
    const photoFiles = req.files?.['photos'] || [];
    const uploadedPhotos = [];

    for (const photo of photoFiles) {
      const uploaded = await uploadOnCloudinary(photo.path);
      uploadedPhotos.push(uploaded.url); // or secure_url if you prefer
    }

    // Create and save new venue
    const newVenue = await Venue.create({
      name,
      description,
      location,
      pax,
      guests,
      capacity,
      price,
      rentPrice,
      coverImgSrc: uploadedCoverImg.url,
      contact,
      photos: uploadedPhotos,
      categories,
      services,
      policies,
      mapEmbedUrl,
    });

    return res.status(201).json(newVenue);

  } catch (error) {
    console.error("Error adding venue:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get venue details (return all, no status filter)
export const getVenueDetails = async (req, res) => {
  try {
    const { venueId } = req.params;
    
    if (!isValidObjectId(venueId)) {
      return res.status(400).json({ message: "Invalid venue ID" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Format venue data for frontend
    const formattedVenue = {
      _id: venue._id,
      name: venue.name,
      location: venue.location,
      pax: venue.pax,
      guests: venue.guests,
      capacity: venue.capacity,
      price: venue.price,
      rentPrice: venue.rentPrice,
      CoverImage: venue.coverImgSrc || (venue.photos && venue.photos[0]) || 'https://via.placeholder.com/400x300?text=No+Image',
      contact: venue.contact,
      photos: venue.photos || [],
      categories: venue.categories,
      services: venue.services,
      policies: venue.policies,
      mapEmbedUrl: venue.mapEmbedUrl,
      averageRating: venue.averageRating || 0,
      status: venue.status,
      description: venue.description
    };

    res.status(200).json(formattedVenue);
  } catch (error) {
    console.error("Error fetching venue details:", error);
    res.status(500).json({ message: "Error fetching venue details" });
  }
};

// Venue Authentication Controllers
export const venueLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find venue by email
    const venue = await Venue.findOne({ email: email.toLowerCase() });
    if (!venue) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if venue has a password (for existing venues without passwords)
    if (!venue.password) {
      // For existing venues without passwords, create one
      const hashedPassword = await bcrypt.hash(password, 10);
      venue.password = hashedPassword;
      venue.status = 'pending'; // Set status to pending for existing venues
      await venue.save();
    } else {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, venue.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: venue._id, role: 'venue' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Format venue data for response
    const venueData = {
      id: venue._id,
      name: venue.name || 'Venue Name',
      email: venue.email,
      type: 'venue',
      location: venue.location || 'Location not specified',
      status: venue.status || 'pending',
      description: venue.description || 'No description available',
      CoverImage: venue.coverImgSrc || (venue.photos && venue.photos[0]) || '',
      rating: venue.averageRating || '0.0',
      reviews: 0, // Will be calculated separately
      averageRating: venue.averageRating || 0,
      capacity: venue.capacity || 0,
      pricing: venue.price || { package: 'Standard Package', price: 'Contact for pricing' },
      contact: venue.contact || { phone: '', email: venue.email || '', website: '' },
      photos: venue.photos || [],
      amenities: venue.services || [],
      businessDetails: {},
      businessHours: {},
      socialMedia: {},
      submittedAt: venue.createdAt,
      approvedAt: venue.status === 'approved' ? venue.updatedAt : null,
      role: 'venue'
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      venue: venueData,
      token
    });
  } catch (error) {
    console.error("Venue login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const venueLogout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Venue logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const checkVenueAuth = async (req, res) => {
  try {
    const venueId = req.id;
    const venue = await Venue.findById(venueId).select('-password');
    
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found"
      });
    }

    // Format venue data
    const venueData = {
      id: venue._id,
      name: venue.name || 'Venue Name',
      email: venue.email,
      type: 'venue',
      location: venue.location || 'Location not specified',
      status: venue.status || 'pending',
      description: venue.description || 'No description available',
      CoverImage: venue.coverImgSrc || (venue.photos && venue.photos[0]) || '',
      rating: venue.averageRating || '0.0',
      reviews: 0,
      averageRating: venue.averageRating || 0,
      capacity: venue.capacity || 0,
      pricing: venue.price || { package: 'Standard Package', price: 'Contact for pricing' },
      contact: venue.contact || { phone: '', email: venue.email || '', website: '' },
      photos: venue.photos || [],
      amenities: venue.services || [],
      businessDetails: {},
      businessHours: {},
      socialMedia: {},
      submittedAt: venue.createdAt,
      approvedAt: venue.status === 'approved' ? venue.updatedAt : null,
      role: 'venue'
    };

    res.status(200).json({
      success: true,
      venue: venueData
    });
  } catch (error) {
    console.error("Check venue auth error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getVenueProfile = async (req, res) => {
  try {
    const venueId = req.id;
    const venue = await Venue.findById(venueId).select('-password');
    
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found"
      });
    }

    // Format venue data
    const venueData = {
      id: venue._id,
      name: venue.name || 'Venue Name',
      email: venue.email,
      type: 'venue',
      location: venue.location || 'Location not specified',
      status: venue.status || 'pending',
      description: venue.description || 'No description available',
      CoverImage: venue.coverImgSrc || (venue.photos && venue.photos[0]) || '',
      rating: venue.averageRating || '0.0',
      reviews: 0,
      averageRating: venue.averageRating || 0,
      capacity: venue.capacity || 0,
      pricing: venue.price || { package: 'Standard Package', price: 'Contact for pricing' },
      contact: venue.contact || { phone: '', email: venue.email || '', website: '' },
      photos: venue.photos || [],
      amenities: venue.services || [],
      businessDetails: {},
      businessHours: {},
      socialMedia: {},
      submittedAt: venue.createdAt,
      approvedAt: venue.status === 'approved' ? venue.updatedAt : null,
      role: 'venue'
    };

    res.status(200).json({
      success: true,
      venue: venueData
    });
  } catch (error) {
    console.error("Get venue profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateVenueProfile = async (req, res) => {
  try {
    const venueId = req.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.password;
    delete updateData.email; // Email should be updated through a separate process
    delete updateData.status; // Status should be managed by admin
    delete updateData.role;

    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedVenue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found"
      });
    }

    // Format venue data for response
    const venueData = {
      id: updatedVenue._id,
      name: updatedVenue.name || 'Venue Name',
      email: updatedVenue.email,
      type: 'venue',
      location: updatedVenue.location || 'Location not specified',
      status: updatedVenue.status || 'pending',
      description: updatedVenue.description || 'No description available',
      CoverImage: updatedVenue.coverImgSrc || (updatedVenue.photos && updatedVenue.photos[0]) || '',
      rating: updatedVenue.averageRating || '0.0',
      reviews: 0,
      averageRating: updatedVenue.averageRating || 0,
      capacity: updatedVenue.capacity || 0,
      pricing: updatedVenue.price || { package: 'Standard Package', price: 'Contact for pricing' },
      contact: updatedVenue.contact || { phone: '', email: updatedVenue.email || '', website: '' },
      photos: updatedVenue.photos || [],
      amenities: updatedVenue.services || [],
      businessDetails: {},
      businessHours: {},
      socialMedia: {},
      submittedAt: updatedVenue.createdAt,
      approvedAt: updatedVenue.status === 'approved' ? updatedVenue.updatedAt : null,
      role: 'venue'
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      venue: venueData
    });
  } catch (error) {
    console.error("Update venue profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const uploadVenueImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const venueId = req.id;
    const imageUrl = req.file.path; // This will be the path to the uploaded file

    // Update venue's cover image
    const venue = await Venue.findByIdAndUpdate(
      venueId,
      { coverImgSrc: imageUrl },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading venue image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const uploadVenuePortfolio = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided",
      });
    }

    const venueId = req.id;
    const imageUrls = req.files.map(file => file.path);

    // Get current venue and add new images to portfolio
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    // Add new images to existing photos array
    const updatedPhotos = [...(venue.photos || []), ...imageUrls];

    // Update venue's portfolio
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { photos: updatedPhotos },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      imageUrls: imageUrls,
      totalImages: updatedPhotos.length
    });
  } catch (error) {
    console.error("Error uploading venue portfolio images:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const removeVenuePortfolioImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const venueId = req.id;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL is required",
      });
    }

    // Get current venue
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    // Remove the image from photos array
    const updatedPhotos = venue.photos.filter(photo => photo !== imageUrl);

    // Update venue's portfolio
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { photos: updatedPhotos },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Image removed successfully",
      totalImages: updatedPhotos.length
    });
  } catch (error) {
    console.error("Error removing venue portfolio image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};